import ParticlesBg from "particles-bg";
import { useEffect, useState } from "react";
import {
  useNavigate,
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import { ethers } from "ethers";
import sbtContract from "./ethereum/sbt.js";
import Home from "./components/Home.js";
import Redirection from "./components/Redirection.js";
import axios from "axios";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [SbtContract, setSbtContract] = useState();
  const [SendSuccess, setSendSuccess] = useState("");
  const [SendError, setSendError] = useState("");
  const [TransactionData, setTransactionData] = useState();

  const [uploadedImages, setUploadedImages] = useState();
  const [Inputname, setName] = useState();
  const [Inputdesc, setDesc] = useState();
  const [baseUri, setUri] = useState();

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              rpcUrls: ['https://rpc.sepolia.org'],
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });
        } catch (addError) {
          console.error("Error adding Sepolia:", addError.message);
        }
      } else {
        console.error("Error switching network:", switchError.message);
      }
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const form = event.target;
    const name = Inputname;
    const desc = Inputdesc;
    const files = form.file.files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const fileRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: "ff5d33d0080f00b29160",
            pinata_secret_api_key: "56dbea51571a11b65d83aa5459520944c8190c39068680de4bd691f2aec51497",
          },
        }
      );

      const imageHash = fileRes.data.IpfsHash;
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;

      setUploadedImages(imageUrl);
      setName(name);
      setDesc(desc);

      const metadata = {
        name: name,
        description: desc,
        image: imageUrl,
      };

      const metadataRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            pinata_api_key: "ff5d33d0080f00b29160",
            pinata_secret_api_key: "56dbea51571a11b65d83aa5459520944c8190c39068680de4bd691f2aec51497",
            "Content-Type": "application/json",
          },
        }
      );

      const metadataHash = metadataRes.data.IpfsHash;
      setUri(metadataHash);
      console.log("Metadata IPFS Hash:", metadataHash);

      form.reset();
    } catch (error) {
      console.error("Pinata upload failed:", error);
      alert("Upload to Pinata failed");
    }
  };

  const sendCBT = async () => {
    setSendError("");
    setSendSuccess("");

    if (!baseUri) {
      setSendError("Please submit data first before minting.");
      return;
    }

    try {
      await switchToSepolia(); // <- Ensure correct network
      const sbtwithSigner = SbtContract.connect(signer);
      const resp = await sbtwithSigner.safeMint(
        document.getElementById("mintadd").value,
        baseUri
      );
      console.log("Minting with baseUri:", baseUri);
      setSendSuccess("Certificate successfully minted and sent!");
      setTransactionData(resp.hash);
    } catch (err) {
      console.error("Minting failed:", err);
      setSendError(err.message);
    }
  };

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        await switchToSepolia(); // <- Ensure Sepolia selected
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        console.log("Connected to chain ID:", network.chainId);
        setSigner(provider.getSigner());
        setSbtContract(sbtContract(provider));
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        await switchToSepolia(); // <- Ensure Sepolia selected
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setSigner(provider.getSigner());
          setSbtContract(sbtContract(provider));
          setWalletAddress(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect Wallet button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    } else {
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<Redirection />} />
        </Routes>
      </BrowserRouter>
      <ParticlesBg type="cobweb" bg={true} />
      <nav className="navbar is-black">
        <div className="navbar-brand ml-3">
          <h1 className="navbar-item has-text-white has-text-weight-bold is-size-4">
            Certify
          </h1>
        </div>
        <div id="navbarMenu" className="navbar-menu mr-4">
          <div className="navbar-end is-align-items-center">
            <button
              className="button is-white connect-wallet"
              onClick={connectWallet}
            >
              <span className="is-link has-text-weight-bold">
                {walletAddress && walletAddress.length > 0
                  ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                  : "Connect Wallet"}
              </span>
            </button>
          </div>
        </div>
      </nav>
      <div className="mt-4 center">
        <h1 className="center-text has-text-black has-text-weight-semibold">
          Create, Mint and Send Certificates as SoulBound Tokens (non-transferrable NFTs)!
        </h1>
      </div>
      <section className="hero is-fullheight center">
        <div className="containerform">
          <h1 className="has-text-black">Upload Certificate Details</h1> <br />
          <form onSubmit={onSubmitHandler}>
            <label htmlFor="file-upload" className="custom-file-upload has-text-black">
              Select Image:
            </label>
            <input
              id="file-upload"
              type="file"
              name="file"
              className="mb-5 ml-5 button"
            />
            <br />
            <label htmlFor="name" className="custom-name has-text-black">
              Name of Recipient:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={Inputname || ""}
              onChange={(e) => setName(e.target.value)}
              className="input is-small mb-5"
            />
            <br />
            <label htmlFor="desc" className="custom-description has-text-black">
              Description of Certificate:
            </label>
            <input
              type="text"
              id="desc"
              name="desc"
              value={Inputdesc || ""}
              onChange={(e) => setDesc(e.target.value)}
              className="input is-small mb-5"
            />
            <br />
            <button className="button is-small mt-5" type="submit">
              Submit Data
            </button>
          </form>
          {uploadedImages && (
            <div className="mt-4">
              <p className="has-text-weight-bold">Preview of Uploaded Certificate:</p>
              <img src={uploadedImages} alt="Uploaded" style={{ maxWidth: "300px" }} />
            </div>
          )}

          <div className="mt-5">
            <label htmlFor="mintadd" className="custom-description has-text-black">
              Recipient's Wallet Address:
            </label>
            <input
              className="input is-small"
              type="text"
              id="mintadd"
              placeholder="Enter wallet address to send to (0x...)"
            />
            <button
              className="button is-link is-medium mt-4"
              onClick={sendCBT}
              disabled={!walletAddress}
            >
              Send Certificate
            </button>
          </div>
          <article className="panel mt-5">
            <p className="panel-heading">Transaction Data</p>
            <div className="panel-block">
              {SendError && <p className="has-text-danger">Error: {SendError}</p>}
              {SendSuccess && <p className="has-text-success">{SendSuccess}</p>}
              {TransactionData && (
                <p className="has-text-success">
                  Transaction Hash: <a href={`https://sepolia.etherscan.io/tx/${TransactionData}`} target="_blank" rel="noopener noreferrer">{TransactionData}</a>
                </p>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default App;
