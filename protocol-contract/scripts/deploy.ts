import { ethers, network } from "hardhat";
import datas from "../datas.json";

async function main() {
  // 1. deploy susd
  // const susd = await ethers.deployContract("SUSD", ["0x694aCF4DFb7601F92A0D2a41cdEC5bf7726C7294"], {
  //   gasLimit: 80_000_000
  // });
  // await susd.waitForDeployment();
  // console.log("susd deployed at : ", susd.target);

  // 2. deploy validator
  // const validator = await ethers.deployContract("SUSDValidator", [datas.susd, datas.pyth_address], {
  //   gasLimit: 80_000_000
  // })
  // await validator.waitForDeployment()
  // console.log("validator deployed at:", validator.target)

  // 3. deploy stability
  const stability = await ethers.deployContract("SUSDStabilityPool", [datas.susd, datas.susd_validator], {
    gasLimit: 80_000_000
  })
  await stability.waitForDeployment()
  console.log("stability pool deployed at", stability.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
