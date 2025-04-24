// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Wallet, ethers } = require("ethers");
const { Web3Storage, File } = require("web3.storage");
const mintRoutes = require("./routes/mintRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/mint", mintRoutes);

app.get("/generate-wallet", (req, res) => {
    const wallet = Wallet.createRandom();
    res.json({ address: wallet.address, privateKey: wallet.privateKey });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
