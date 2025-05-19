import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  batchId: String,
  collegeAddress: String,
  transactionHashes: [String],   // array!
  tokenIds: [Number],
  studentWallets: [String],
  timestamp: String,             // ISO string
});

export default mongoose.model("Transaction", transactionSchema);
