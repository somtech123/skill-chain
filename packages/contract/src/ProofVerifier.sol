// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol"; // ← add this

contract ProofVerifier is Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public trustedSigner;

    struct Proof {
        bytes32 achievementHash;
        uint256 timestamp;
        bool verified;
    }
    error ProofVerifier__ProofExpired();
    error ProofVerifier__ProofAlreadyUsed();
    error ProofVerifier__InValidSigner();

    event ProofSubmitted(address indexed user, bytes32 achievementHash);

    mapping(address => Proof[]) public userProofs;
    mapping(bytes32 => bool) public usedProofs;

    constructor(address _trustedSigner) Ownable(msg.sender) {
        trustedSigner = _trustedSigner;
    }

    function submitProof(
        bytes32 achievementHash,
        uint256 timestamp,
        bytes calldata signature
    ) external {
        if (block.timestamp > timestamp + 10 minutes)
            revert ProofVerifier__ProofExpired();

        bytes32 messageHash = keccak256(
            abi.encodePacked(msg.sender, achievementHash, timestamp)
        );

        if (usedProofs[messageHash]) revert ProofVerifier__ProofAlreadyUsed();

        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        address signer = ethSignedMessageHash.recover(signature);
        if (signer != trustedSigner) revert ProofVerifier__InValidSigner();

        usedProofs[messageHash] = true;
        userProofs[msg.sender].push(
            Proof({
                achievementHash: achievementHash,
                timestamp: timestamp,
                verified: true
            })
        );

        emit ProofSubmitted(msg.sender, achievementHash);
    }

    function getProofs(address user) external view returns (Proof[] memory) {
        return userProofs[user];
    }

    function updateTrustedSigner(address newSigner) external onlyOwner {
        trustedSigner = newSigner;
    }
}
