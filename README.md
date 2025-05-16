# Certify - Blockchain-Based Certificates

**Track and Issue Non-Transferable Certificates using Soulbound Tokens (SBT) - ERC721**

<p align="center">
  Ensure you have <a href="https://reactjs.org/">React</a> installed for local setup.<br/>
  <a href="https://github.com/Abhisharmika/Digital_Certificate">Project Repository</a>
</p>

---

## 📋 Table of Contents
- [About the Project](#about-the-project)
- [Project Breakdown](#project-breakdown)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributions](#contributions)

---

## 🧐 About the Project

This project implements blockchain-based certificates using **Soulbound Tokens (SBTs)** — non-transferable ERC721 tokens that represent genuine identity and certification records. Once minted, these certificates are permanently tied to the recipient, ensuring authenticity and preventing fraud or unauthorized transfer.

---

## 🔨 Project Breakdown

- Development of an ERC721 smart contract modified to include Soulbound properties, making certificates **non-transferable** by overriding token transfer hooks.
- Deployment of the contract on the Goerli test network using Hardhat.
- Interaction with the smart contract using Ethers.js to securely mint certificates.
- Integration with IPFS to store certificate metadata off-chain and retrieve IPFS hashes for token data.
- Frontend built with ReactJS that interfaces with IPFS, Ethers.js, and provides a smooth development experience.

---

### 🛠 Built With

**Frontend:**
- React
- JavaScript
- Ethers.js
- IPFS HTTP Client
- Bulma CSS Framework
- Particles-bg (for UI effects)

**Smart Contract:**
- Solidity (ERC721 with Soulbound modifications)
- Hardhat (deployment and testing)
- Remix (development)
- MetaMask (wallet integration)

---

## 🚀 Getting Started

### 🔨 Installation
1. Clone the repo

```sh
git clone https://github.com/Abhisharmika/Digital_Certificate.git
```

2. Installing dependencies and requirements

```sh
cd Web3Certificate
npm install ethers
npm install ipfs-http-client
npm install particles-bg
npm install bulma
```

Note: In case the project is still not working, use
```sh
npm i
```

3. Running the APP
```sh
npm start
```

## 🧠 Usage
Built version:
- npm v8.1.2
- Node v16.13.2

The Basic goal is to make certificate records easily accessible.
Reliable and data once minted cannot be deleted or erased which happens in centralized systems.
