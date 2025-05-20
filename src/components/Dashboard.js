import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css"; // optional tiny CSS
import { Link } from "react-router-dom";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const CollegeDashboard = () => {
    const [batches, setBatches] = useState([]);
    const [open, setOpen] = useState({});      // {batchId:true/false}
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${BACKEND}/api/ledger`);
                setBatches(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLedger();
    }, []);

    const toggle = (batchId) =>
        setOpen((prev) => ({ ...prev, [batchId]: !prev[batchId] }));

    if (loading) return <p className="has-text-centered">Loading ledger…</p>;
    if (error) return <p className="has-text-danger">{error}</p>;

    return (
        <section className="section">
            <div style={{ marginBottom: "20px" }}>

                <Link to="/send-cert" style={{ marginLeft: "10px" }}>
                    <button className="button is-primary is-light">Send Certificates</button>
                </Link>
            </div>

            {/* ---- header ---- */}
            <div className="box mb-4">
                <article className="media">
                    <figure className="media-left">
                        <p className="image is-64x64">
                            {/* replace /logo.png with actual logo path */}
                            <img src="/logo.png" alt="College logo" />
                        </p>
                    </figure>
                    <div className="media-content">
                        <p className="title is-4">IIIT Lucknow – Examination Cell</p>
                        <p className="subtitle is-6">
                            examcell@iiitl.ac.in&nbsp;|&nbsp;+91-123-456-7890
                        </p>
                    </div>
                </article>
            </div>

            {/* ---- batches ---- */}
            {batches.map(({ batchId, txs }) => (
                <div key={batchId} className="box">
                    <div
                        className="is-flex is-justify-content-space-between is-clickable"
                        onClick={() => toggle(batchId)}
                    >
                        <strong>{batchId}</strong>
                        <span>{open[batchId] ? "▲" : "▼"}</span>
                    </div>

                    {open[batchId] && (
                        <table className="table is-fullwidth is-striped mt-3">
                            <thead>
                                <tr>
                                    <th>Student Wallet</th>
                                    <th>Token ID</th>
                                    <th>Tx Hash</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {txs.map((tx) => (
                                    <tr key={tx.txHash}>
                                        <td className="is-size-7">{tx.wallet}</td>
                                        <td>{tx.tokenId}</td>
                                        <td>
                                            <a
                                                href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {tx.txHash.slice(0, 10)}…
                                            </a>
                                        </td>
                                        <td>{new Date(tx.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ))}
        </section>

    );

};

export default CollegeDashboard;
