/**
 * @title The implement of Mint NFT using ERC-721 on Ethereum Network
 * @author M. Benjamin (IntelCore0103)
 * @notice The explanation is like this:
 * 
 *   source     => https://sergiomartinrubio.com/articles/how-to-create-and-mint-an-nft-with-hardhat/
 *                 https://www.quicknode.com/guides/ethereum-development/nfts/how-to-write-good-nft-smart-contract
 *                 https://consensys.github.io/smart-contract-best-practices/attacks/force-feeding/
 *                 https://medium.com/@solidity101/mastering-solidity-common-patterns-the-withdrawal-and-restricted-access-techniques-6db1901783d5
 *   hardhat    => https://hardhat.org/hardhat-runner/docs/getting-started#quick-start
 * 
 *   The OpenZeppelin implementation provides a set of interfaces and implementation for creating NFTs.
 * 
 *   ECDSA      => https://www.encryptionconsulting.com/education-center/what-is-ecdsa/
 *   EIP712     => https://medium.com/@ashwin.yar/eip-712-structured-data-hashing-and-signing-explained-c8ad00874486
 */

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { EIP712 } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract MyNFT721 is ERC721, EIP712, Ownable {
    uint256 private currentTokenId;                                                                     // Current Token ID
    uint256 private totalSupply;                                                                        // Number of total NFT
    uint256 private price;                                                                              // Price of NFT
    string base_Uri;                                                                                    // initial URI

    mapping(address => uint256) public userBalances;                                                    // userBalances[address] = balance
    mapping(address => bool) public admins;                                                             // admins[address] = bool

    constructor() ERC721("MYNFT721", "MNFT") EIP712("IntelCore", "1.0") Ownable(msg.sender) {
        currentTokenId = 0;
        price = 0.001 ether;
        totalSupply = 100;
    }

    modifier onlyAdmin() {                                                                              // define the "onlyAdmin" modifier
        require(admins[msg.sender], "Only admin can execute this function");
        _;
    }

    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
    }

    function mintNFT() public payable onlyAdmin returns (uint256) {
        /// @notice For the ERC721 we have to mint tokens one by one.
        require( currentTokenId < totalSupply, "Already supplied all NFT");
        require( msg.value >= price, "Not enough ETH");
        _safeMint(msg.sender, currentTokenId);
        currentTokenId++;
        return currentTokenId;
    }

    function _baseURI() internal override view virtual returns (string memory) {                        // define NFT token URI
        return base_Uri;
    }

    function setURI(string memory _uri) external onlyAdmin {                                            // Set base_Uri
        base_Uri = _uri;
    }

    function setPrice(uint256 _price) external onlyAdmin {
        price = _price;
    }

    function getPrice() external view returns (uint256) {
        return price;
    }

    function setSupply(uint256 _totalSupply) external onlyOwner {
        totalSupply = _totalSupply;
    }

    function getSupply() external view returns (uint256) {
        return totalSupply;
    }

    function deposit() external payable {
        userBalances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) external {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        userBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
