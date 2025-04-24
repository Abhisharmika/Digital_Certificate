// contracts/SBT1155Certificate.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SBT1155Certificate is ERC1155, Ownable {
    uint256 public currentTokenId = 1;

    mapping(uint256 => string) public tokenURIs;
    mapping(address => bool) public hasMinted;

    constructor() ERC1155("") {}

    function mintCertificate(address student, string memory uri) external onlyOwner {
        require(!hasMinted[student], "Student already has a certificate");

        _mint(student, currentTokenId, 1, "");
        tokenURIs[currentTokenId] = uri;
        hasMinted[student] = true;

        currentTokenId++;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return tokenURIs[tokenId];
    }

    function setURI(uint256 tokenId, string memory newUri) public onlyOwner {
        tokenURIs[tokenId] = newUri;
    }

    // Override transfer functions to make SBT
    function safeTransferFrom(...) public virtual override {
        revert("Soulbound: Certificates are non-transferable");
    }

    function safeBatchTransferFrom(...) public virtual override {
        revert("Soulbound: Certificates are non-transferable");
    }
}
