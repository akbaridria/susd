'use client'

import { Blockies } from "@/components/Blockies";
import { Chevron } from "@/components/Icons";
import { listSubMenuAccount, trimWallet } from "@/helper";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

export const ButtonAccount = () => {
  const { address } = useAccount()
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const handleClick = (idx: number) => {
    if (idx === 0) window.open(chain?.blockExplorers?.default.url as string + '/address/' + address, '_blank');
    if (idx === 1) disconnect();
  }
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-outline btn-sm">
        <Blockies address="0x694aCF4DFb7601F92A0D2a41cdEC5bf7726C7294" customClass="w-4 h-4 rounded-full" />
        <div>{trimWallet(address as string)}</div>
        <Chevron customClass="w-4 h-4 rotate-[90deg]" />
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 mt-3 shadow bg-base-100 rounded-box w-52">
        {
          listSubMenuAccount().map((item, index) => {
            return (
              <li key={`account-sub-menu-${index}`}>
                <button className="flex flex-row items-center gap-2" onClick={() => handleClick(index)}>
                  {item.icon}
                  {item.name}
                </button>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default ButtonAccount;