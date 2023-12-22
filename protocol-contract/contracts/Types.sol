// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library Types {
  struct Anchores {
    bool isExist;
    address user;
    uint256 debt;
    uint256 collateralAmount;
  }

  struct Protector {
    bool isExist;
    address user;
    uint256 depositAmount;
    uint256 gainAmount;
  }
}