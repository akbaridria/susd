import { ethers } from "hardhat";
import datas from "../datas.json";
import { IPyth__factory, SUSDValidator__factory, SUSD__factory } from "../typechain-types";
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';

async function main() {
  const susd = await ethers.getContractFactory("SUSD")
  const _susd = SUSD__factory.connect(datas.susd, susd.runner);
  const e = await _susd.changeValidator(datas.susd_validator, {
    gasLimit: 1_000_000
  });

  console.log(e.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
