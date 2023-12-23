export default function Borrow() {
  return (
    <div className="max-w-[800px] mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div className="text-2xl text-center font-bold">
          Borrow SUSD
        </div>
        <div className="w-full my-10">
          <div className="stats stats-vertical lg:stats-horizontal w-full">
            <div className="stat">
              <div className="stat-title">TVL</div>
              <div className="stat-value">$ 15M</div>
              <div className="stat-desc">Total collateral</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total SUSD</div>
              <div className="stat-value">13M</div>
              <div className="stat-desc">Total supply</div>
            </div>
            <div className="stat">
              <div className="stat-title">Borrow Interest</div>
              <div className="stat-value">0%</div>
              <div className="stat-desc"></div>
            </div>
            <div className="stat">
              <div className="stat-title">Minting Fee</div>
              <div className="stat-value">0%</div>
              <div className="stat-desc"></div>
            </div>
          </div>
        </div>
        <div className="border-[1px] border-[#cdcdcd33] bg-base-200 shadow p-5 w-[500px] max-w-full mx-auto rounded-box">
          <div className="grid grid-cols-1 gap-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Deposit Collateral</span>
                <span className="label-text-alt"></span>
              </div>
              <input type="text" placeholder="0.0" className="input input-md focus:outline-none input-bordered w-full" />
            </label>
            <div className="flex items-center justify-between text-xs">
              <div><span className="opacity-[0.5]">Availbale TOMO: </span> <span>1,000</span></div>
              <div className="flex items-center gap-2 text-sm">
                <button className="btn btn-xs btn-primary">50%</button>
                <button className="btn btn-xs btn-primary">Max</button>
              </div>
            </div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Borrow</span>
                <span className="label-text-alt"></span>
              </div>
              <input type="text" placeholder="0.0" className="input input-md focus:outline-none input-bordered w-full" />
            </label>
            <div className="flex items-center justify-end text-xs">
              <div className="flex items-center gap-2 text-sm">
                <button className="btn btn-xs btn-primary">25%</button>
                <button className="btn btn-xs btn-primary">50%</button>
                <button className="btn btn-xs btn-primary">75%</button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="opacity-[0.5]">Max Loan To Value (LTV)</div>
                <div>75%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="opacity-[0.5]">Liquidation Threshold</div>
                <div>80%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="opacity-[0.5]">Borrow Interest</div>
                <div>0%</div>
              </div>
            </div>
            <button className="btn btn-primary btn-md text-base w-full">Borrow</button>
          </div>
        </div>
      </div>
    </div>
  )
}