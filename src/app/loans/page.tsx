'use client'

import { approveSusdValidator, formatNumber, getAllowanceValidator, getBalanceSUSDUser, getMaxAmountRedeemable, getSusdBorrowed, getTomoBalance, getTotalSUSDAnchor, prepareAddCollateral, prepareRedeem, repayValidator } from "@/helper";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useDispatch } from "react-redux";
import { setShow, setTx } from "@/lib/features/toast/toastReducer";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { Spinner } from "@/components/Icons";

export default function Loans() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork()

  const [borrow, setBorrow] = useState<{ formatted: string, value: bigint }>({ formatted: '0', value: BigInt(0) });
  const [collateral, setCollateral] = useState<{ formatted: string, value: bigint }>({ formatted: '0', value: BigInt(0) });

  const tabs = ['Redeem', 'Repay', 'Add Collateral'];
  const [activeTab, setActiveTab] = useState(tabs[0])

  useEffect(() => {
    const getData = async () => {
      if (!!address) {
        const e = await getSusdBorrowed(address)
        setBorrow({ formatted: e.borrowFormatted, value: e.borrow });
        setCollateral({ formatted: e.collateralFormatted, value: e.collateral })
      }
    }
    getData()
    const intervalId = setInterval(() => {
      getData()
    }, 10000)

    return () => clearInterval(intervalId);
  }, [address])

  return (
    <div className="max-w-[800px] mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 gap-4">
        <div className="text-2xl font-bold">
          Loans
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-200 shadow p-4 rounded-box border-[1px] border-[#cdcdcd33]">
            <div className="text-base opacity-[0.5] font-semibold">SUSD Borrowed</div>
            <div className="text-2xl font-bold">{borrow.formatted}</div>
          </div>
          <div className="bg-base-200 shadow p-4 rounded-box border-[1px] border-[#cdcdcd33]">
            <div className="text-base opacity-[0.5] font-semibold">Collateral Deposited</div>
            <div className="text-2xl font-bold">${collateral.formatted}</div>
          </div>
        </div>
        {(!isConnected) && <div className="text-center text-red-600">Wallet not connected</div>}
        {chain?.unsupported && <div className="text-center text-red-600">Wrong Network</div>}
        {
          (isConnected && !chain?.unsupported) && <div className="flex justify-center mt-8 mb-5">
            <div className="join join-horizontal">
              {tabs.map((item) => {
                return (
                  <button key={item} className={`btn btn-sm ${activeTab === item && 'btn-primary'} join-item`} onClick={() => setActiveTab(item)}>{item}</button>
                )
              })}
            </div>
          </div>
        }

        {(activeTab === 'Redeem' && isConnected && !chain?.unsupported) && <Redeem />}
        {(activeTab === 'Repay' && isConnected && !chain?.unsupported) && <Repay />}
        {(activeTab === 'Add Collateral' && isConnected && !chain?.unsupported) && <AddCollateral />}
      </div>
    </div>
  )
}

const Redeem = () => {
  const { address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [errorForm, setErrorForm] = useState<{ error: boolean, message: string }>({ error: false, message: '' })
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      if (!!address) {
        try {
          setLoading(true)
          const e = await getMaxAmountRedeemable(address)
          setBalance(e);
          setLoading(false)
        } catch (error) {
          setLoading(false)
        }
      }
    }

    getData()
  }, [address])

  useEffect(() => {
    if (amount === '' || amount === '0') {
      setErrorForm({ error: true, message: '' })
      return;
    }
    if (Number(amount) > balance) {
      setErrorForm({ error: true, message: 'Exceeds the maximum amount of $TOMO' })
      return;
    }
    setErrorForm({ error: false, message: '' })
    return
  }, [amount, balance])

  const handleInputAmount = (v: string) => {
    let filteredValue = v.replace(/[^0-9.]/g, '');
    let dotCount = (filteredValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      filteredValue = filteredValue.replace(/\./g, (match, index) => index === filteredValue.indexOf('.') ? '.' : '');
    }
    setAmount(filteredValue);
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const { request } = await prepareRedeem(Number(amount))
      const { hash } = await writeContract(request);
      const { transactionHash } = await waitForTransaction({
        hash: hash
      })
      dispatch(setShow(true))
      dispatch(setTx(transactionHash))
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  return (
    <div className="border-[1px] border-[#cdcdcd33] bg-base-200 shadow p-5 w-full max-w-full w-[600px] max-w-full mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Redeem TOMO</span>
            <span className="label-text-alt"></span>
          </div>
          <input type="text" placeholder="0.0" className="input input-md focus:outline-none input-bordered w-full" value={amount} disabled={loading} onChange={(e) => handleInputAmount(e.target.value)} />
        </label>
        <div className="flex items-center justify-start text-xs -mt-2">
          <div>Available $TOMO To Redeem : {loading ? 'loading...' : balance}</div>
        </div>
        <button className="btn btn-primary text-base w-full" disabled={loading || errorForm.error} onClick={() => handleSubmit()}>
          {loading && <Spinner customClass="w-4 h-4 opacity-[0.5]" />}
          Redeem
        </button>
        {errorForm.error && <div className="text-center text-red-600 text-sm" >{errorForm.message}</div>}
      </div>
    </div>
  )
}

