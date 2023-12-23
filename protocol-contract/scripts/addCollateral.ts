import { ethers } from "hardhat";
import datas from "../datas.json";
import { IPyth__factory, SUSDStabilityPool__factory, SUSDValidator__factory, SUSD__factory } from "../typechain-types";
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { clear } from "console";

async function main() {
  const [addr, addr1] = await ethers.getSigners();
  const provider = new ethers.JsonRpcProvider(datas.rpc);
  const e = await ethers.getContractFactory("SUSDStabilityPool");
  const _susd = await ethers.getContractFactory("SUSD");
  const d = SUSDStabilityPool__factory.connect(datas.susd_stability, e.runner)
  const susd = SUSD__factory.connect(datas.susd, _susd.runner);
  const approve = await susd.approve(datas.susd_stability, ethers.parseEther("100"), {
    gasLimit: 1_000_000,
    nonce: await provider.getTransactionCount(addr.address)
  });
  await approve.wait()
  console.log(approve.hash)
  const f = await d.deposit(ethers.parseEther("100"), {
    gasLimit: 1_000_000,
    nonce: await provider.getTransactionCount(addr.address)
  });
  await f.wait()
  console.log(f.hash)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





