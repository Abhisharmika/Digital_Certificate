import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import ParticlesBg from "particles-bg";

import Home from "./components/Home.js";
import Dashboard from "./components/Dashboard.js";
import sbtContract from "./ethereum/sbt.js";

import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [SBT, setSBT] = useState(null);

  const [imageFiles, setImageFiles] = useState([]);
  const [metadataArr, setMetadataArr] = useState([]);
  const [batchStatus, setBatchStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHashes, setTxHashes] = useState([]);
  const [error, setError] = useState(null);

  // Initialize wallet and listen for account changes
  useEffect(() => {
    initWallet();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0] || "");
      });
    }
  }, []);

  const initWallet = async () => {
    if (!window.ethereum) {
      console.log("Install MetaMask");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_accounts", []);
    if (accounts.length) {
      setWalletAddress(accounts[0]);
      setSigner(provider.getSigner());
      setSBT(sbtContract(provider));
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      initWallet();
    } catch (err) {
      console.error("Wallet connect error:", err);
    }
  };

  // Handle folder upload (certificate images)
  const handleFolder = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  // Generate metadata: upload images and JSON to Pinata, build metadata array
  const generateMetadata = async () => {
    if (imageFiles.length === 0) {
      setBatchStatus("Please select certificate images first.");
      return;
    }

    setBatchStatus("Uploading images & creating metadata...");
    setError(null);

    const key = process.env.REACT_APP_PINATA_KEY;
    const secret = process.env.REACT_APP_PINATA_SECRET;

    try {
      const out = [];

      for (const file of imageFiles) {
        // Upload image to Pinata
        const fd = new FormData();
        fd.append("file", file);

        const imgRes = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          fd,
          {
            maxBodyLength: "Infinity",
            headers: {
              pinata_api_key: key,
              pinata_secret_api_key: secret,
            },
          }
        );

        const imgUrl = `https://gateway.pinata.cloud/ipfs/${imgRes.data.IpfsHash}`;

        // Build metadata JSON and upload it
        const wallet = file.name.split(".")[0]; // extract wallet from filename
        const metadata = {
          name: "Degree Certificate",
          description: `Graduation certificate for ${wallet}`,
          image: imgUrl,
        };

        const metaRes = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          metadata,
          {
            headers: {
              pinata_api_key: key,
              pinata_secret_api_key: secret,
              "Content-Type": "application/json",
            },
          }
        );

        out.push({
          wallet,
          metadataUri: `ipfs://${metaRes.data.IpfsHash}`,
          batch: "B.Tech",
          year: 2026,
        });
      }

      setMetadataArr(out);
      setBatchStatus(`✅ Metadata ready for ${out.length} certificates.`);
    } catch (err) {
      console.error("Pinata upload error:", err);
      setBatchStatus("❌ Upload failed, check console.");
      setError(err.message || "Upload error");
    }
  };

  // Send metadata array to backend for minting
  const mintBatch = async () => {
    if (metadataArr.length === 0) {
      setBatchStatus("Generate metadata first.");
      return;
    }
    setBatchStatus("Minting batch... please approve wallet transactions.");
    setLoading(true);
    setError(null);

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/mint-batch`;
      const response = await axios.post(url, metadataArr);

      const data = response.data;

      // Expect mintedTokenIds or txHashes array from backend
      if (Array.isArray(data.mintedTokenIds)) {
        setTxHashes(data.mintedTokenIds);
      } else if (Array.isArray(data.txHashes)) {
        setTxHashes(data.txHashes);
      } else {
        setTxHashes([]);
      }

      setBatchStatus("🎉 Minting completed successfully.");
    } catch (err) {
      console.error("Minting failed:", err);
      setBatchStatus("❌ Minting failed.");
      setError(err.message || "Minting error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={<Dashboard walletAddress={walletAddress} />}
          />

          <Route
            path="/send-cert"
            element={
              <Home
                connectWallet={connectWallet}
                handleFolder={handleFolder}
                generateMetadata={generateMetadata}
                mintBatch={mintBatch}
                batchStatus={batchStatus}
                txHashes={txHashes}
                loading={loading}
                error={error}
                imageFiles={imageFiles}
                metadataArr={metadataArr}
              />
            }
          />
        </Routes>
      </BrowserRouter>

      <ParticlesBg type="cobweb" bg={true} />
    </>
  );
}

export default App;
