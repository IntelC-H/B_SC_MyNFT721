import { task } from "hardhat/config";

task("deployContract", "This is the command that I use when deploy my contract")
    .setAction(async () => {
        const MyNFT721 = await hre.ethers.deployContract('MyNFT721');
        console.log('[ ] The contract deployed successfully at: ', await MyNFT721.getAddress());
    })