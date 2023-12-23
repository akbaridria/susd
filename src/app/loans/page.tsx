'use client'

import { useState } from "react";

export default function Loans() {
  const tabs = ['Redeem', 'Repay', 'Add Collateral'];

  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <div className="max-w-[800px] mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 gap-4">
        <div className="text-2xl font-bold">
          Loans
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-200 shadow p-4 rounded-box border-[1px] border-[#cdcdcd33]">
            <div className="text-lg opacity-[0.5] font-semibold">SUSD Borrowed</div>
            <div className="text-xl font-bold">1.000,00</div>
          </div>
          <div className="bg-base-200 shadow p-4 rounded-box border-[1px] border-[#cdcdcd33]">
            <div className="text-lg opacity-[0.5] font-semibold">Collateral Deposited</div>
            <div className="text-xl font-bold">1.000,00</div>
          </div>
        </div>

        <div className="flex justify-center mt-8 mb-5">
          <div className="join join-horizontal">
            <button className="btn btn-sm btn-primary join-item">Redeem</button>
            <button className="btn btn-sm join-item">Repay</button>
            <button className="btn btn-sm join-item">Add Collateral</button>
          </div>
        </div>

        <Redeem />
      </div>
    </div>
  )
}

const Redeem = () => {
  return (
    <div className="w-[400px] max-w-full mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Redeem TOMO</span>
            <span className="label-text-alt"></span>
          </div>
          <input type="text" placeholder="0.0" className="input input-md focus:outline-none input-bordered w-full" />
        </label>
        <div className="flex items-center justify-end text-xs -mt-2">
          <div className="flex items-center gap-2 text-sm">
            <button className="btn btn-xs btn-primary">25%</button>
            <button className="btn btn-xs btn-primary">50%</button>
            <button className="btn btn-xs btn-primary">75%</button>
          </div>
        </div>
        <button className="btn btn-primary text-base w-full">Redeem</button>
      </div>
    </div>
  )
}

const Repay = () => {
  return (
    <div>oke gan disini</div>
  )
}

const AddCollateral = () => {
  return (
    <div>oke gan disini</div>
  )
}