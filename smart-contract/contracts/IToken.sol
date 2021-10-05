// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface ISmartToken{
    function payInsurance(address _to, uint256 _amount) external;
}