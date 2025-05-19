import express from "express";
import { logTransaction, mintBatch } from "./controllers.js";

const router = express.Router();

router.post("/log-transaction", logTransaction); // manual log test
router.post("/mint-batch",       mintBatch);     // real mint+log

export default router;
