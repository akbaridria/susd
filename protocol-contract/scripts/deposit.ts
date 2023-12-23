import { ethers } from "hardhat";
import datas from "../datas.json";
import { IPyth__factory, SUSDValidator__factory, SUSD__factory } from "../typechain-types";
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { clear } from "console";

async function main() {
  const d = IPyth__factory.connect(datas.pyth_address, new ethers.JsonRpcProvider(datas.rpc));
  const connection = new EvmPriceServiceConnection(datas.hermes);
  const priceUpdateData = await connection.getPriceFeedsUpdateData([datas.priceID]);
  const res = await d.getUpdateFee(priceUpdateData);
  const valid = await ethers.getContractFactory("SUSDValidator")
  const _valid = SUSDValidator__factory.connect(datas.susd_validator, valid.runner);
  
  // const g = await _valid.addCollateral(ethers.parseEther("0.01"), priceUpdateData, {
  //   gasLimit: 3_000_000,
  //   value: ethers.parseEther("0.01") + res
  // })
  // console.log(g);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





