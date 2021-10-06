// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./IInsuranceManager.sol";

contract Oracle{
    uint private nonce;
    uint16 private idModulus = 1000;

    mapping(uint => bool) private pendingRequests;
    
    event RequestWeatherData(address callerAddress, uint id, string cityCountry, address insuredAddress);
    event RecievedWeatherData(uint id, string claimReason);

    function requestWeatherData(string calldata _cityCountry, address _insured) external{
        nonce++;
        uint id = uint(keccak256(abi.encodePacked(nonce, msg.sender, block.timestamp))) % idModulus;
        require(!pendingRequests[id], "already pending request with this id");
        pendingRequests[id] = true;
        emit RequestWeatherData(msg.sender, id, _cityCountry, _insured);
    }

    function recieveWeatherData(uint _id, address _insured, address _caller, string calldata _claimReason) external{
        require(pendingRequests[_id], "No request pending for this id");
        pendingRequests[_id] = false;
        IInsuranceManager insuranceManagerInstance = IInsuranceManager(_caller);
        insuranceManagerInstance.attemptClaimInsuranceCallback(_insured,_claimReason);
        emit RecievedWeatherData(_id, _claimReason);
    }

}