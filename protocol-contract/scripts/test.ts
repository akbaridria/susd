import { ethers } from "hardhat";
import datas from "../datas.json";
import { IPyth__factory, SUSDStabilityPool__factory, SUSDValidator__factory, SUSD__factory } from "../typechain-types";
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { clear } from "console";

async function main() {
  const [addr, addr1] = await ethers.getSigners();

  const e = await ethers.getContractFactory("SUSDValidator");
  const g = SUSDValidator__factory.connect(datas.susd_validator, e.runner)
  const d = await g.anchores(addr.address)
  console.log(d)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





