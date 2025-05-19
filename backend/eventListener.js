import { ethers } from "ethers"
import dotenv from "dotenv";
import abi from "./sbtAbi.js";
import Transaction from "./Transaction.js";

dotenv.config();

const listenToEvents = () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

  contract.on("BatchMint", async (batchId, to, tokenId, tokenURI, timestamp, batchHash) => {
    console.log("New BatchMint event:", batchId.toString());

    const tx = new Transaction({
      batchId: batchId.toNumber(),
      to,
      tokenId: tokenId.toNumber(),
      tokenURI,
      timestamp: timestamp.toNumber(),
      batchHash,
    });

    try {
      await tx.save();
      console.log(`Saved tx for tokenId ${tokenId}`);
    } catch (err) {
      console.error("Failed to save transaction:", err.message);
    }
  });
};

export default listenToEvents;
