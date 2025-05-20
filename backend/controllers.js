import dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import abi from "./sbtAbi.js";
import Transaction from "./Transaction.js";

// 🔌 Setup provider, signer, and contract
const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

// 🧠 Interface for decoding events
const iface = new ethers.Interface(abi);

// 🔁 POST /api/mint-batch — mints & logs in one go
export const mintBatch = async (req, res) => {
  try {
    const metadataArr = req.body;

    if (!Array.isArray(metadataArr) || metadataArr.length === 0) {
      return res.status(400).json({ message: "Body must be an array" });
    }

    const recipients = metadataArr.map(item => item.wallet);
    const tokenURIs = metadataArr.map(item => item.metadataUri);

    const { batch, year } = metadataArr[0];
    const batchId = `${batch}-${year}`;

    // --- 1️⃣ Send mint transaction
    const tx = await contract.batchMint(recipients, tokenURIs);
    console.log("🟢 Mint transaction sent:", tx.hash);

    const receipt = await tx.wait(1); // Wait for confirmation
    console.log("✅ Transaction mined:", receipt.transactionHash);

    // --- 2️⃣ Parse logs for tokenIds
    const mintedTokenIds = [];

    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed.name === "BatchCertificateMinted") {
          mintedTokenIds.push(...parsed.args.tokenIds.map(id => Number(id)));
        }
      } catch (err) {
        // Skip unrelated logs
      }
    }

    // --- 3️⃣ Save transaction to MongoDB
    await Transaction.create({
      collegeAddress: signer.address,
      batchId,
      transactionHashes: [tx.hash],
      tokenIds: mintedTokenIds,
      studentWallets: recipients,
      timestamp: new Date().toISOString(),
    });

    // --- ✅ Done
    res.status(201).json({
      message: "🎉 Minted and logged",
      batchId,
      txHash: tx.hash,
      tokenIds: mintedTokenIds,
    });

  } catch (err) {
    console.error("❌ Mint error:", err);
    res.status(500).json({ error: err.message || "Mint failed" });
  }
};

// 🟣 For manual logging (if needed)
export const logTransaction = async (req, res) => {
  console.log("🔵 Incoming /log-transaction request:", req.body);
  try {
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
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getLedger = async (req, res) => {
  try {
    const all = await Transaction.find().sort({ timestamp: -1 }).lean();

    // group by batchId
    const map = {};
    all.forEach((tx) => {
      if (!map[tx.batchId]) map[tx.batchId] = [];
      map[tx.batchId].push({
        wallet:        tx.studentWallets?.[0] || "",  // you stored array, take first
        tokenId:       tx.tokenIds?.[0] || 0,
        txHash:        tx.transactionHashes?.[0] || "",
        timestamp:     tx.timestamp,
      });
    });

    const grouped = Object.entries(map).map(([batchId, txs]) => ({ batchId, txs }));
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};