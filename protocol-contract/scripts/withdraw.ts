import { ethers } from "hardhat";
import datas from "../datas.json";
import { IPyth__factory, SUSDStabilityPool__factory, SUSDValidator__factory, SUSD__factory } from "../typechain-types";
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { clear } from "console";

async function main() {
  const [addr, addr1] = await ethers.getSigners();
  const provider = new ethers.JsonRpcProvider(datas.rpc);
  const e = await ethers.getContractFactory("SUSDStabilityPool");
  const d = SUSDStabilityPool__factory.connect(datas.susd_stability, e.runner)
  const s = await d.getUserInfo(addr.address)
  console.log(s)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





