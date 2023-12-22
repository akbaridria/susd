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
  const susd = await ethers.getContractFactory("SUSD");
  const _susd = SUSD__factory.connect(datas.susd, susd.runner)
  
  const f = await _valid.anchores("0x694aCF4DFb7601F92A0D2a41cdEC5bf7726C7294");
  const g = await _susd.approve(datas.susd_validator, f.debt, {
    gasLimit: 1_000_000
  })
  console.log(g.hash);
  const e = await _valid.redeemCollateralFromSusd(f.collateralAmount, f.debt, priceUpdateData, {
    value: res,
    gasLimit: 1_000_000
  })
  console.log(e.hash);
}
clear
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





