// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./IOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IToken.sol";

contract InsuranceManager is Ownable{
    enum insuranceEnum{
        none,
        weather
    }
    mapping(address => insuranceEnum) private ownedInsurance; //what insurance an address has
    mapping(address => string) private insuranceParameter; //insurance parameter e.g. country name

    uint insurancePrice = 1 ether / 4; //price to buy insurance
    uint insuranceClaimAmount = 1 ether; //insurance claim amount
    uint daysInsured = 30 days; //days until insurance is void

    IOracle oracleInstance; //interact with oracle contract
    ISmartToken tokenInstance; //interact with token contract

    event WeatherInsuranceBought(address insuredAddress, uint price, string country, uint expireTimestamp);
    event InsuranceExpired();
    event InsuranceClaimed(address insuredAddress, uint amountClaimed, uint claimedTimestamp);

    constructor(address _oracleAddress){
        //set oracle address
        require(_oracleAddress != address(0), "invalid oracle address given");
        setOracleAddress(_oracleAddress);
    }

    function setOracleAddress(address _oracleAddress) public onlyOwner{
        //create interface out of the oracle contract address
        oracleInstance = IOracle(_oracleAddress);
    }
    function setTokenAddress(address _Address) public onlyOwner{
        //create interface out of the token contract address
        tokenInstance = ISmartToken(_Address);
    }

    function setDaysInsured(uint _days) external onlyOwner{
        //set new time until insurance is void
        daysInsured = _days * 1 days;
    }

    function setInsurancePrice(uint _newPriceWei) external onlyOwner{
        //set new price of insurance
        insurancePrice = _newPriceWei;
    }

    function setInsuranceClaimAmount(uint _newAmountWei) external onlyOwner{
        //set new price of insurance
        insuranceClaimAmount = _newAmountWei;
    }

    modifier enoughBalance(uint price){
        //checks they sent the right amount and they have enough eth
        require(msg.value == price, "sent value doesnt match price");
        _;
    }

    function _removeInsurance(address _address) private{
        delete ownedInsurance[_address];
        delete insuranceParameter[_address];
    }

    function buyWeatherInsurance(string calldata _country) external payable enoughBalance(insurancePrice){
        //require the address doesnt own insurance already
        require(ownedInsurance[msg.sender] == insuranceEnum.none, "address already owns insurance");
        //set mapping
        ownedInsurance[msg.sender] = insuranceEnum.weather;
        insuranceParameter[msg.sender] = _country;
        //emit event
        emit WeatherInsuranceBought(msg.sender, insurancePrice, _country, block.timestamp + daysInsured);
    }

    function removeInsurance(address _address) external{
        //allow token contract to remove insurance from address
        require(msg.sender == address(tokenInstance), "can only be called from token contract address");
        _removeInsurance(_address);
    }

    function _claimInsurance() private{
        //when claim is successful
        if(address(this).balance < insuranceClaimAmount){
            //pay in SMART tokens
            require(address(tokenInstance) != address(0), "token contract address not set");
            tokenInstance.payInsurance(msg.sender, insuranceClaimAmount);
        }else{
            //pay in ether
            (bool success, ) = msg.sender.call{value:insuranceClaimAmount}("");
            require(success, "sending claimed ether failed");
            emit InsuranceClaimed(msg.sender, insuranceClaimAmount, block.timestamp);
            _removeInsurance(msg.sender);
        }
    }

    function attemptClaimInsurance() external{
        //user prompted to check if they have a valid claim
        require(address(oracleInstance) != address(0), "oracle address not set");
        require(ownedInsurance[msg.sender] == insuranceEnum.weather, "address doesnt have this insurance");
        oracleInstance.requestWeatherData(insuranceParameter[msg.sender], msg.sender);
    }

    function attemptClaimInsuranceCallback() external{
        //called from oracle 
    }

    
}