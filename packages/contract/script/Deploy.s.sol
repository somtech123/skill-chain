// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Script} from "forge-std/Script.sol";
import {ProofVerifier} from "../src/ProofVerifier.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {SoulboundNft} from '../src/SoulboundNft.sol';

contract Deploy is Script {
    function run() external returns (ProofVerifier, SoulboundNft) {
        HelperConfig helperConfig = new HelperConfig();

        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();

        vm.startBroadcast();
        ProofVerifier proofVerifier = new ProofVerifier(config.trustedSigner);
        SoulboundNft nft = new SoulboundNft();
        vm.stopBroadcast();

        return (proofVerifier, nft);
    }
}
