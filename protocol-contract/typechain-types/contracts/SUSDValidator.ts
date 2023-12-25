/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface SUSDValidatorInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addCollateral"
      | "anchores"
      | "burnSusd"
      | "calculateHealthFactor"
      | "liquidate"
      | "mint"
      | "owner"
      | "redeemCollateral"
      | "renounceOwnership"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Liquidation"
      | "MintedSusd"
      | "OwnershipTransferred"
      | "RedeemCollateral"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addCollateral",
    values: [BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "anchores",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "burnSusd",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateHealthFactor",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "liquidate",
    values: [AddressLike, BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeemCollateral",
    values: [BigNumberish, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "addCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "anchores", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burnSusd", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "calculateHealthFactor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "liquidate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "redeemCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace LiquidationEvent {
  export type InputTuple = [
    _liquidator: AddressLike,
    _user: AddressLike,
    _debtAmount: BigNumberish,
    _collateralAmount: BigNumberish
  ];
  export type OutputTuple = [
    _liquidator: string,
    _user: string,
    _debtAmount: bigint,
    _collateralAmount: bigint
  ];
  export interface OutputObject {
    _liquidator: string;
    _user: string;
    _debtAmount: bigint;
    _collateralAmount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MintedSusdEvent {
  export type InputTuple = [_user: AddressLike, _amountMinted: BigNumberish];
  export type OutputTuple = [_user: string, _amountMinted: bigint];
  export interface OutputObject {
    _user: string;
    _amountMinted: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RedeemCollateralEvent {
  export type InputTuple = [
    _user: AddressLike,
    _amountCollateral: BigNumberish,
    _amountBurnSusd: BigNumberish
  ];
  export type OutputTuple = [
    _user: string,
    _amountCollateral: bigint,
    _amountBurnSusd: bigint
  ];
  export interface OutputObject {
    _user: string;
    _amountCollateral: bigint;
    _amountBurnSusd: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SUSDValidator extends BaseContract {
  connect(runner?: ContractRunner | null): SUSDValidator;
  waitForDeployment(): Promise<this>;

  interface: SUSDValidatorInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addCollateral: TypedContractMethod<
    [_amountCollateral: BigNumberish, _priceUpdateData: BytesLike[]],
    [void],
    "payable"
  >;

  anchores: TypedContractMethod<
    [arg0: AddressLike],
    [
      [boolean, string, bigint, bigint] & {
        isExist: boolean;
        user: string;
        debt: bigint;
        collateralAmount: bigint;
      }
    ],
    "view"
  >;

  burnSusd: TypedContractMethod<
    [_amountSusd: BigNumberish],
    [void],
    "nonpayable"
  >;

  calculateHealthFactor: TypedContractMethod<
    [_user: AddressLike, _price: BigNumberish],
    [bigint],
    "view"
  >;

  liquidate: TypedContractMethod<
    [_user: AddressLike, _amount: BigNumberish, _priceUpdateData: BytesLike[]],
    [[boolean, bigint]],
    "payable"
  >;

  mint: TypedContractMethod<
    [_mintAmount: BigNumberish, _priceUpdateData: BytesLike[]],
    [void],
    "payable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  redeemCollateral: TypedContractMethod<
    [_amountCollateral: BigNumberish, _priceUpdateData: BytesLike[]],
    [void],
    "payable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addCollateral"
  ): TypedContractMethod<
    [_amountCollateral: BigNumberish, _priceUpdateData: BytesLike[]],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "anchores"
  ): TypedContractMethod<
    [arg0: AddressLike],
    [
      [boolean, string, bigint, bigint] & {
        isExist: boolean;
        user: string;
        debt: bigint;
        collateralAmount: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "burnSusd"
  ): TypedContractMethod<[_amountSusd: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "calculateHealthFactor"
  ): TypedContractMethod<
    [_user: AddressLike, _price: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "liquidate"
  ): TypedContractMethod<
    [_user: AddressLike, _amount: BigNumberish, _priceUpdateData: BytesLike[]],
    [[boolean, bigint]],
    "payable"
  >;
  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<
    [_mintAmount: BigNumberish, _priceUpdateData: BytesLike[]],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "redeemCollateral"
  ): TypedContractMethod<
    [_amountCollateral: BigNumberish, _priceUpdateData: BytesLike[]],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "Liquidation"
  ): TypedContractEvent<
    LiquidationEvent.InputTuple,
    LiquidationEvent.OutputTuple,
    LiquidationEvent.OutputObject
  >;
  getEvent(
    key: "MintedSusd"
  ): TypedContractEvent<
    MintedSusdEvent.InputTuple,
    MintedSusdEvent.OutputTuple,
    MintedSusdEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "RedeemCollateral"
  ): TypedContractEvent<
    RedeemCollateralEvent.InputTuple,
    RedeemCollateralEvent.OutputTuple,
    RedeemCollateralEvent.OutputObject
  >;

  filters: {
    "Liquidation(address,address,uint256,uint256)": TypedContractEvent<
      LiquidationEvent.InputTuple,
      LiquidationEvent.OutputTuple,
      LiquidationEvent.OutputObject
    >;
    Liquidation: TypedContractEvent<
      LiquidationEvent.InputTuple,
      LiquidationEvent.OutputTuple,
      LiquidationEvent.OutputObject
    >;

    "MintedSusd(address,uint256)": TypedContractEvent<
      MintedSusdEvent.InputTuple,
      MintedSusdEvent.OutputTuple,
      MintedSusdEvent.OutputObject
    >;
    MintedSusd: TypedContractEvent<
      MintedSusdEvent.InputTuple,
      MintedSusdEvent.OutputTuple,
      MintedSusdEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "RedeemCollateral(address,uint256,uint256)": TypedContractEvent<
      RedeemCollateralEvent.InputTuple,
      RedeemCollateralEvent.OutputTuple,
      RedeemCollateralEvent.OutputObject
    >;
    RedeemCollateral: TypedContractEvent<
      RedeemCollateralEvent.InputTuple,
      RedeemCollateralEvent.OutputTuple,
      RedeemCollateralEvent.OutputObject
    >;
  };
}
