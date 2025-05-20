// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SBT721Certificate  is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    event BatchCertificateMinted(address indexed minter, uint256[] tokenIds);

    constructor() ERC721("SoulBoundCertificate", "SBT") {}

    function batchMint(address[] calldata recipients, string[] calldata tokenURIs)
        external
        onlyOwner
        returns (uint256[] memory)
    {
        require(recipients.length > 0, "No recipients");
        require(recipients.length == tokenURIs.length, "Mismatched array lengths");

        uint256[] memory minted = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            _tokenIdCounter++;
            uint256 newTokenId = _tokenIdCounter;

            _safeMint(recipients[i], newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);

            minted[i] = newTokenId;
        }

        emit BatchCertificateMinted(msg.sender, minted);
        return minted;
    }

    // Override to prevent transfers (SoulBound behavior)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "SoulBound: non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}


