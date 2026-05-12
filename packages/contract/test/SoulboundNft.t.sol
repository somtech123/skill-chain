// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

 import {Test} from "forge-std/Test.sol";
 import {Deploy} from '../script/Deploy.s.sol';
 import {SoulboundNft} from '../src/SoulboundNft.sol';
 

 contract SoulboundNftTest is Test{
    SoulboundNft nft;
    string constant TOKEN_URI_1 = "ipfs://QmXyz1234abcd/metadata1.json";

    address owner;
    address public alice  = makeAddr("alice");
      address minter = makeAddr("minter");
    


    function setUp()public{
        Deploy deploy = new Deploy();
        (, nft) = deploy.run();
        owner = nft.owner();
        vm.prank(owner);
        nft.setMinter(minter, true);
        
    }

    function test_Deploy_NftSymbol() public view {
        assertEq(nft.symbol(), "SBC");
    }
     function test_Deploy_OwnerSet() public view {
        assertEq(nft.owner(), owner);
    }
 function test_Issue_MintsTokenToRecipient() public {
   bytes32 achievement = keccak256(
        abi.encodePacked("solidity", "100")
    );
        vm.prank(minter);
        nft.issue(alice, TOKEN_URI_1,  achievement);
        assertEq(nft.ownerOf(0), alice);
    }

 }