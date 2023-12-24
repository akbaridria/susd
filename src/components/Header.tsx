'use client'

import Link from "next/link";
import Logo from "./Logo";
import data from "@/data.json";
import { usePathname } from "next/navigation";
import { Arrow } from "./Icons";
import ButtonAccount from "@/modules/header/ButtonAccount";
import ButtonConnectWallet from "@/modules/header/ButtonConnectWallet";
import { ButtonSwitchWallet } from "@/modules/header/ButtonSwitchWallet";
import { useAccount, useNetwork } from 'wagmi'
export const Header = () => {
  const pathname = usePathname()
  
  const { isConnected} = useAccount()
  const { chain } = useNetwork()

  return (
    <div className="sticky top-0 z-[100]">
      <div className="container mx-auto">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                {data.menus.map((item) => {
                  return (
                    <li key={item.path} className={`${pathname === item.path ? 'bg-primary rounded-box' : ''}`}><Link href={item.path}>{item.title}</Link></li>
                  )
                })}
              </ul>
            </div>
            <Link href="/" className="btn btn-ghost">
              <Logo />
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              {data.menus.map((item) => {
                return (
                  <li key={item.path} className={`${pathname === item.path ? 'bg-primary rounded-box' : ''}`}><Link href={item.path}>{item.title}</Link></li>
                )
              })}
              <li>
                <a href="https://faucet.testnet.tomochain.com/" target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center gap-1">
                    <div>Tomo Faucet</div>
                    <Arrow customClass="w-4 h-4 rotate-[315deg]" />
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            {chain?.unsupported && <ButtonSwitchWallet />}
            {!isConnected && <ButtonConnectWallet />}
            {isConnected && !chain?.unsupported && <ButtonAccount />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;