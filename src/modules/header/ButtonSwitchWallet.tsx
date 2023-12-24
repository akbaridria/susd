'use client'
import { useNetwork, useSwitchNetwork } from "wagmi";

export const ButtonSwitchWallet = () => {
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  return (
    <>
    {chains.map((x) => (
      <button
        disabled={!switchNetwork || x.id === chain?.id}
        key={x.id}
        onClick={() => switchNetwork?.(x.id)}
        className="btn btn-error btn-sm"
      >
        Switch To Tomo Testnet
        {isLoading && pendingChainId === x.id && ' (switching)'}
      </button>
    ))}
    </>
  )
}