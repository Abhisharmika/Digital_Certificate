const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with address:", deployer.address);

  const ContractFactory = await hre.ethers.getContractFactory("SBT721Certificate");
  const contract = await ContractFactory.deploy();
  await contract.deployed();

  console.log("SBT721Certificate deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
