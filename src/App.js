// import ParticlesBg from "particles-bg";
// import { useEffect, useState } from "react";
// import {
//   useNavigate,
//   BrowserRouter,
//   Route,
//   Routes,
// } from "react-router-dom";
// import "./App.css";
// import { ethers } from "ethers";
// import sbtContract from "./ethereum/sbt.js";
// import Home from "./components/Home.js";
// import Redirection from "./components/Redirection.js";
// import axios from "axios";

// function App() {
//   const [walletAddress, setWalletAddress] = useState("");
//   const [signer, setSigner] = useState();
//   const [SbtContract, setSbtContract] = useState();
//   const [SendSuccess, setSendSuccess] = useState("");
//   const [SendError, setSendError] = useState("");
//   const [TransactionData, setTransactionData] = useState();
//   const [jsonFile, setJsonFile] = useState(null);
//   const [parsedData, setParsedData] = useState([]);
//   const [mintStatus, setMintStatus] = useState("");

//   const [mintBatches, setMintBatches] = useState([]); // Array of { batchId, txns: [hashes], timestamp }
//   const [batchCounter, setBatchCounter] = useState(1);
//   const [uploadedImages, setUploadedImages] = useState();
//   const [Inputname, setName] = useState();
//   const [Inputdesc, setDesc] = useState();
//   const [baseUri, setUri] = useState();
//   const [recipientAddress, setRecipientAddress] = useState("");

//   const switchToSepolia = async () => {
//     try {
//       await window.ethereum.request({
//         method: 'wallet_switchEthereumChain',
//         params: [{ chainId: '0xaa36a7' }],
//       });
//     } catch (switchError) {
//       if (switchError.code === 4902) {
//         try {
//           await window.ethereum.request({
//             method: 'wallet_addEthereumChain',
//             params: [{
//               chainId: '0xaa36a7',
//               chainName: 'Sepolia Testnet',
//               rpcUrls: ['https://rpc.sepolia.org'],
//               nativeCurrency: {
//                 name: 'SepoliaETH',
//                 symbol: 'ETH',
//                 decimals: 18,
//               },
//               blockExplorerUrls: ['https://sepolia.etherscan.io'],
//             }],
//           });
//         } catch (addError) {
//           console.error("Error adding Sepolia:", addError.message);
//         }
//       } else {
//         console.error("Error switching network:", switchError.message);
//       }
//     }
//   };

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     const form = event.target;
//     const name = Inputname;
//     const desc = Inputdesc;
//     const files = form.file.files;

//     if (!files || files.length === 0) {
//       return alert("No files selected");
//     }

