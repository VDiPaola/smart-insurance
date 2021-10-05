// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IInsuranceManager{
    function removeInsurance(address _address) external;
    function attemptClaimInsuranceCallback() external;
}