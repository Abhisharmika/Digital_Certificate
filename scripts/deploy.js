import pkg from "hardhat";
const { ethers } = pkg;

import dotenv from "dotenv";
dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with address:", deployer.address);

  const SBT721Certificate = await ethers.getContractFactory("SBT721Certificate");

  // Pass constructor arguments here: name and symbol
  const contract = await SBT721Certificate.deploy();

  // Wait for deployment to complete
  await contract.waitForDeployment();

  console.log("SBT721Certificate deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
