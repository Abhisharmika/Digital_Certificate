import express from "express";
import { logTransaction, mintBatch, getLedger } from "./controllers.js";

const router = express.Router();

router.get("/ledger", getLedger);  
router.post("/log-transaction", logTransaction); // manual log test
router.post("/mint-batch",       mintBatch);     // real mint+log

export default router;
