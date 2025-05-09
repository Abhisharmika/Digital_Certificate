const { ethers } = require("hardhat");
const { Contract } = require("web3");



async function main() {
  const [owner] = await ethers.getSigners();
  const existingContractAdresses="";

  let contract;

  // if(existingContractAdresses){
  //   contract=await ethers.getContractFactory("DigitalCertificate");
  //   contract=await contract.attach(existingContractAdresses);
  //   console.log("Contract already exists at address:", existingContractAdresses);
  // }else{
  //   const DigitalCertificate=await ethers.getContractFactory("DigitalCertificate");
  //   contract=await DigitalCertificate.deploy();
  //   // await contract.deployed();
  //   await contract.waitfordeployment();
  //   console.log("Contract deployed to new address:", contract.address);
  // }

  const DigitalCertificate=await ethers.getContractFactory("DigitalCertificate");
  contract=await DigitalCertificate.deploy();
  // await contract.deployed();
  await contract.waitfordeployment();
  console.log("Contract deployed at:", contract.address);

 const students=[
  {address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", credits:200},
  {address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", credits:200},
  {address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", credits:200},
  {address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", credits:200},
  {address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", credits:200},
  {address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", credits:200},
  {address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", credits:200},
  {address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", credits:200},
  {address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", credits:200},
  {address: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", credits:200},
  {address: "0xBcd4042DE499D14e55001CcbB24a551F3b954096", credits:200},
  {address: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788", credits:200},
  {address: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a", credits:200},
  {address: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec", credits:200},
  {address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097", credits:200},
  {address: "0xcd3B766CCDd6AE721141F452C550Ca635964ce71", credits:200},
  {address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", credits:200},
  {address: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", credits:200},
  {address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0", credits:200},
  {address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", credits:200}
 ]

 const requiredCredits=180;

 for(const student of students){
  await contract.assignCredits(student.address, student.credits);
  console.log(`Assigned ${student.credits} credits to ${student.address}`);

  const credits=await contract.studentCredits(student.address);
  const hasMinted=await contract.hasMinted(student.address);

  if(credits>=requiredCredits && !hasMinted){
    const tokenURI="";
    await contract.mintCertificatefromIPFS(student.address, credits, tokenURI);
    console.log(`Minted NFT certificate for ${student.address}`);
  }else{
    console.log(`student ${student.address} is NOT eligible.`);
  }
 }
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
