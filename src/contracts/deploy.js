
// This is a script to deploy the InjectAI DAO contract to the Minato Testnet
const { ethers } = require("ethers");
const fs = require("fs");

// To deploy this contract to Minato Testnet, follow these steps:
// 1. Install dependencies: npm install ethers@5.7.2
// 2. Save your private key securely as an environment variable
// 3. Run this script with: PRIVATE_KEY=your_private_key node deploy.js

const CONTRACT_SOURCE = "./InjectAI_DAO.sol";
const MINATO_RPC_URL = "https://rpc.minato.soneium.org/";

async function deploy() {
  console.log("Deploying InjectAI DAO contract to Minato Testnet...");
  
  // Connect to the Minato Testnet
  const provider = new ethers.providers.JsonRpcProvider(MINATO_RPC_URL);
  
  // Load your wallet using a private key
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY environment variable not set");
  }
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log(`Deploying from account: ${wallet.address}`);
  
  // Load contract ABI and bytecode
  // In a real deployment script, you would compile the contract and get ABI/bytecode
  
  // Hardcoded compiled contract details for example only
  const contractFactory = new ethers.ContractFactory(
    ABI, // This would be the ABI from compilation
    BYTECODE, // This would be the bytecode from compilation
    wallet
  );
  
  console.log("Sending deployment transaction...");
  const contract = await contractFactory.deploy();
  
  console.log(`Transaction hash: ${contract.deployTransaction.hash}`);
  console.log(`Waiting for confirmation...`);
  
  await contract.deployed();
  
  console.log(`Contract successfully deployed at: ${contract.address}`);
  console.log(`To interact with this contract:`);
  console.log(`1. Go to Settings in the app`);
  console.log(`2. Enter the contract address: ${contract.address}`);
  console.log(`3. Connect your wallet to Minato Testnet (Chain ID: 1946)`);
  
  return contract.address;
}

// For user documentation purposes
console.log(`
==========================================================
InjectAI DAO Contract Deployment Guide
==========================================================

To deploy the InjectAI DAO contract to Minato Testnet:

1. Install required dependencies:
   $ npm install -g hardhat
   $ npm install @nomicfoundation/hardhat-toolbox ethers@5.7.2

2. Create a hardhat.config.js file:
   ```
   require("@nomicfoundation/hardhat-toolbox");
   module.exports = {
     solidity: "0.8.20",
     networks: {
       minato: {
         url: "https://rpc.minato.soneium.org/",
         accounts: [process.env.PRIVATE_KEY],
         chainId: 1946
       }
     }
   };
   ```

3. Copy the InjectAI_DAO.sol to the contracts folder

4. Run the deployment command:
   $ PRIVATE_KEY=your_private_key npx hardhat run deploy.js --network minato

5. Once deployed, copy the contract address to the settings page
   in the application to connect to your deployed contract.

==========================================================
`);

// Uncomment to run the deployment
// if (require.main === module) {
//   deploy().catch(console.error);
// }

module.exports = { deploy };
