import Link from "next/link";


export default function Home() {
  return (
    <main className="h-screen">
      <section className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-[80vh] max-h-[800px]">
          <div className="grid grid-cols-1 gap-4 my-4">
            <div className="text-center">
              <div className="brightness-150 text-[2rem] md:text-[3.625rem]  font-bold max-w-full w-[800px] mx-auto leading-tight">
                Decentralized Stablecoin with Robust Collateral Backing
              </div>
              <div className="max-w-full w-[800px] mx-auto mt-8 text-md md:text-base">
                SolidSafe redefines the DeFi landscape with an innovative approach to stablecoins, blending user-friendly accessibility with robust security measures. Imagine a realm where generating <span className="text-primary">$SUSD</span> tokens involves leveraging your <span className="text-success">$TOMO</span> without the intricate complexities of borrowing interests.
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Link href="/explore">
                <button className="btn btn-primary btn-sm">Launch App</button>
              </Link>

              <a href="https://github.com/akbaridria/cryptoshield#readme" target="_blank" rel="noopener noreferrer">
                <button className="btn btn-link">Read more</button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
