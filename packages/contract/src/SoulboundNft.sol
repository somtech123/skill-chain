// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundNft is ERC721URIStorage, Ownable {

    
   error SoulboundNft__NotTransferable();
   error SoulboundNft__NotMinter();
   error SoulboundNft__AchievementAlreadyIssued(address user, bytes32 achievement);


   event Issued(address indexed to, uint256 indexed tokenId,bytes32 indexed achievement, string tokenURI);
   event MinterUpdated(address indexed minter, bool authorized);
   event Revoked(address indexed from, uint256 indexed tokenId, bytes32 achievement);


     uint256 private _tokenIdCounter;
     mapping (address => bool) public isMinter;
     mapping(uint256 => bytes32) public tokenAchievement;

    /// @notice Prevents duplicate achievements per user
    /// user => achievementId => tokenId+1 (0 means not issued)
    mapping(address => mapping(bytes32 => uint256)) public achievementToken;
     
    constructor() ERC721("SkillChainSoulboundCredential", "SBC")  Ownable(msg.sender) {  }

    modifier onlyMinter {
        _onlyMinter();
        _;
    }
    function _onlyMinter() internal view {
        if(!isMinter[msg.sender]) revert SoulboundNft__NotMinter();
     }

// ── Owner: manage minters ──────────────────────────
    function setMinter(address _minter, bool authorized) external onlyOwner{
        isMinter[_minter] = authorized;
        emit MinterUpdated(_minter, authorized);
    }

    function _update(address to,
        uint256 tokenId,
        address auth) internal override returns (address){
            address from = _ownerOf(tokenId);
            if(from != address(0) && to != address(0)) revert SoulboundNft__NotTransferable();
            return super._update(to, tokenId, auth);
        }

    function issue(address to, string memory tokenURI, bytes32 achievement) external onlyMinter returns(uint256){
        if(achievementToken[to][achievement] !=0){
            revert SoulboundNft__AchievementAlreadyIssued(to, achievement);
        }
         uint256 tokenId = _tokenIdCounter++;
         _safeMint(to, tokenId);
         _setTokenURI(tokenId, tokenURI);
 
         tokenAchievement[tokenId] = achievement;
         achievementToken[to][achievement] = tokenId + 1; // +1 so tokenId 0 is valid
         emit Issued(to, tokenId,achievement, tokenURI);
         return tokenId;
    }

    function revoke(uint256 tokenId) external onlyOwner{
        address tokenOwner = ownerOf(tokenId);
           bytes32 achievement = tokenAchievement[tokenId];
           if (achievement != bytes32(0)) {
            delete achievementToken[tokenOwner][achievement];
            delete tokenAchievement[tokenId];
        }

        _burn(tokenId);

        emit Revoked(tokenOwner, tokenId, achievement);
    }

    function totalIssued() external view returns (uint256) {
        return _tokenIdCounter;
    }
      function hasAchievement(address user, bytes32 achievement) external view returns (bool) {
        return achievementToken[user][achievement] != 0;
    }


}