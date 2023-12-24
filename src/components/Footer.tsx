'use client'

import { usePathname } from "next/navigation";
import Logo from "./Logo";

export const Footer = () => {
  const pathname = usePathname()
  if(pathname === '/') {
    return
  }
  return (
    <footer className="footer footer-center p-5 bg-primary text-primary-content">
      <aside>
        <Logo />
        <p className="font-bold">Decentralized Stablecoin with <br /> Robust Collateral Backing</p>
        <p>Copyright © 2023 - All right reserved</p>
      </aside>
    </footer>
  )
}

export default Footer;