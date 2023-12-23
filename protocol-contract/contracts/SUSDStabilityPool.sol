// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./SUSD.sol";
import "./Types.sol";
import "./SUSDValidator.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SUSDStabilityPool is ReentrancyGuard, Ownable {
    // variables
    SUSD i_usd;
    SUSDValidator i_validator;

    uint256 public offset;
    uint256 public tracker;
    mapping(uint256 => Types.Protector) public protectors;
    mapping(address => uint256[]) public userTracker;

    // errors

    // modifiers

    // events
    event Deposit(address indexed _user, uint256 _amount);

    // constructor
    constructor(address _susd, address payable _validator) Ownable(msg.sender) {
        i_usd = SUSD(_susd);
        i_validator = SUSDValidator(_validator);
    }

    // function
    receive() external payable {}

    fallback() external payable {}

    // user function
    function deposit(uint256 _amount) external nonReentrant {
        require(i_usd.balanceOf(msg.sender) >= _amount);
        i_usd.transferFrom(msg.sender, address(this), _amount);
        // store data
        protectors[tracker] = Types.Protector({
            isExist: true,
            user: msg.sender,
            depositAmount: _amount,
            gainAmount: 0
        });
        userTracker[msg.sender].push(tracker);
        tracker++;

        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _trackerId) external nonReentrant {
        if (protectors[_trackerId].isExist && protectors[_trackerId].user == msg.sender) {
            revert();
        }
        uint256 amountSusd = protectors[_trackerId].depositAmount;
        uint256 amountNative = protectors[_trackerId].gainAmount;

        if(amountSusd > 0) {
            protectors[_trackerId].depositAmount = 0;
            bool successSusd = i_usd.transfer(msg.sender, amountSusd);
            if(!successSusd) {
                revert();
            }
        }

        if(amountNative > 0) {
            protectors[_trackerId].gainAmount = 0;
            (bool successNative, ) = payable(msg.sender).call{value: amountNative}("");
            if(!successNative) {
                revert();
            }
        }
    }

    function liquidate(
        uint256 _debt,
        address _user,
        bytes[] calldata _priceUpdateData
    ) external payable {
        require(_debt <= i_usd.balanceOf(address(this)));
        
        i_usd.approve(address(i_validator), _debt);
        (bool isSuccess, uint256 amount) = i_validator.liquidate{
            value: msg.value
        }(_user, _debt, _priceUpdateData);
        uint256 amountUser = (amount * 75) / 100;
        (bool success, ) = payable(msg.sender).call{value: amount - amountUser}(
            ""
        );

        if (isSuccess && success) {
            uint256 temp;
            bool stop = false;
            uint256 i = offset;
            for (i; i < tracker; i++) {
                temp += protectors[i].depositAmount;
                if (temp > _debt) {
                    temp -= protectors[i].depositAmount;
                    protectors[i].gainAmount +=
                        ((_debt - temp) * amountUser) /
                        _debt;
                    protectors[i].depositAmount -= (_debt - temp);
                    stop = true;
                } else {
                    protectors[i].gainAmount +=
                        (protectors[i].depositAmount * amountUser) /
                        _debt;
                    protectors[i].depositAmount = 0;
                }
                if (stop || temp == _debt) {
                    break;
                }
            }
            offset = i;
        } else {
            revert();
        }
    }

    function getUserInfo(address _user) external view returns (uint256[] memory) {
        uint256 length = userTracker[_user].length;
        uint256[] memory data = new uint256[](length);
        for(uint256 i = 0; i < length; i++) {
            data[i] = userTracker[_user][i];
        }
        return data;
    }
}
