import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import 'hardhat-contract-sizer';
import 'hardhat-deploy';
import './tasks/deploy';
import './tasks/verify';
import * as dotenv from 'dotenv';
dotenv.config();

const accounts = [process.env.PRIVATE_KEY || '', process.env.PRIVATE_KEY2 || '', process.env.PRIVATE_KEY3 || ''];
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

const config: HardhatUserConfig = {
  defaultNetwork: 'sepolia',

  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5"
  },
  namedAccounts: {
    deployer: {
      default: 0                                                                      // wallet address 0, of the mnemonic in .env
    }
  },
  networks: {
    sepolia: {
      url: 'https://sepolia.drpc.org',
      accounts
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      chainId: 43114,
      accounts
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD'
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true
  }
};

export default config;
