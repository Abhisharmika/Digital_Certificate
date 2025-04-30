const fs= require("fs");
const path=require("path");
const {ethers} =require("hardhat");

async function main(){
    const [deployer] = await ethers.getSigners();
    const contract= await ethers.getContractAt("SBT1155Certificate", "0x6FC71ACf5A600cc11aF21FdDEC3BEd3C00CE3480");

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "certificate_1.json"), "utf-8"));

    for(const cert of data){
        const tx=await contract.mintCertificate(cert.wallet, cert.ipfsURI);
        await tx.wait();
        console.log(`Minted for %{cert.name} (${cert.wallet})`);
    }
}

main().catch(console.error);