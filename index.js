const {ethers, Wallet} = require("ethers");

const sepoliaRPC="https://eth-sepolia.g.alchemy.com/v2/MT7dOz3nXFl5Y24juGcvL47k9U4wlTEC"
const provider= new ethers.JsonRpcProvider(sepoliaRPC)
const wallet = Wallet.createRandom(provider);

const privKey=wallet.privateKey
console.log(wallet)
console.log(privKey)