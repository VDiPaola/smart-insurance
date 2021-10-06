
// When running the script with `npx hardhat run <script>`
const hre = require("hardhat");

async function main() {
  // We get the contracts to deploy
  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const InsuranceManager = await hre.ethers.getContractFactory("InsuranceManager");
  const Token = await hre.ethers.getContractFactory("SmartToken");

  //deploy contracts
  const oracle = await Oracle.deploy();
  await oracle.deployed();
  console.log("Oracle deployed to:", oracle.address);

  const insuranceManager = await InsuranceManager.deploy(oracle.address);
  await insuranceManager.deployed();
  console.log("InsuranceManager deployed to:", insuranceManager.address);

  const token = await Token.deploy(insuranceManager.address);
  await token.deployed();
  console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
