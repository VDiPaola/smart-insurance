const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SmartToken", function () {
  let smartToken, owner, addr1, addr2;
  beforeEach(async ()=>{
    const SmartToken = await ethers.getContractFactory("SmartToken");
    smartToken = await SmartToken.deploy();
    await smartToken.deployed();

    [owner, addr1, addr2] = await ethers.getSigners()
  })

  it("returns balance", async function () {
    expect(await smartToken.balanceOf(owner.address)).to.equal("100000000000000000000");
  });

  it("transfer funds", async function () {
    const amount = 100
    const balance1 = await smartToken.balanceOf(addr1.address)
    const balance2 = await smartToken.balanceOf(addr2.address)
    
    if(balance1 >= amount){
      await smartToken.connect(addr1).transfer(addr2.address, amount)
      expect(await smartToken.balanceOf(addr1.address)).to.equal("90000000000000000900");
      expect(await smartToken.balanceOf(addr2.address)).to.equal("100000000000000000100");
    }else{
      await expect(
        smartToken.connect(addr1)
        .transfer(addr2.address, amount)
        ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    }
    
  });

});

