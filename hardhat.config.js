require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  paths:{
      sources: "./src/ethereum" 
  },
  networks:{
    sepolia:{
      url: process.env.REACT_APP_ALCHEMY_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