//     const file = files[0];
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const fileRes = await axios.post(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         formData,
//         {
//           maxContentLength: "Infinity",
//           headers: {
//             "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
//             pinata_api_key: "ff5d33d0080f00b29160",
//             pinata_secret_api_key: "56dbea51571a11b65d83aa5459520944c8190c39068680de4bd691f2aec51497",
//           },
//         }
//       );

//       const imageHash = fileRes.data.IpfsHash;
//       const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;

//       setUploadedImages(imageUrl);
//       setName(name);
//       setDesc(desc);

//       const metadata = {
//         name: name,
//         description: desc,
//         image: imageUrl,
//       };

//       const metadataRes = await axios.post(
//         "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//         metadata,
//         {
//           headers: {
//             pinata_api_key: "ff5d33d0080f00b29160",
//             pinata_secret_api_key: "56dbea51571a11b65d83aa5459520944c8190c39068680de4bd691f2aec51497",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const metadataHash = metadataRes.data.IpfsHash;
//       setUri(metadataHash);
//       console.log("Metadata IPFS Hash:", metadataHash);

//       form.reset();
//     } catch (error) {
//       console.error("Pinata upload failed:", error);
//       alert("Upload to Pinata failed");
//     }
//   };

//   const sendCBT = async () => {
//     setSendError("");
//     setSendSuccess("");

//     if (!baseUri) {
//       setSendError("Please submit data first before minting.");
//       return;
//     }

//     if (!recipientAddress || !ethers.utils.isAddress(recipientAddress)) {
//       setSendError("Invalid recipient wallet address.");
//       return;
//     }

//     try {
//       await switchToSepolia();
//       const sbtwithSigner = SbtContract.connect(signer);
//       const resp = await sbtwithSigner.safeMint(recipientAddress, baseUri);

//       const txnHash=resp.hash;
//       const timestamp=new Date().tolocalString();

//       const newBatch={
//         batchId: `Batch-${batchCounter}`,
//         txns: [txnHash],
//         timestamp: timestamp,
//       };

//       setMintBatches(prev=> [...prev, newBatch]);
//       setBatchCounter(prev => prev+1);

//       setSendSuccess("Certificate successfully minted and sent!");
//       setTransactionData(txnHash);
//     } catch (err) {
//       console.error("Minting failed:", err);
//       setSendError(err.message);
//     }
//   };

//   useEffect(() => {
//     getCurrentWalletConnected();
//     addWalletListener();
//   }, [walletAddress]);

//   const connectWallet = async () => {
//     if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//       try {
//         await switchToSepolia();
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const accounts = await provider.send("eth_requestAccounts", []);
//         const network = await provider.getNetwork();
//         console.log("Connected to chain ID:", network.chainId);
//         setSigner(provider.getSigner());
//         setSbtContract(sbtContract(provider));
//         setWalletAddress(accounts[0]);
//       } catch (err) {
//         console.error(err.message);
//       }
//     } else {
//       console.log("Please install MetaMask");
//     }
//   };

//   const getCurrentWalletConnected = async () => {
//     if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//       try {
//         await switchToSepolia();
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const accounts = await provider.send("eth_accounts", []);
//         if (accounts.length > 0) {
//           setSigner(provider.getSigner());
//           setSbtContract(sbtContract(provider));
//           setWalletAddress(accounts[0]);
//         } else {
//           console.log("Connect to MetaMask using the Connect Wallet button");
//         }
//       } catch (err) {
//         console.error(err.message);
//       }
//     } else {
//       console.log("Please install MetaMask");
//     }
//   };

//   const addWalletListener = async () => {
//     if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//       window.ethereum.on("accountsChanged", (accounts) => {
//         setWalletAddress(accounts[0]);
//       });
//     } else {
//       setWalletAddress("");
//       console.log("Please install MetaMask");
//     }
//   };


//     const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setJsonFile(file);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = JSON.parse(e.target.result);
//         setParsedData(data);
//         console.log("Parsed JSON Data:", data);
//       } catch (err) {
//         console.error("Invalid JSON file");
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleMintBatch = async () => {
//       if (!parsedData || parsedData.length === 0) {
//       setMintStatus("No data to mint. Upload a valid JSON file first.");
//       return;
//     }
//     try{
//     const response = await fetch('http://localhost:5000/api/mintBatch', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(parsedData),
//     });
//      if (!response.ok) {
//         throw new Error("Minting failed. Check backend logs.");
//       }

//     const result = await res.json();
//     console.log("Mint Results:", result);
//     setMintStatus("✅ Certificates minted successfully!");
//   } catch(err){
//     console.error("Batch minting failed:", err);
//     setMintStatus("❌ Minting failed. See console for details.");
//   };


//   return (
//     <div>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/about" element={<Redirection />} />
//         </Routes>
//       </BrowserRouter>
//       <ParticlesBg type="cobweb" bg={true} />
//       <nav className="navbar is-black">
//         <div className="navbar-brand ml-3">
//           <h1 className="navbar-item has-text-white has-text-weight-bold is-size-4">
//             Certify
//           </h1>
//         </div>
//         <div id="navbarMenu" className="navbar-menu mr-4">
//           <div className="navbar-end is-align-items-center">
//             <button
//               className="button is-white connect-wallet"
//               onClick={connectWallet}
//             >
//               <span className="is-link has-text-weight-bold">
//                 {walletAddress && walletAddress.length > 0
//                   ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
//                   : "Connect Wallet"}
//               </span>
//             </button>
//           </div>
//         </div>
//       </nav>
//       <div className="mt-4 center">
//         <h1 className="center-text has-text-black has-text-weight-semibold">
//           Create, Mint and Send Certificates as SoulBound Tokens (non-transferrable NFTs)!
//         </h1>
//       </div>
//       <section className="hero is-fullheight center">
//         <div className="containerform">
//           <h1 className="has-text-black">Upload Certificate Details</h1> <br />
//           <form onSubmit={onSubmitHandler}>
//             <label htmlFor="file-upload" className="custom-file-upload has-text-black">
//               Select Image:
//             </label>
//             <input
//               id="file-upload"
//               type="file"
//               name="file"
//               className="mb-5 ml-5 button"
//             />
//             <br />
//             <label htmlFor="name" className="custom-name has-text-black">
//               Name of Recipient:
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={Inputname || ""}
//               onChange={(e) => setName(e.target.value)}
//               className="input is-small mb-5"
//             />
//             <br />
//             <label htmlFor="desc" className="custom-description has-text-black">
//               Description of Certificate:
//             </label>
//             <input
//               type="text"
//               id="desc"
//               name="desc"
//               value={Inputdesc || ""}
//               onChange={(e) => setDesc(e.target.value)}
//               className="input is-small mb-5"
//             />
//             <br />
//             <button className="button is-small mt-5" type="submit">
//               Submit Data
//             </button>
//           </form>
//           {uploadedImages && (
//             <div className="mt-4">
//               <p className="has-text-weight-bold">Preview of Uploaded Certificate:</p>
//               <img src={uploadedImages} alt="Uploaded" style={{ maxWidth: "300px" }} />
//             </div>
//           )}

//           <div className="mt-5">
//             <label htmlFor="mintadd" className="custom-description has-text-black">
//               Recipient's Wallet Address:
//             </label>
//             <input
//               className="input is-small"
//               type="text"
//               id="mintadd"
//               placeholder="Enter wallet address to send to (0x...)"
//               value={recipientAddress}
//               onChange={(e) => setRecipientAddress(e.target.value)}
//             />
//             <button
//               className="button is-link is-medium mt-4"
//               onClick={sendCBT}
//               disabled={!walletAddress}
//             >
//               Send Certificate
//             </button>
//             <div>
//       <h1>Upload Student JSON</h1>
//       <input type="file" accept=".json" onChange={handleFileChange} />
      
//       <button onClick={testLogTransaction}>Test Log Transaction</button>

//       {parsedData && (
//         <pre>{JSON.stringify(parsedData, null, 2)}</pre>
//       )}
//     </div>

//           </div>
//           <article className="panel mt-5">
//             <p className="panel-heading">Transaction Data</p>
//             <div className="panel-block">
//               {SendError && <p className="has-text-danger">Error: {SendError}</p>}
//               {SendSuccess && <p className="has-text-success">{SendSuccess}</p>}
//               {TransactionData && (
//                 <p className="has-text-success">
//                   Transaction Hash: <a href={`https://sepolia.etherscan.io/tx/${TransactionData}`} target="_blank" rel="noopener noreferrer">{TransactionData}</a>
//                 </p>
//               )}
//             </div>
//           </article>
//         </div>
//       </section>
//     </div>
//   );
// }
// }
// export default App;
// File: frontend/src/App.js

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import ParticlesBg from "particles-bg";
import Home from "./components/Home.js";
import Redirection from "./components/Redirection.js";
import sbtContract from "./ethereum/sbt.js";
import "./App.css";

/**
 * -------------------------------
 *  🔑 ENV VARIABLES (RECOMMENDED)
 *  --------------------------------
 *  VITE_PINATA_KEY=<key>
 *  VITE_PINATA_SECRET=<secret>
 *  VITE_BACKEND_URL=http://localhost:5000
 * ---------------------------------
 */

function App() {
  /* --------------------------------------------------
   * 🌐  WALLET + CONTRACT STATE
   * --------------------------------------------------*/
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [SBT, setSBT] = useState(null);

  /* --------------------------------------------------
   * 📂  BATCH MINT STATE
   * --------------------------------------------------*/
  const [imageFiles, setImageFiles] = useState([]);          // selected jpg/png certificates
  const [metadataArr, setMetadataArr] = useState([]);        // [{wallet, metadataUri, batch, year}]
  const [batchStatus, setBatchStatus] = useState("");       // UI feedback

  /* --------------------------------------------------
   * 1️⃣  WALLET CONNECT / LISTENERS
   * --------------------------------------------------*/
  useEffect(() => {
    initWallet();
    if (window?.ethereum) {
      window.ethereum.on("accountsChanged", (accts) => setWalletAddress(accts[0] || ""));
    }
  }, []);

  const initWallet = async () => {
    if (!window?.ethereum) return console.log("Install MetaMask");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_accounts", []);
    if (accounts.length) {
      setWalletAddress(accounts[0]);
      setSigner(provider.getSigner());
      setSBT(sbtContract(provider));
    }
  };

  const connectWallet = async () => {
    if (!window?.ethereum) return alert("Install MetaMask");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    initWallet();
  };

  /* --------------------------------------------------
   * 2️⃣  HANDLE CERTIFICATE FOLDER UPLOAD
   * --------------------------------------------------*/
  const handleFolder = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  /* --------------------------------------------------
   * 3️⃣  GENERATE METADATA (UPLOAD IMAGES ➜ PINATA)
   * --------------------------------------------------*/
  const generateMetadata = async () => {
    if (!imageFiles.length) return setBatchStatus("Select certificate images first.");
    setBatchStatus("Uploading images & creating metadata…");

      const key = process.env.REACT_APP_PINATA_KEY;
      const secret = process.env.REACT_APP_PINATA_SECRET;

    const out = [];
    for (const file of imageFiles) {
      try {
        // 3.1 Upload image
        const fd = new FormData();
        fd.append("file", file);
        const imgRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", fd, {
          maxBodyLength: "Infinity",
          headers: {
            ...fd.getHeaders?.(),
            pinata_api_key: key,
            pinata_secret_api_key: secret,
          },
        });
        const imgUrl = `https://gateway.pinata.cloud/ipfs/${imgRes.data.IpfsHash}`;

        // 3.2 Build & upload metadata JSON (wallet from filename)
        const wallet = file.name.split(".")[0];
        const metadata = {
          name: "Degree Certificate",
          description: `Graduation certificate for ${wallet}`,
          image: imgUrl,
        };
        const metaRes = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
          headers: {
            pinata_api_key: key,
            pinata_secret_api_key: secret,
            "Content-Type": "application/json",
          },
        });
        out.push({
          wallet,
          metadataUri: `ipfs://${metaRes.data.IpfsHash}`,
          batch: "B.Tech",
          year: 2026,
        });
      } catch (err) {
        console.error("Pinata upload failed", err);
        setBatchStatus(`Error uploading ${file.name}`);
        return;
      }
    }
    setMetadataArr(out);
    setBatchStatus(`✅ Metadata ready for ${out.length} students`);
  };

  /* --------------------------------------------------
   * 4️⃣  SEND METADATA ARRAY ➜ BACKEND FOR MINTING
   * --------------------------------------------------*/
  const mintBatch = async () => {
    if (!metadataArr.length) return setBatchStatus("Generate metadata first");
    try {
      setBatchStatus("Minting… check wallet for gas prompt");
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/mint-batch`;
      const { data } = await axios.post(url, metadataArr);
      setBatchStatus("🎉 Mint complete & logged!");
      console.log("Mint results", data);
    } catch (err) {
      console.error(err);
      setBatchStatus("❌ Mint failed – see console");
    }
  };

  /* --------------------------------------------------
   * 5️⃣  UI
   * --------------------------------------------------*/
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Redirection />} />
        </Routes>
      </Router>

      <ParticlesBg type="cobweb" bg={true} />

      {/* NAVBAR */}
      <nav className="navbar is-black px-4">
        <h1 className="navbar-item has-text-weight-bold has-text-white is-size-4">Certify</h1>
        <div className="navbar-end">
          <button className="button is-white" onClick={connectWallet}>
            {walletAddress ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </nav>

      {/* CORE PANEL */}
      <section className="section">
        <div className="container">
          <h2 className="title is-4">Batch Certificate Minting (ERC‑721 SBT)</h2>

          {/* 1. Select folder */}
          <div className="box">
            <h3 className="subtitle is-6">📂 Step 1 — Select certificate images</h3>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              directory=""
              webkitdirectory=""
              onChange={handleFolder}
            />
            {imageFiles.length > 0 && <p className="mt-2">Selected: {imageFiles.length} files</p>}
          </div>

          {/* 2. Generate metadata */}
          <button className="button is-info mb-4" onClick={generateMetadata}>
            🔄 Generate Metadata & Upload to IPFS
          </button>

          {/* 3. Mint */}
          <button className="button is-primary" onClick={mintBatch} disabled={!metadataArr.length}>
            🚀 Mint Batch
          </button>

          {batchStatus && <p className="mt-4 has-text-weight-semibold">{batchStatus}</p>}

          {metadataArr.length > 0 && (
            <pre className="mt-4 p-3 has-background-light" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {JSON.stringify(metadataArr.slice(0, 3), null, 2)}
            </pre>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
