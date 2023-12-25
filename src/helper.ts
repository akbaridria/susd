"use client";

import type { IAccountSubMenu } from "@/types";
import { ArrowDiagonalSquare, ArrowSquare } from "./components/Icons";
import {
  SUSDValidator__factory,
  SUSD__factory,
  SUSDStabilityPool__factory,
  IPyth__factory,
} from "../protocol-contract/typechain-types";
import dataNetwork from "../protocol-contract/datas.json";
import { fetchBalance, prepareWriteContract, readContract } from "@wagmi/core";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

const connection = new EvmPriceServiceConnection("https://hermes.pyth.network");

export const listSubMenuAccount = (): IAccountSubMenu[] => {
  return [
    {
      name: "View In Explorer",
      icon: ArrowDiagonalSquare({ customClass: "w-4 h-4 stroke-base-content" }),
    },
    {
      name: "Disconnect",
      icon: ArrowSquare({
        customClass: "w-4 h-4 stroke-base-content rotate-[180deg]",
      }),
    },
  ];
};

export const trimWallet = (v: string) => {
  return v.slice(0, 5) + "..." + v.slice(-5);
};

export const formatCurrency = (v: number) => {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(Number(v));
};

export const formatNumber = (v: number) => {
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 18,
  }).format(Number(v));
};

export const getTVL = async (): Promise<number> => {
  const res = await fetchBalance({
    address: dataNetwork.susd_validator as `0x${string}`,
  });
  const s = await connection.getLatestPriceFeeds([dataNetwork.priceID]);
  const price = !!s ? s[0].getEmaPriceNoOlderThan(60) : undefined;
  const a = !!price ? price.price : 0;
  return (Number(a) / 10 ** 8) * Number(res.formatted);
};

export const getTotalSupply = async () =>
  readContract({
    abi: SUSD__factory.abi,
    address: dataNetwork.susd as `0x${string}`,
    functionName: "totalSupply",
  });

export const getTomoBalance = async (addr: string) =>
  await fetchBalance({
    address: addr as `0x${string}`,
  });

export const getTomoPrice = async (): Promise<number> => {
  const s = await connection.getLatestPriceFeeds([dataNetwork.priceID]);
  const price = !!s ? s[0].getEmaPriceNoOlderThan(60) : undefined;
  const a = !!price ? price.price : 0;
  return Number(a) / 10 ** 8;
};

export const getUpdateDataAndFee = async () => {
  const priceData = await connection.getPriceFeedsUpdateData([
    dataNetwork.priceID,
  ]);
  const fee = await readContract({
    abi: IPyth__factory.abi,
    address: dataNetwork.pyth_address as `0x${string}`,
    functionName: "getUpdateFee",
    args: [priceData as `0x${string}`[]],
  });
  return {
    priceData,
    fee,
  };
};

export const prepareBorrow = async (
  amount: number,
  amountCollateral: number
) => {
  const datafee = await getUpdateDataAndFee();
  return await prepareWriteContract({
    abi: SUSDValidator__factory.abi,
    address: dataNetwork.susd_validator as `0x${string}`,
    functionName: "mint",
    args: [BigInt(amount), datafee.priceData as `0x${string}`[]],
    value: datafee.fee + BigInt(amountCollateral),
  });
};

export const getSusdBorrowed = async (addr: string) => {
  const d = await readContract({
    abi: SUSDValidator__factory.abi,
    address: dataNetwork.susd_validator as `0x${string}`,
    functionName: "anchores",
    args: [addr as `0x${string}`],
  });

  const e = await getTomoPrice();

  const borrow = d[2];
  const borrowFormatted = formatCurrency(Number(d[2]) / 10 ** 18);
  const collateral = d[3];
  const collateralFormatted = formatCurrency((Number(d[3]) / 10 ** 18) * e);

  return {
    borrow,
    borrowFormatted,
    collateral,
    collateralFormatted,
  };
};

export const getMaxAmountRedeemable = async (addr: string) => {
  const d = await readContract({
    abi: SUSDValidator__factory.abi,
    address: dataNetwork.susd_validator as `0x${string}`,
    functionName: "anchores",
    args: [addr as `0x${string}`],
  });

  const e = await getTomoPrice();
  const borrow = Number(d[2]) / 10 ** 18;

  const x = borrow / (e * 0.75);
  return x;
};

