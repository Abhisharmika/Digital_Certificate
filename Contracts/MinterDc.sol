// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MinterDc is ERC721URIStorage, Ownable {

    uint256 public tokenCounter;
    mapping(address => bool) public hasMinted;
    mapping(address => uint256) public studentCredits;

    constructor() ERC721("CollegeCertificate", "CERT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function assignCredits(address student, uint256 credits) public onlyOwner {
        studentCredits[student] = credits;
    }

    function mintCertificateFromOCR(
        address student,
        uint256 extractedCredits,
        string memory tokenURI
    ) public onlyOwner {
        require(studentCredits[student] >= 180, "Not eligible: Less than 180 credits");
        require(!hasMinted[student], "Already Minted");

        uint256 newItemId = tokenCounter;
        _safeMint(student, newItemId);
        _setTokenURI(newItemId, tokenURI);

        studentCredits[student] = extractedCredits;
        hasMinted[student] = true;
        tokenCounter++;
    }

}
