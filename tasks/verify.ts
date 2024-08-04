import { task } from "hardhat/config";

task("verifyContract", "This is the command that I use when verify my contract")
    .addParam('addr', 'This is the address that I deployed on EVM')
    .setAction(async (taskArgs) => {
        await hre.run('verify:verify', {
            address: taskArgs.addr,
            constructorAgument: []
        });
        console.log('[ ] The contract verified successfully at: ', taskArgs.addr);
    })