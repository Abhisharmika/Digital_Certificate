require("dotenv").config();
const {ethers} = require("hardhat");

async function main(){
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const balance = await provider.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    console.log("Balance: ", ethers.formatEther(balance),"ETH");
}

main().catch((error)=>{
    console.error(error);
    process.exit(1);
});