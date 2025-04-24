require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const API_KEY=process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // localhost: {
    //   url: "http://127.0.0.1:8545/",
    // },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
