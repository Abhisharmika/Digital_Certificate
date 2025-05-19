import dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import abi from "./sbtAbi.js";
import Transaction from "./Transaction.js";

const provider  = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const signer    = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract  = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

export const logTransaction = async (req, res) => {
  console.log("🔵 Incoming /mint-batch request:", req.body);
  try {
    console.log("Incoming body:", req.body);

    const {
      batchId,
      transactionHashes,
      tokenIds,
      studentWallets,
      timestamp,
    } = req.body;

    if (
      !batchId ||
      !Array.isArray(transactionHashes) ||
      !Array.isArray(tokenIds) ||
      !Array.isArray(studentWallets)
    ) {
      return res.status(400).json({ message: "Bad /api/log-transaction payload" });
    }

    await Transaction.create({
      collegeAddress: signer.address,
      batchId,
      transactionHashes,
      tokenIds,
      studentWallets,
      timestamp,
    });

    res.status(201).json({ message: "Transaction logged" });
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/mint-batch
 * Body:  [ { wallet, metadataUri, batchId } , ... ]
 * Mints SBTs **and** stores in Mongo in one go.
 */
export const mintBatch = async (req, res) => {
  try {
    const metadataArr = req.body; // must be array
    if (!Array.isArray(metadataArr) || metadataArr.length === 0)
      return res.status(400).json({ message: "Body must be array" });

    const txHashes   = [];
    const tokenIds   = [];
    const wallets    = [];
    const batchId    = metadataArr[0].batchId || `Batch-${Date.now()}`;

    for (const cert of metadataArr) {
      const { wallet, metadataUri } = cert;
      const tokenId = Date.now() + Math.floor(Math.random() * 1000); // simple unique ID

      const tx = await contract.safeMint(wallet, metadataUri); // your contract method
      await tx.wait(1);

      txHashes.push(tx.hash);
      tokenIds.push(tokenId);
      wallets.push(wallet);
    }

    await Transaction.create({
      collegeAddress: signer.address,
      batchId,
      transactionHashes: txHashes,
      tokenIds,
      studentWallets: wallets,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ message: "Minted & Logged", batchId, txHashes });
  } catch (err) {
    console.error("Mint error:", err);
    res.status(500).json({ error: err.message });
  }
};