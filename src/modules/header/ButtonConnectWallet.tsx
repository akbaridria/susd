'use client'

import { Chevron } from "@/components/Icons";
import { useConnect } from "wagmi";

export const ButtonConnectWallet = () => {
  const { connect, connectors, isLoading } = useConnect();

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-primary btn-sm">
        <div>Connect Wallet</div>
        <Chevron customClass="w-4 h-4 rotate-[90deg]" />
      </button>
      <ul tabIndex={0} className="dropdown-content z-[1] mt-3 menu p-2 shadow bg-base-100 rounded-box w-52">
      {
          connectors.map((connector) => {
            return (
              <li key={`account-sub-menu-${connector.id}`}>
                <button disabled={isLoading} onClick={() => connect({ connector })} className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <img src={`images/${connector.id}.svg`} alt="" className={`w-4 h-4 ${connector.id === 'coinbaseWallet' ? 'rounded-full' : null}`} />
                    {connector.name}
                  </div>
                </button>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default ButtonConnectWallet;