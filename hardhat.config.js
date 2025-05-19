import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import "@nomicfoundation/hardhat-toolbox";

/** @type import("hardhat/config").HardhatUserConfig */
const config = {
  solidity: "0.8.4",
  paths: {
    sources: "./src/ethereum"
  },
  networks: {
    sepolia: {
      url: process.env.REACT_APP_ALCHEMY_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};

export default config;
