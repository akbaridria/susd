import { ethers } from "hardhat";
import datas from "../datas.json";
import { IPyth__factory, SUSDStabilityPool__factory, SUSDValidator__factory, SUSD__factory } from "../typechain-types";
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { clear } from "console";

async function main() {
  
  const [addr, addr1] = await ethers.getSigners();
  const provider = new ethers.JsonRpcProvider(datas.rpc);
  const e = await ethers.getContractFactory("SUSDValidator");
  const d = IPyth__factory.connect(datas.pyth_address, new ethers.JsonRpcProvider(datas.rpc));
  const connection = new EvmPriceServiceConnection(datas.hermes);
  const priceUpdateData = await connection.getPriceFeedsUpdateData([datas.priceID]);
  const res = await d.getUpdateFee(priceUpdateData);
  const stabil = await ethers.getContractFactory("SUSDStabilityPool");
  const _stabil = await SUSDStabilityPool__factory.connect(datas.susd_stability, stabil.runner)
  _stabil.liquidate(ethers.parseEther("100"), addr.address, priceUpdateData, {
    gasLimit: 3_000_000,
    value: res
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





