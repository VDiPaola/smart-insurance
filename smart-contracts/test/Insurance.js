const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsuranceManager", function () {
  let smartToken, insuranceManager,oracle, owner, addr1, addr2;
  beforeEach(async ()=>{
    //create oracle contract
    const Oracle = await hre.ethers.getContractFactory("Oracle");
    oracle = await Oracle.deploy();
    //create insurance manager contract
    const InsuranceManager = await hre.ethers.getContractFactory("InsuranceManager");
    insuranceManager = await InsuranceManager.deploy(oracle.address);
    //create token contract
    const SmartToken = await ethers.getContractFactory("SmartToken");
    smartToken = await SmartToken.deploy(insuranceManager.address);
    await smartToken.deployed();
    //add token address to insurance manager
    insuranceManager.setTokenAddress(smartToken.address);

    [owner, addr1, addr2] = await ethers.getSigners();
  })

  //BUY

  it("Buy insurance", async function () {
    //buyWeatherInsurance(string calldata _country)  sent value doesnt match price
    await expect(insuranceManager.connect(addr1).buyWeatherInsurance("london,england", {value:"250000000000000000"}))
    .to.emit(insuranceManager, "WeatherInsuranceBought")
  });


  it("Buy insurance not using correct amount", async function () {
    await expect(insuranceManager.connect(addr1).buyWeatherInsurance("london,england", {value:"100"}))
    .to.be.revertedWith("sent value doesnt match price")
  });

  it("Buy insurance twice", async function () {
    //buy first time
    await expect(insuranceManager.connect(addr1).buyWeatherInsurance("london,england", {value:"250000000000000000"}))
    .to.emit(insuranceManager, "WeatherInsuranceBought")
    //try buy second time
    await expect(insuranceManager.connect(addr1).buyWeatherInsurance("london,england", {value:"250000000000000000"}))
    .to.be.revertedWith("address already owns insurance")
  });

  it("two account buying insurance", async function () {
    //first account
    await expect(insuranceManager.connect(addr1).buyWeatherInsurance("london,england", {value:"250000000000000000"}))
    .to.emit(insuranceManager, "WeatherInsuranceBought")
    //second account
    await expect(insuranceManager.connect(addr2).buyWeatherInsurance("london,england", {value:"250000000000000000"}))
    .to.emit(insuranceManager, "WeatherInsuranceBought")
  });

  //CLAIM

  it("Attempt to claim insurance", async function () {
    //buy insurance
    await expect(insuranceManager.buyWeatherInsurance("london,england", {value:"250000000000000000"}))
    .to.emit(insuranceManager, "WeatherInsuranceBought")
    //claim insurance
    await expect(insuranceManager.attemptClaimInsurance())
    .to.emit(oracle, "RequestWeatherData")
  });

  it("Attempt to claim insurance with no insurance bought", async function () {
    await expect(insuranceManager.attemptClaimInsurance())
    .to.be.revertedWith("address doesnt have this insurance")
  });
  
  

});

