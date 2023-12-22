import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat';
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    "vic-testnet": {
      url: "https://rpc.testnet.tomochain.com",
      chainId: 89,
      accounts: [process.env.PRIVATE_KEY as string, process.env.PRIVATE_KEY2 as string]
    }
  }
};

export default config;
