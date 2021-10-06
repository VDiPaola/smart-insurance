// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IOracle{
    function requestWeatherData(string calldata _cityCountry, address _insured) external;
}