'use client'
import { Spinner } from '@/components/Icons'
import { getTVL, getTotalSupply, formatCurrency, getTomoBalance, getTomoPrice, formatNumber, prepareBorrow } from '@/helper'
import { FetchBalanceResult, waitForTransaction, writeContract } from '@wagmi/core'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useDispatch } from 'react-redux'
import { setShow, setTx } from '@/lib/features/toast/toastReducer'

export default function Borrow() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const dispatch = useDispatch()

  const [tvl, setTvl] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0')
  const [loading, setLoading] = useState<{ loadingAll: boolean, loadingBalance: boolean, loadingTx: boolean }>({
    loadingAll: false,
    loadingBalance: false,
    loadingTx: false
  })
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [errorForm, setErrorForm] = useState<{ error: boolean, message: string }>({ error: false, message: '' });
  const [form, setForm] = useState<{ collateral: string, borrow: string }>({
    collateral: '',
    borrow: ''
  })
  const [balanceUser, setBalanceUser] = useState<FetchBalanceResult>({
    decimals: 18,
    formatted: '0',
    symbol: 'TOMO',
    value: BigInt(0)
  });
  const [tomoPrice, setTomoPrice] = useState(0)


  useEffect(() => {
    const intervalId = setInterval(async () => {
      setTomoPrice(await getTomoPrice())
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const getAllData = async () => {
      try {
        setLoading({ ...loading, loadingAll: true })
        await Promise.all([getTVL(), getTotalSupply(), getTomoPrice()]).then((values) => {
          setTvl(formatCurrency(values[0]))
          setTotalSupply(formatCurrency(Number(values[1]) / (10 ** 18)))
          setTomoPrice(values[2])
        })
        setLoading({ ...loading, loadingAll: false })
      } catch (error) {

      }
    }
    getAllData()
  }, [loading.loadingTx])

  useEffect(() => {
    const getData = async () => {
      if (!!address) {
        try {
          setLoading({ ...loading, loadingBalance: true })
          const e = await getTomoBalance(address)
          setBalanceUser(e)
          setLoading({ ...loading, loadingBalance: false })
        } catch (error) {

        }
      }
    }

    getData()
  }, [address])

  useEffect(() => {
    if (isConnected && (!!chain ? !chain?.unsupported : false)) {
      setIsFormDisabled(false)
      return
    }
    setIsFormDisabled(true)
    return
  }, [chain, isConnected])

  useEffect(() => {
    if (!isConnected) {
      setErrorForm({ error: true, message: 'Wallet Not Connected' })
      return
    }
    if (chain?.unsupported) {
      setErrorForm({ error: true, message: 'Wrong network' })
      return
    }
    if (form.collateral === '' || form.collateral === '0') {
      setErrorForm({ error: true, message: '' });
      return
    }

    if (Number(form.collateral) > Number(balanceUser.formatted)) {
      setErrorForm({ error: true, message: 'Insufficient Balance' })
      return
    }

    if (form.borrow === '' || form.borrow === '0') {
      setErrorForm({ error: true, message: '' });
      return
    }

    if (Number(form.borrow) > (tomoPrice * Number(form.collateral)) * 0.75) {
      setErrorForm({ error: true, message: 'Exceed the mint limit or increase the collateral' });
      return
    }

    setErrorForm({ error: false, message: '' })
    return
  }, [balanceUser.formatted, chain?.unsupported, form.borrow, form.collateral, isConnected])

  const handleInputAmount = (v: string) => {
    let filteredValue = v.replace(/[^0-9.]/g, '');
    let dotCount = (filteredValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      filteredValue = filteredValue.replace(/\./g, (match, index) => index === filteredValue.indexOf('.') ? '.' : '');
    }
    setForm({ ...form, collateral: filteredValue })
  }

  const handleInputBorrow = (v: string) => {
    let filteredValue = v.replace(/[^0-9.]/g, '');
    let dotCount = (filteredValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      filteredValue = filteredValue.replace(/\./g, (match, index) => index === filteredValue.indexOf('.') ? '.' : '');
    }
    setForm({ ...form, borrow: filteredValue })
  }

  const handleSubmit = async () => {
    try {
      setLoading({ ...loading, loadingTx: true })
      const { request } = await prepareBorrow(Number(form.borrow) * (10 ** 18), Number(form.collateral) * (10 ** 18))
      const { hash } = await writeContract(request)
      const { transactionHash } = await waitForTransaction({
        hash: hash
      })
      setLoading({ ...loading, loadingTx: false })
      setForm({ collateral: '', borrow: ''});
      dispatch(setShow(true));
      dispatch(setTx(transactionHash));
    } catch (error) {
      setLoading({ ...loading, loadingTx: false })
    }
  }

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
              <div className="stat-value">${tvl}</div>
              <div className="stat-desc">Total collateral</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total SUSD</div>
              <div className="stat-value">{totalSupply}</div>
              <div className="stat-desc">Total supply</div>
            </div>
            <div className="stat">
              <div className="stat-title">Borrow Interest</div>
              <div className="stat-value">0%</div>
              <div className="stat-desc"></div>
            </div>
            <div className="stat">
              <div className="stat-title">TOMO/VIC Price</div>
              <div className="stat-value">${tomoPrice}</div>
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
              <input type="text" placeholder="0.0" className="input input-md focus:outline-none input-bordered w-full" value={form.collateral} disabled={isFormDisabled || loading.loadingTx} onChange={(e) => handleInputAmount(e.target.value)} />
            </label>
            <div className="flex items-center justify-between text-xs">
              <div><span className="opacity-[0.5]">Availbale TOMO: </span> <span>{loading.loadingBalance ? 'loading...' : balanceUser.formatted}</span></div>
              <div className="flex items-center gap-2 text-sm">
                <button className="btn btn-xs btn-primary" disabled={isFormDisabled || loading.loadingTx} onClick={() => setForm({ ...form, collateral: new Intl.NumberFormat('en', { minimumFractionDigits: 0, maximumFractionDigits: 18 }).format(Number(balanceUser.formatted) / 2) })}>50%</button>
                <button className="btn btn-xs btn-primary" disabled={isFormDisabled || loading.loadingTx} onClick={() => setForm({ ...form, collateral: balanceUser.formatted })}>Max</button>
              </div>
            </div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Borrow</span>
                <span className="label-text-alt"></span>
              </div>
              <input type="text" placeholder="0.0" className="input input-md focus:outline-none input-bordered w-full" value={form.borrow} disabled={isFormDisabled || loading.loadingTx} onChange={(e) => handleInputBorrow(e.target.value)} />
            </label>
            <div className="flex items-center justify-end text-xs">
              <div className="flex items-center gap-2 text-sm">
                <button className="btn btn-xs btn-primary" disabled={isFormDisabled || loading.loadingTx} onClick={() => setForm({ ...form, borrow: formatNumber(tomoPrice * Number(form.collateral) * 0.25) })}>25%</button>
                <button className="btn btn-xs btn-primary" disabled={isFormDisabled || loading.loadingTx} onClick={() => setForm({ ...form, borrow: formatNumber(tomoPrice * Number(form.collateral) * 0.50) })}>50%</button>
                <button className="btn btn-xs btn-primary" disabled={isFormDisabled || loading.loadingTx} onClick={() => setForm({ ...form, borrow: formatNumber(tomoPrice * Number(form.collateral) * 0.75) })}>max</button>
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
                <div className="opacity-[0.5]">Minting Fee</div>
                <div>0%</div>
              </div>
            </div>
            <button className="btn btn-primary btn-md text-base w-full" onClick={() => handleSubmit()} disabled={isFormDisabled || errorForm.error || loading.loadingTx}>
              {loading.loadingTx && <Spinner customClass='w-4 h-4 opacity-[0.5]' />}
              Borrow
            </button>
            {errorForm.error && <div className='text-center text-sm text-red-600'>{errorForm.message}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}