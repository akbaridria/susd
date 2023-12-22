import { ethers } from "hardhat";
import datas from "../datas.json";
import { IPyth__factory, SUSDValidator__factory } from "../typechain-types";
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';

async function main() {
  const d = IPyth__factory.connect(datas.pyth_address, new ethers.JsonRpcProvider(datas.rpc));
  const connection = new EvmPriceServiceConnection(datas.hermes);
  const priceUpdateData = await connection.getPriceFeedsUpdateData([datas.priceID]);
  const res = await d.getUpdateFee(priceUpdateData);
  const valid = await ethers.getContractFactory("SUSDValidator")
  const _valid = SUSDValidator__factory.connect(datas.susd_validator, valid.runner);
  const e = await _valid.mint(ethers.parseEther("0.05"), priceUpdateData, {
    gasLimit: 3_000_000,
    value: res + ethers.parseEther("1")
  })
  console.log(e.hash);
  console.log(res + ethers.parseEther("5"))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
