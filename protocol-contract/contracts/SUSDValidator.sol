// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./Types.sol";
import "./pyth/IPyth.sol";
import "./pyth/PythStructs.sol";
import "./Types.sol";
import "./SUSD.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SUSDValidator is ReentrancyGuard, Ownable {
    // variables
    IPyth pyth;
    SUSD i_usd;

    bytes32 private constant PRICE_ID =
        0xf80ba6864e3f1b36c873bcb2767079d5fb86cf04855e714b2a0f30d7e0830a24; // vic/usd
    uint256 private constant MAX_LTV = 75; // 75% max ltv
    uint256 private constant LIQUIDATION_THRESHOLD = 85; // 80% liquidation
    uint256 private constant ADD_PRECISION = 1e10;
    uint256 private constant PRECISION = 1e18;
    uint256 private constant MIN_HEALTH_FACTOR = 1e18;

    mapping(address => Types.Anchores) public anchores;

    // errors
    error SUSDValidator_ExceedingMaxMint();
    error SUSDValidator_HFBroken();
    error SUSDValidator_FailedToTransferCollateral();
    error SUSDValidator_HFisFine();
    error SUSDValidator_InsufficientSUSDBalance();

    // modifiers
    modifier isAnchoreExist(address _user) {
        require(anchores[_user].isExist);
        _;
    }
    // events
    event MintedSusd(address indexed _user, uint256 _amountMinted);
    event RedeemCollateral(
        address indexed _user,
        uint256 _amountCollateral,
        uint256 _amountBurnSusd
    );
    event Liquidation(
        address indexed _liquidator,
        address indexed _user,
        uint256 _debtAmount,
        uint256 _collateralAmount
    );

    // constructor
    constructor(address _susd, address _pyth) Ownable(msg.sender) {
        pyth = IPyth(_pyth);
        i_usd = SUSD(_susd);
    }

    // function
    receive() external payable {}

    fallback() external payable {}

    function mint(
        uint256 _mintAmount,
        bytes[] calldata _priceUpdateData
    ) external payable nonReentrant {
        // validate value
        require(msg.value > 0, "insufficient balance");

        // update price data
        uint256 fee = updateDataPrice(_priceUpdateData);
        uint256 collateralAmount = msg.value - fee;

        // store data
        if (!anchores[msg.sender].isExist) {
            anchores[msg.sender] = Types.Anchores({
                isExist: true,
                user: msg.sender,
                debt: 0,
                collateralAmount: 0
            });
        }

        // validate mint amount
        PythStructs.Price memory price = pyth.getPrice(PRICE_ID);
        uint256 collateralusd = getCollateralUsdValue(
            uint256(int256(price.price)),
            collateralAmount + anchores[msg.sender].collateralAmount
        );
        // uint256 maxAmount = (collateralusd * MAX_LTV) / 100;

        // if ((_mintAmount + anchores[msg.sender].debt) > maxAmount) {
        //     revert SUSDValidator_ExceedingMaxMint();
        // }

        anchores[msg.sender].debt += _mintAmount;
        anchores[msg.sender].collateralAmount += collateralAmount;

        i_usd.mintSusd(msg.sender, _mintAmount);
        emit MintedSusd(msg.sender, _mintAmount);
    }

    function addCollateral(
        uint256 _amountCollateral,
        bytes[] calldata _priceUpdateData
    ) external payable nonReentrant() isAnchoreExist(msg.sender) {
        anchores[msg.sender].collateralAmount += _amountCollateral;
        updateDataPrice(_priceUpdateData);
    }

    function burnSusd(
        uint256 _amountSusd,
        bytes[] calldata _priceUpdateData
    ) external {
        require(i_usd.balanceOf(msg.sender) >= _amountSusd);
        i_usd.transferFrom(msg.sender, address(this), _amountSusd);
        updateDataPrice(_priceUpdateData);
    }

    function redeemCollateral(
        uint256 _amountCollateral,
        bytes[] calldata _priceUpdateData
    ) external payable nonReentrant isAnchoreExist(msg.sender) {
        updateDataPrice(_priceUpdateData);
        PythStructs.Price memory price = pyth.getPrice(PRICE_ID);
        transferCollateral(_amountCollateral, price.price);
        emit RedeemCollateral(msg.sender, _amountCollateral, 0);
    }

    function liquidate(
        address _user,
        uint256 _amount,
        bytes[] calldata _priceUpdateData
    ) external payable nonReentrant isAnchoreExist(_user) returns (bool, uint256) {
        require(anchores[_user].debt == _amount);
        require(i_usd.balanceOf(msg.sender) >= _amount);
        updateDataPrice(_priceUpdateData);
        bool isSuccess = i_usd.transferFrom(msg.sender, address(this), _amount);
        uint256 colAmount = _liquidate(_user, _amount);
        return (isSuccess, colAmount);
    }

    // helper function
    function _liquidate(
      address _user,
      uint256 _amount
    ) internal returns (uint256) {
        PythStructs.Price memory price = pyth.getPrice(PRICE_ID);
        uint256 hf = calculateHealthFactor(_user, uint256(int256(price.price)));
        if (hf >= MIN_HEALTH_FACTOR) {
            revert SUSDValidator_HFisFine();
        }
        // burn debt susd
        i_usd.burnSusd(_amount);
        anchores[_user].debt = 0;

        // transfer all collateral to liquidator
        uint256 collateralAmount = anchores[_user].collateralAmount;
        (bool isSuccess, ) = payable(msg.sender).call{value: collateralAmount}(
            ""
        );
        anchores[_user].collateralAmount = 0;
        if (!isSuccess) {
            revert SUSDValidator_FailedToTransferCollateral();
        }

        emit Liquidation(msg.sender, _user, _amount, collateralAmount);
        return collateralAmount;
    }

    function updateDataPrice(
        bytes[] calldata _priceUpdateData
    ) internal returns (uint256) {
        uint fee = pyth.getUpdateFee(_priceUpdateData);
        pyth.updatePriceFeeds{value: fee}(_priceUpdateData);
        return fee;
    }

    function transferCollateral(
        uint256 _amountCollateral,
        int64 _price
    ) internal {
        (bool isSuccess, ) = payable(msg.sender).call{value: _amountCollateral}(
            ""
        );
        anchores[msg.sender].collateralAmount -= _amountCollateral;
        if (!isSuccess) {
            revert SUSDValidator_FailedToTransferCollateral();
        }
        revertIfHFBroken(msg.sender, uint256(int256(_price)));
    }

    function revertIfHFBroken(address _user, uint256 _price) internal view {
        uint256 hf = calculateHealthFactor(_user, _price);
        if (hf < MIN_HEALTH_FACTOR) {
            revert SUSDValidator_HFBroken();
        }
    }

    function getCollateralUsdValue(
        uint256 _price,
        uint256 _collateralAmount
    ) internal pure returns (uint256) {
        return (_collateralAmount * _price * ADD_PRECISION) / PRECISION;
    }

    function calculateHealthFactor(
        address _user,
        uint256 _price
    ) public view isAnchoreExist(_user) returns (uint256) {
        if (anchores[_user].debt == 0) return type(uint256).max;
        uint256 collateralValue = getCollateralUsdValue(
            _price,
            anchores[_user].collateralAmount
        );
        uint256 allowedMinted = (collateralValue * LIQUIDATION_THRESHOLD) / 100;
        return (allowedMinted * PRECISION) / anchores[_user].debt;
    }
}