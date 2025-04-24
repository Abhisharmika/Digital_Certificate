const express=require("express");
const fs=require("fs");
const path=require("path");
const {Web3Storage, File}=require("web3.storage");
const {ethers}=require("ethers");
const ABI=require("../artifacts/contracts/SBT1155Certificate.sol/SBT1155Certificate.json").abi;

const router=express.Router();

const storageToken=process.env.WEB3_STORAGE_TOKEN;
const privateKey=process.env.ADMIN_PRIVATE_KEY;
const contractAdress= "YOUR_DEPLOYED_CONTRACT_ADDRESS";

const provider=new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/MT7dOz3nXFl5Y24juGcvL47k9U4wlTEC");
const wallet=new ethers.Wallet(privateKey,provider);
const contract=new ethers.Contract(ContractNoAddressDefinedError, ABI, wallet);

function getWeb3Client(){
    return new Web3Storage({token: storageToken});
}

router.post("/bulk", async(req,res)=>{
    const students=req.body.students;

    const web3client=getWeb3Client();
    const minted=[];
    for(const student of students){
    const json={
        name: student.name,
        wallet: student.wallet,
        branch: student.branch,
        college: student.college,
        date: new Date().toISOString()
    };

    const buffer= Buffer.from(JSON.stringify(json));
    const files=[new File([buffer], `${student.name}_certificate.json`)];
    const cid=await getWeb3Client.put(files);
    const ipfsUrl=`https://${cid}.ipfs.w3s.link/${student.name}_certificate.json`;

    const tx=await contract.mintCertificate(student.wallet, ipfsUrl);
    await tx.wait();

    minted.push({ student: student.name, ipfsUrl});
    }

    res.join({minted});

});

module.exports=router;