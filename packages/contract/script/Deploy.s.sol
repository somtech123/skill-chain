// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Script} from "forge-std/Script.sol";
import {ProofVerifier} from "../src/ProofVerifier.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract Deploy is Script {
    function run() external returns (ProofVerifier) {
        HelperConfig helperConfig = new HelperConfig();

        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();

        vm.startBroadcast();
        ProofVerifier proofVerifier = new ProofVerifier(config.trustedSigner);
        vm.stopBroadcast();

        return (proofVerifier);
    }
}
