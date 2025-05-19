// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SBT721Certificate is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    event BatchCertificateMinted(address indexed operator, uint256[] tokenIds);

constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    /// @notice Batch-mint certificates; only owner (college) can call
    function batchMint(address[] calldata recipients) external onlyOwner returns (uint256[] memory) {
        require(recipients.length > 0, "No recipients");

        uint256[] memory minted = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            _tokenIdCounter++;
            _safeMint(recipients[i], _tokenIdCounter);
            minted[i] = _tokenIdCounter;
        }

        emit BatchCertificateMinted(msg.sender, minted);
        return minted;
    }

    /// @dev Block any transfer or approval (Soulbound)
    function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
) internal virtual override {
    require(from == address(0) || to == address(0), "SBT: Non-transferable");
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
}


    function approve(address, uint256) public pure override {
        revert("SBT: approvals disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("SBT: approvals disabled");
    }
}
