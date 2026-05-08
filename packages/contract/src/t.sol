// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// import {Test} from "forge-std/Test.sol";
// import {ProofVerifier} from "../src/ProofVerifier.sol";

// contract ProofVerifierTest is Test {
//     ProofVerifier public verifier;

//     // Foundry gives us a known private key we can sign with
//     uint256 constant SIGNER_PRIVATE_KEY = 0xabc123;
//     address trustedSigner;
//     address user = makeAddr("user");

//     function setUp() public {
//         trustedSigner = vm.addr(SIGNER_PRIVATE_KEY); // derive address from private key
//         verifier = new ProofVerifier(trustedSigner);
//     }

//     function _buildSignature(
//         address _user,
//         bytes32 _achievementHash,
//         uint256 _timestamp
//     ) internal returns (bytes memory) {
//         bytes32 messageHash = keccak256(
//             abi.encodePacked(_user, _achievementHash, _timestamp)
//         );
//         bytes32 ethSignedHash = messageHash.toEthSignedMessageHash(); // ← need to import ECDSA or do manually
//         (uint8 v, bytes32 r, bytes32 s) = vm.sign(
//             SIGNER_PRIVATE_KEY,
//             ethSignedHash
//         );
//         return abi.encodePacked(r, s, v);
//     }

//     // ✅ happy path
//     function test_SubmitProofSuccess() public {
//         bytes32 achievementHash = keccak256("completed level 1");
//         uint256 timestamp = block.timestamp;

//         bytes memory sig = _buildSignature(user, achievementHash, timestamp);

//         vm.prank(user);
//         verifier.submitProof(achievementHash, timestamp, sig);

//         ProofVerifier.Proof[] memory proofs = verifier.getProofs(user);
//         assertEq(proofs.length, 1);
//         assertEq(proofs[0].achievementHash, achievementHash);
//         assertTrue(proofs[0].verified);
//     }

//     // ❌ expired proof
//     function test_RevertWhen_ProofExpired() public {
//         bytes32 achievementHash = keccak256("completed level 1");
//         uint256 timestamp = block.timestamp;

//         bytes memory sig = _buildSignature(user, achievementHash, timestamp);

//         // warp 11 minutes into the future
//         vm.warp(block.timestamp + 11 minutes);

//         vm.prank(user);
//         vm.expectRevert(ProofVerifier.ProofVerifier__ProofExpired.selector);
//         verifier.submitProof(achievementHash, timestamp, sig);
//     }

//     // ❌ replay attack
//     function test_RevertWhen_ProofAlreadyUsed() public {
//         bytes32 achievementHash = keccak256("completed level 1");
//         uint256 timestamp = block.timestamp;

//         bytes memory sig = _buildSignature(user, achievementHash, timestamp);

//         vm.startPrank(user);
//         verifier.submitProof(achievementHash, timestamp, sig); // first use ✅

//         vm.expectRevert(ProofVerifier.ProofVerifier__ProofAlreadyUsed.selector);
//         verifier.submitProof(achievementHash, timestamp, sig); // second use ❌
//         vm.stopPrank();
//     }

//     // ❌ wrong signer
//     function test_RevertWhen_InvalidSigner() public {
//         bytes32 achievementHash = keccak256("completed level 1");
//         uint256 timestamp = block.timestamp;

//         // sign with a different private key
//         uint256 wrongKey = 0xdeadbeef;
//         bytes32 messageHash = keccak256(
//             abi.encodePacked(user, achievementHash, timestamp)
//         );
//         (uint8 v, bytes32 r, bytes32 s) = vm.sign(wrongKey, messageHash);
//         bytes memory sig = abi.encodePacked(r, s, v);

//         vm.prank(user);
//         vm.expectRevert(ProofVerifier.ProofVerifier__InvalidSigner.selector);
//         verifier.submitProof(achievementHash, timestamp, sig);
//     }
// }
