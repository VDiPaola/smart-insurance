// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./IInsuranceManager.sol";

contract Oracle{
    uint private nonce;
    uint16 private idModulus = 1000;

    mapping(uint => bool) private pendingRequests;
    
    event RequestWeatherData(address callerAddress, uint id, string country, address insuredAddress);
    event RecievedWeatherData(uint id, string weatherData);

    function requestWeatherData(string calldata _country, address _insured) external{
        nonce++;
        uint id = uint(keccak256(abi.encodePacked(nonce, msg.sender, block.timestamp))) % idModulus;
        require(!pendingRequests[id], "already pending request with this id");
        pendingRequests[id] = true;
        emit RequestWeatherData(msg.sender, id, _country, _insured);
    }

    function recieveWeatherData(uint _id, address _insured, address _sender) external{
        require(pendingRequests[_id], "No request pending for this id");
        pendingRequests[_id] = false;
        IInsuranceManager insuranceManagerInstance = IInsuranceManager(_sender);
        insuranceManagerInstance.attemptClaimInsuranceCallback();
    }

}