import React, { useState } from "react";
import { Link } from "react-router-dom";


const Home = ({
    connectWallet,
    handleFolder,
    generateMetadata,
    mintBatch,
    batchStatus,
    txHashes,
    loading,
    error,
    imageFiles,
    metadataArr,
}) => {
    const [jsonFile, setJsonFile] = useState(null);

    // Handle student JSON upload (optional - you can extend this)
    const handleJsonFileChange = (e) => {
        setJsonFile(e.target.files[0]);
    };

    // Optionally, you can implement sending this JSON file to backend
    // For now, just showing it in UI

    return (
        <div className="container" style={{ maxWidth: "700px", marginTop: "2rem" }}>
            <h2 className="title is-4">Batch Certificate Minting (ERC‑721 SBT)</h2>
            <div style={{ marginBottom: "20px" }}>
                {/* Other buttons or content */}

                <Link to="/dashboard" style={{ marginLeft: "10px" }}>
                    <button className="button is-link is-light">Back to Dashboard</button>
                </Link>
            </div>

            {/* Connect wallet */}
            <button className="button is-link mb-4" onClick={connectWallet}>
                Connect Wallet
            </button>

            {/* Step 1: Select certificate images folder */}
            <div className="box mb-4">
                <h3 className="subtitle is-6">📂 Step 1 — Select certificate images</h3>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    directory=""
                    webkitdirectory=""
                    onChange={handleFolder}
                />
                {imageFiles.length > 0 && (
                    <p className="mt-2">Selected {imageFiles.length} images</p>
                )}
            </div>

            {/* Step 2: Upload student JSON file (optional) */}
            <div className="box mb-4">
                <h3 className="subtitle is-6">📄 Step 2 — Upload student JSON file (optional)</h3>
                <input type="file" accept=".json" onChange={handleJsonFileChange} />
                {jsonFile && <p className="mt-2">Selected: {jsonFile.name}</p>}
            </div>

            {/* Step 3: Generate metadata & upload to IPFS */}
            <button className="button is-info mb-4" onClick={generateMetadata} disabled={!imageFiles.length}>
                🔄 Generate Metadata & Upload to IPFS
            </button>

            {/* Step 4: Mint batch */}
            <div style={{ paddingTop: "1rem" }}>
                <button
                    className="button is-primary"
                    onClick={mintBatch}
                    disabled={loading || !metadataArr.length}
                >
                    {loading ? "⏳ Minting..." : "🚀 Mint Batch"}
                </button>
            </div>

            {/* Status & Errors */}
            {batchStatus && (
                <p className="has-text-weight-semibold mt-4">{batchStatus}</p>
            )}
            {error && <p className="has-text-danger mt-2">❌ {error}</p>}

            {/* Minted token IDs / tx hashes */}
            {txHashes.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>✅ Minted Token IDs / Tx Hashes:</h3>
                    <ul>
                        {txHashes.map((tx, i) => (
                            <li key={i}>🎟 {tx}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Show metadata preview */}
            {metadataArr.length > 0 && (
                <pre
                    className="mt-4 p-3 has-background-light"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                    {JSON.stringify(metadataArr.slice(0, 3), null, 2)}
                </pre>
            )}
        </div>
    );
};

export default Home;
