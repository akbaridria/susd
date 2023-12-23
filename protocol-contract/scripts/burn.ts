import { ethers } from "hardhat";
import datas from "../datas.json";
import { IPyth__factory, SUSDValidator__factory, SUSD__factory } from "../typechain-types";
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { clear } from "console";

async function main() {
  const provider = new ethers.JsonRpcProvider(datas.rpc)
  const [addr, addr1] = await ethers.getSigners();
  const d = IPyth__factory.connect(datas.pyth_address, provider);
  const connection = new EvmPriceServiceConnection(datas.hermes);
  const priceUpdateData = await connection.getPriceFeedsUpdateData([datas.priceID]);
  const res = await d.getUpdateFee(priceUpdateData);
  const valid = await ethers.getContractFactory("SUSDValidator")
  const _valid = SUSDValidator__factory.connect(datas.susd_validator, valid.runner);
  const susd = await ethers.getContractFactory("SUSD");
  const _susd = SUSD__factory.connect(datas.susd, susd.runner)
  const e = await _susd.approve(datas.susd_validator, ethers.parseEther("0.05"), {
    gasLimit: 3_000_000,
    nonce: await provider.getTransactionCount(addr.address)
  })
  await e.wait()
  console.log(e.hash);
  const g = await _valid.burnSusd(ethers.parseEther("0.05"), priceUpdateData, {
    gasLimit: 3_000_000,
    nonce: await provider.getTransactionCount(addr.address)
  })
  await g.wait()
  console.log(g.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





