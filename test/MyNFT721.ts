/**
 * @Contract address: https://sepolia.etherscan.io/address/0xcCb1e0e1501A2Ee13824de30aBb02b3E584b43B4#code
 */

import hre from 'hardhat'
import { ethers, Signer, BigNumberish } from 'ethers'
import { expect } from 'chai'
import { MyNFT721 } from '../typechain/contracts'

describe('MyNFT721', function () {
  let owner: Signer
  let admin: Signer
  let admin_1: Signer
  let MyNFTContract: MyNFT721
  let lockedAmount: bigint

  before(async function () {
    [owner, admin, admin_1] = await hre.ethers.getSigners()
    const NFTContract = await hre.ethers.getContractFactory('MyNFT721', owner)
    MyNFTContract = await NFTContract.deploy()
    await MyNFTContract.waitForDeployment()
    const ONE_GWEI = ethers.parseEther("5")
    lockedAmount = ONE_GWEI;
    await MyNFTContract.connect(owner).addAdmin(await admin.getAddress());                                         // Initial set to admin
    // await MyNFTContract.connect(admin).setURI("https://1kin.mypinata.cloud/ipfs/Qmb48bfpEzuuJ6VJFxQGn367kUWqTdk1h4Rv4zjmTpm36Y");
    await MyNFTContract.connect(admin).deposit({value: ethers.parseEther("0.001")});                                 // Initial admin deposit 5 eth
  })

  describe("Check owner:", function () {
    it("[ ] Should set the right owner", async function () {
      expect(await MyNFTContract.owner()).to.equal(owner);
    });
  });
  
  describe("Check Contract:", function () {
    it("[ ] set nft price by admin", async function () {
      await expect(MyNFTContract.connect(admin).setPrice(0.03));
    });
    
    it("[ ] get nft price", async function () {
      expect(MyNFTContract.connect(admin).setPrice(0.03));
      const current_Price = await MyNFTContract.getPrice();
      console.log('Current NFT price: ', current_Price);
      // await expect(current_Price).to.be.gt(0);                                                   // This assertion checks that current_Price is greater than 0
    });
    
    it("[ ] deposit balance by a user", async function () {
      const depositAmount = ethers.parseEther("1");
      console.log('depositAmount: ', depositAmount);
      
      await MyNFTContract.connect(admin).deposit({value: depositAmount});
      const balance = await MyNFTContract.userBalances(await admin.getAddress());
      console.log('balance: ', balance);
      
      expect(balance).to.equal(lockedAmount + depositAmount);
    });
    
    it("[ ] deposit balance by multiple users", async function () {
      const depositAmount1 = ethers.parseEther("1");
      const depositAmount2 = ethers.parseEther("2");
      const depositAmount = depositAmount1 + depositAmount2;
      console.log('depositAmount1: ', depositAmount1);
      console.log('depositAmount2: ', depositAmount2);
      console.log('Total depositAmount: ', depositAmount);
      
      await MyNFTContract.connect(admin).deposit({value: depositAmount1});
      await MyNFTContract.connect(admin_1).deposit({value: depositAmount2});
      const balance1 = await MyNFTContract.userBalances(await admin.getAddress());
      const balance2 = await MyNFTContract.userBalances(await admin_1.getAddress());
      const balance = balance1 + balance2;
      console.log('balance1: ', balance1);
      console.log('balance2: ', balance2);
      console.log('Total balance: ', balance);
      
      expect(balance).to.equal(lockedAmount + depositAmount);
    });
    
    it("[ ] should allow a user to withdraw funds if they have sufficient balance", async function () {
      const withdrawAmount = ethers.parseEther("2");
      
      // Perform the withdrawal
      await expect(async () => MyNFTContract.connect(admin).withdraw(withdrawAmount))
      .to.changeEtherBalances([admin, MyNFTContract], [withdrawAmount, -withdrawAmount]);
      
      // Verify the balance in the contract
      const balance = await MyNFTContract.userBalances(await admin.getAddress());
      console.log('withdraw balance: ', balance);
      expect(balance).to.equal(ethers.parseEther("3"));
    });
    
    it("[ ] should revert if a user tries to withdraw more than their balance", async function () {
      const withdrawAmount = ethers.parseEther("10");
      
      await expect(MyNFTContract.connect(admin).withdraw(withdrawAmount))
      .to.be.revertedWith('Insufficient balance');
    });
    
    it("[ ] should correctly update user balance after withdrawal", async function () {
      const withdrawAmount = ethers.parseEther("1");
      
      // Perform the withdrawal
      await MyNFTContract.connect(admin).withdraw(withdrawAmount);
      
      // Verify the balance in the contract
      const balance = await MyNFTContract.userBalances(await admin.getAddress());
      console.log('withdraw balance: ', balance);
      expect(balance).to.equal(ethers.parseEther("4"));                                                                      // lockedAmount - balance = 5 - 1 => 4 ETH
    });
  });
  
  it("[ ] set URI by real admin", async function () {
    const myURI = "https://gateway.pinata.cloud/ipfs/QmR9wa24jq8Z74RQoy4E6SmH7rjpWfwDtw3s7n56smWEub?_gl=1*16pmst5*_ga*MTUwNTM5MzEyOS4xNjc1Mzg3MTY3*_ga_5RMPXG14TE*MTY3NTY3Njk0Mi4yLjEuMTY3NTY3NzIzOC40My4wLjA";
    console.log('myURI: ', myURI);
    
    await MyNFTContract.connect(admin).setURI(myURI);
  });
  
  it("[ ] set URI by fake admin", async function () {
    const myURI = "https://gateway.pinata.cloud/ipfs/QmR9wa24jq8Z74RQoy4E6SmH7rjpWfwDtw3s7n56smWEub?_gl=1*16pmst5*_ga*MTUwNTM5MzEyOS4xNjc1Mzg3MTY3*_ga_5RMPXG14TE*MTY3NTY3Njk0Mi4yLjEuMTY3NTY3NzIzOC40My4wLjA";
    console.log('myURI: ', myURI);
    
    await expect(MyNFTContract.connect(admin_1).setURI(myURI)).to.be.revertedWith('Caller is not admin');
  });
  
  it("[ ] Mint NFT", async function () {
    await MyNFTContract.connect(admin).mintNFT({ value: ethers.parseEther("0.001") });
    expect(await MyNFTContract.ownerOf(0)).to.equal(await admin.getAddress());
  });
})