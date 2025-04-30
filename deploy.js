
const hre = require("hardhat");

async function main() {

  const [deployer]= await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const gasPrice= await hre.ethers.provider.getFeeData();
  console.log("Current gas price (suggested):", gasPrice.gasPrice.toString());
  const CertificateSBT = await hre.ethers.getContractFactory("SBT1155Certificate");

  const contract = await CertificateSBT.deploy({
    gasPrice: gasPrice.gasPrice,
  });

  console.log("✅ Contract deployed at:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
