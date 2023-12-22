// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract SUSD is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    // variables
    address validator;

    // errors
    error SUSD_AmountShouldBeMoreThanZero();
    error SUSD_RecipientShouldNotBeZeroAddress();
    error SUSD_InsufficientBalanceToBurn();

    // modifiers
    modifier onlyValidator() {
        require(msg.sender == validator);
        _;
    }

    // events
    event ValidatorChange(address newValidator);

    // constructor
    constructor(address _initialOwner)
        ERC20("SUSD", "SUSD")
        Ownable(_initialOwner)
        ERC20Permit("SUSD")
    {}

    // user functions
    function mintSusd(address _to, uint256 _amount) external onlyValidator() {
        if(_to == address(0)) {
            revert SUSD_RecipientShouldNotBeZeroAddress();
        }

        if(_amount == 0) {
            revert SUSD_AmountShouldBeMoreThanZero();
        }
        _mint(_to, _amount);
    }

    function burnSusd(uint256 _amount) external onlyValidator() {
        uint256 balance = balanceOf(msg.sender);
        if(balance < _amount) {
            revert SUSD_InsufficientBalanceToBurn();
        }
        if(_amount == 0) {
            revert SUSD_AmountShouldBeMoreThanZero();
        }
        burn(_amount);
    }

    // admin functions
    function changeValidator(address _validator) external onlyOwner() {
        validator = _validator;
        emit ValidatorChange(validator);
    }
}
