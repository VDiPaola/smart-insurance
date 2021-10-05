// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "./IInsuranceManager.sol";

contract SmartToken is ERC20, Ownable, ERC20Permit, ERC20Votes {
    IInsuranceManager insuranceManagerInstance;

    event InsuranceClaimed(address insuredAddress, uint amountClaimed, uint claimedTimestamp);

    constructor(address _insuranceManagerAddress) ERC20("Smart", "SMART") ERC20Permit("Smart") {
        _mint(msg.sender, 100 * 10 ** decimals());

        insuranceManagerInstance = IInsuranceManager(_insuranceManagerAddress);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function setInsuranceManagerAddress(address _address) external onlyOwner{
        insuranceManagerInstance = IInsuranceManager(_address);
    }

    function payInsurance(address _to, uint256 _amount) external{
        //pay insurance with tokens from insurance manager when no ether is available
        require(msg.sender == address(insuranceManagerInstance), "can only mint from insurance manager contract");
        _mint(_to, _amount);
        emit InsuranceClaimed(_to, _amount, block.timestamp);
        insuranceManagerInstance.removeInsurance(_to);
    }



    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}