export const prepareRedeem = async (amount: number) => {
  const priceData = await getUpdateDataAndFee();

  const e = await prepareWriteContract({
    abi: SUSDValidator__factory.abi,
    address: dataNetwork.susd_validator as `0x${string}`,
    functionName: "redeemCollateral",
    args: [BigInt(amount * 10 ** 18), priceData.priceData as `0x${string}`[]],
    value: priceData.fee,
  });

  return e;
};

export const getTotalSUSDAnchor = async (addr: string) => {
  const d = await readContract({
    abi: SUSDValidator__factory.abi,
    address: dataNetwork.susd_validator as `0x${string}`,
    functionName: "anchores",
    args: [addr as `0x${string}`],
  });
  return d[2];
};

export const getBalanceSUSDUser = async (addr: string) => {
  const e = await readContract({
    abi: SUSD__factory.abi,
    address: dataNetwork.susd as `0x${string}`,
    functionName: "balanceOf",
    args: [addr as `0x${string}`],
  });

  return e;
};

export const getAllowanceValidator = async (addr: string) =>
  await readContract({
    abi: SUSD__factory.abi,
    address: dataNetwork.susd as `0x${string}`,
    functionName: "allowance",
    args: [addr as `0x${string}`, dataNetwork.susd_validator as `0x${string}`],
  });

export const approveSusdValidator = async (amount: bigint) =>
  await prepareWriteContract({
    abi: SUSD__factory.abi,
    address: dataNetwork.susd as `0x${string}`,
    functionName: "approve",
    args: [dataNetwork.susd_validator as `0x${string}`, amount],
  });

export const repayValidator = async (amount: bigint) => {
  return await prepareWriteContract({
    abi: SUSDValidator__factory.abi,
    address: dataNetwork.susd_validator as `0x${string}`,
    functionName: "burnSusd",
    args: [amount],
  });
};

export const prepareAddCollateral = async (amount: bigint) => {
  const priceData = await getUpdateDataAndFee();
  return await prepareWriteContract({
    abi: SUSDValidator__factory.abi,
    address: dataNetwork.susd_validator as `0x${string}`,
    functionName: "addCollateral",
    args: [amount, priceData.priceData as `0x${string}`[]],
    value: priceData.fee + amount,
  });
};

export const getTvlStabilityPool = async () =>
  await readContract({
    abi: SUSD__factory.abi,
    address: dataNetwork.susd as `0x${string}`,
    functionName: "balanceOf",
    args: [dataNetwork.susd_stability as `0x${string}`],
  });

export const getTOMOStability = async () => {
  const d = await fetchBalance({
    address: dataNetwork.susd_stability as `0x${string}`,
  });
  return d;
};

export const getLatestTrackID = async () =>
  await readContract({
    abi: SUSDStabilityPool__factory.abi,
    address: dataNetwork.susd_stability as `0x${string}`,
    functionName: "tracker",
  });

export const getAllowanceStability = async (addr: string) =>
  await readContract({
    abi: SUSD__factory.abi,
    address: dataNetwork.susd as `0x${string}`,
    functionName: "allowance",
    args: [addr as `0x${string}`, dataNetwork.susd_stability as `0x${string}`],
  });

export const approveSUSDStability = async (amount: bigint) =>
  await prepareWriteContract({
    abi: SUSD__factory.abi,
    address: dataNetwork.susd as `0x${string}`,
    functionName: "approve",
    args: [dataNetwork.susd_stability as `0x${string}`, amount],
  });

export const depositToStability = async (amount: bigint) =>
  await prepareWriteContract({
    abi: SUSDStabilityPool__factory.abi,
    address: dataNetwork.susd_stability as `0x${string}`,
    functionName: "deposit",
    args: [amount],
  });

export const getUserInfo = async (addr: string) =>
  await readContract({
    abi: SUSDStabilityPool__factory.abi,
    address: dataNetwork.susd_stability as `0x${string}`,
    functionName: "getUserInfo",
    args: [addr as `0x${string}`],
  });

export const getDetailTrack = async (id: bigint) => {
  return await readContract({
    abi: SUSDStabilityPool__factory.abi,
    address: dataNetwork.susd_stability as `0x${string}`,
    functionName: "protectors",
    args: [id],
  });
};

export const handleWithdraw = async (id: bigint) => await prepareWriteContract({
  abi: SUSDStabilityPool__factory.abi,
  address: dataNetwork.susd_stability as `0x${string}`,
  functionName: 'withdraw',
  args: [id]
})