const Repay = () => {
  const { address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [debt, setDebt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [allowance, setAllowance] = useState(0);
  const [loadingTx, setLoadingTx] = useState(false);
  const [loadingRepay, setLoadingRepay] = useState(false);
  const [isApprove, setApprove] = useState(false);
  const [errorForm, setErrorForm] = useState<{ error: boolean, message: string }>({ error: false, message: '' })

  const dispatch = useDispatch();

  useEffect(() => {

    if (amount === '' || amount === '0') {
      setApprove(true)
      setErrorForm({ error: true, message: '' })
      return
    }
    if (Number(amount) > balance) {
      setApprove(true);
      setErrorForm({ error: true, message: 'Insufficient Balance' });
      return
    }
    if (Number(amount) > allowance) {
      setApprove(false)
      setErrorForm({ error: true, message: '' })
      return;
    }
    if (Number(amount) <= allowance) {
      setApprove(true)
      setErrorForm({ error: false, message: '' })
      return
    }
    if (debt === 0) {
      setApprove(true)
      setErrorForm({ error: true, message: 'You dont have any debt' })
      return
    }
    if (Number(amount) > debt) {
      setErrorForm({ error: true, message: 'You pay more than the debt' })
    }
    setApprove(false);
    setErrorForm({ error: false, message: '' })
    return;
  }, [allowance, amount, balance, debt])

  useEffect(() => {
    const getData = async () => {
      if (!!address && !loadingTx) {
        const e = await getAllowanceValidator(address)
        setAllowance(Number(e) / (10 ** 18));
      }
    }

    getData()
  }, [address, loadingTx])

  useEffect(() => {
    const getData = async () => {
      if (!!address && !loadingRepay) {
        try {
          setLoading(true)
          await Promise.all([getTotalSUSDAnchor(address), getBalanceSUSDUser(address)]).then((values) => {
            setDebt(Number(values[0]) / (10 ** 18))
            setBalance(Number(values[1]) / (10 ** 18))
          })
          setLoading(false)
        } catch (error) {
          setLoading(false)
        }
      }
    }

    getData()
  }, [address, loadingRepay])

  const handleInputAmount = (v: string) => {
    let filteredValue = v.replace(/[^0-9.]/g, '');
    let dotCount = (filteredValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      filteredValue = filteredValue.replace(/\./g, (match, index) => index === filteredValue.indexOf('.') ? '.' : '');
    }
    setAmount(filteredValue);
  }

  const handleApprove = async () => {
    try {
      try {
        setLoadingTx(true);
        const { request } = await approveSusdValidator(BigInt(Number(amount) * (10 ** 18)));
        const { hash } = await writeContract(request);
        await waitForTransaction({
          hash: hash
        })
        setLoadingTx(false)
      } catch (error) {
        setLoadingTx(false)
      }
    } catch (error) {

    }
  }

  const handleRepay = async () => {
    try {
      setLoadingRepay(true)
      const { request } = await repayValidator(BigInt(Number(amount) * (10 ** 18)))
      const { hash } = await writeContract(request);
      const { transactionHash } = await waitForTransaction({
        hash: hash
      })
      dispatch(setShow(true));
      dispatch(setTx(transactionHash))
      setLoadingRepay(false)
    } catch (error) {
      setLoadingRepay(false)
    }
  }

  return (
    <div className="border-[1px] border-[#cdcdcd33] bg-base-200 shadow p-5 w-full max-w-full w-[600px] max-w-full mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Repay Debt</span>
            <span className="label-text-alt">Total debt: <span>{debt} $SUSD</span></span>
          </div>
          <input type="text" placeholder="0.0" className="input input-md focus:outline-none input-bordered w-full" value={amount} disabled={loading} onChange={(e) => handleInputAmount(e.target.value)} />
        </label>
        <div className="flex items-center justify-between text-xs -mt-2">
          <div>Available SUSD: <span>{balance} $SUSD</span></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="btn btn-primary text-base w-full" onClick={() => handleApprove()} disabled={isApprove || loadingTx || loading}>
            {loadingTx && <Spinner customClass="w-4 h-4 opacity-[0.5]" />}
            Approve
          </button>
          <button className="btn btn-primary text-base w-full" disabled={loading || errorForm.error || loadingRepay} onClick={() => handleRepay()}>
            {loadingRepay && <Spinner customClass="w-4 h-4 opacity-[0.5]" />}
            Repay
          </button>
        </div>
        {errorForm.error && <div className="text-center text-sm text-red-600">{errorForm.message}</div>}
      </div>
    </div>
  )
}

const AddCollateral = () => {
  const { address } = useAccount()
  const dispatch = useDispatch()

  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState<{ loadingBalance: boolean, loadingTx: boolean }>({ loadingBalance: false, loadingTx: false })
  const [errorForm, setErrorForm] = useState<{ error: boolean, message: string }>({ error: false, message: '' })

  useEffect(() => {
    const getData = async () => {
      if (!!address && !loading.loadingTx) {
        setLoading({ ...loading, loadingBalance: true })
        const d = await getTomoBalance(address);
        setBalance(Number(d.formatted))
        setLoading({ ...loading, loadingBalance: false })
      }
    }

    getData()
  }, [address, loading.loadingTx])

  useEffect(() => {
    if (amount === '' || amount === '0' || Number(amount) === 0) {
      setErrorForm({ error: true, message: '' })
      return
    }
    if (Number(amount) > balance) {
      setErrorForm({ error: true, message: 'Insufficient Balance' })
      return
    }
    setErrorForm({ error: false, message: '' })
    return
  }, [amount])

  const handleInputAmount = (v: string) => {
    let filteredValue = v.replace(/[^0-9.]/g, '');
    let dotCount = (filteredValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      filteredValue = filteredValue.replace(/\./g, (match, index) => index === filteredValue.indexOf('.') ? '.' : '');
    }
    setAmount(filteredValue);
  }

  const handleAdd = async () => {
    try {
      setLoading({ ...loading, loadingTx: true })
      const { request } = await prepareAddCollateral(BigInt(Number(amount) * (10 ** 18)))
      const { hash } = await writeContract(request);
      const { transactionHash } = await waitForTransaction({
        hash: hash
      })
      dispatch(setShow(true))
      dispatch(setTx(transactionHash))
      setLoading({ ...loading, loadingTx: false })
    } catch (error) {
      setLoading({ ...loading, loadingTx: false })
    }
  }

  return (
    <div className="border-[1px] border-[#cdcdcd33] bg-base-200 shadow p-5 w-full max-w-full w-[600px] max-w-full mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Add Collateral</span>
            <span className="label-text-alt"></span>
          </div>
          <input type="text" placeholder="0.0" className="input input-md focus:outline-none input-bordered w-full" value={amount} onChange={(e) => handleInputAmount(e.target.value)} disabled={loading.loadingBalance || loading.loadingTx} />
        </label>
        <div className="flex items-center justify-between text-xs -mt-2">
          <div>
            Available balance : <span>{balance}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button className="btn btn-xs btn-primary" onClick={() => setAmount(formatNumber(balance * 0.5))}>50%</button>
            <button className="btn btn-xs btn-primary" onClick={() => setAmount(formatNumber(balance * 0.75))}>75%</button>
          </div>
        </div>
        <button className="btn btn-primary text-base w-full" disabled={loading.loadingBalance || loading.loadingTx || errorForm.error} onClick={() => handleAdd()}>
          {loading.loadingTx && <Spinner customClass="w-4 h-4 opacity-[0.5]" />}
          Add Collateral
        </button>
        {errorForm.error && <div className="text-red-600 text-center text-sm">{errorForm.message}</div>}
      </div>
    </div>
  )
}