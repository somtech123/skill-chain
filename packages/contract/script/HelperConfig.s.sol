// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Script} from "forge-std/Script.sol";

abstract contract CodeConstants {
    uint256 public constant LOCAL_CHAIN_ID = 31337;
    uint256 public constant ANVIL_SIGNER_PRIVATE_KEY = 0xabc123;
}

contract HelperConfig is Script, CodeConstants {
    struct NetworkConfig {
        address trustedSigner;
    }

    NetworkConfig public localNetworkConfigs;
    mapping(uint256 chainId => NetworkConfig) networkConfigs;

    function getConfig() public view returns (NetworkConfig memory) {
        return getConfigByChainId(block.chainid);
    }

    function getConfigByChainId(
        uint256 chainId
    ) internal view returns (NetworkConfig memory) {
        if (chainId == LOCAL_CHAIN_ID) {
            return localNetworkConfigs;
        } else {
            return getOtherChainConfig();
        }
    }

    function getOtherChainConfig()
        internal
        view
        returns (NetworkConfig memory)
    {
        return
            NetworkConfig({
                trustedSigner: vm.envAddress("TRUSTED_SIGNER_ADDRESS")
            });
    }

    function getOrCreateAnvilConfig() internal returns (NetworkConfig memory) {
        if (localNetworkConfigs.trustedSigner != address(0)) {
            return localNetworkConfigs;
        }

        localNetworkConfigs = NetworkConfig({
            trustedSigner: vm.addr(ANVIL_SIGNER_PRIVATE_KEY)
        });

        return localNetworkConfigs;
    }
}
