'use client'

import { Spinner } from "@/components/Icons";
import { approveSUSDStability, approveSusdValidator, depositToStability, formatCurrency, getAllowanceStability, getAllowanceValidator, getBalanceSUSDUser, getDetailTrack, getLatestTrackID, getTOMOStability, getTotalSUSDAnchor, getTvlStabilityPool, getUserInfo, handleWithdraw, repayValidator } from "@/helper";
import { setShow, setTx } from "@/lib/features/toast/toastReducer";
import { IToast } from "@/types";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useNetwork } from "wagmi";

export default function Stability() {
  const [tvl, setTvl] = useState(0)
  const [totalTomo, setTotalTomo] = useState(0);
  const [trackId, setTrackId] = useState(0);

  const state = useSelector((state: {toast: IToast}) => state.toast);
  
  useEffect(() => {
    const getData = async () => {
      await Promise.all([getTvlStabilityPool(), getTOMOStability(), getLatestTrackID()]).then((values) => {
        setTvl(Number(values[0]) / (10 ** 18))
        setTotalTomo(Number(values[1].formatted))
        setTrackId(Number(values[2]) === 0 ? 0 : Number(values[2]) - 1)
      })
    }

    getData()
  }, [state.tx])



  return (
    <div className="max-w-[1200px] mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div className="text-2xl text-center font-bold">
          Stability Pool
        </div>
        <div className="w-full my-10">
          <div className="stats stats-vertical lg:stats-horizontal w-full">
            <div className="stat">
              <div className="stat-title">TVL</div>
              <div className="stat-value">${formatCurrency(tvl)}</div>
              <div className="stat-desc">Total SUSD in the pool</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total TOMO</div>
              <div className="stat-value">{formatCurrency(totalTomo)}</div>
              <div className="stat-desc">Total TOMO in the pool</div>
            </div>
            <div className="stat">
              <div className="stat-title">Latest TrackID</div>
              <div className="stat-value">{trackId}</div>
              <div className="stat-desc"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
          <Repay />
          <TableUser />
        </div>
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
    setApprove(false);
    setErrorForm({ error: false, message: '' })
    return;
  }, [allowance, amount, balance])

  useEffect(() => {
    const getData = async () => {
      if (!!address && !loadingTx) {
        const e = await getAllowanceStability(address)
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
        const { request } = await approveSUSDStability(BigInt(Number(amount) * (10 ** 18)));
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
      const { request } = await depositToStability(BigInt(Number(amount) * (10 ** 18)))
      const { hash } = await writeContract(request);
      const { transactionHash } = await waitForTransaction({
        hash: hash
      })
      dispatch(setShow(true));
      dispatch(setTx(transactionHash))
      const e = await getAllowanceStability(address as `0x${string}`)
      setAllowance(Number(e) / (10 ** 18));
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
            <span className="label-text">Deposit SUSD</span>
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
            Deposit
          </button>
        </div>
        {errorForm.error && <div className="text-center text-sm text-red-600">{errorForm.message}</div>}
      </div>
    </div>
  )
}

const TableUser = () => {
  const { address } = useAccount()
  const [listDeposit, setListDeposit] = useState<readonly bigint[]>([]);
  const state = useSelector((state: {toast: IToast}) => state.toast);

  useEffect(() => {
    const getData = async () => {
      if (!!address) {
        const e = await getUserInfo(address)
        setListDeposit(e)
      }
    }

    getData()
  }, [address, state.tx])

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>TrackID</th>
            <th>Deposit SUSD</th>
            <th>TOMO Gain</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {listDeposit.map((item) => {
            return (
              <TableRow key={item} id={item} />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const TableRow = ({ id }: { id: bigint }) => {
  const [susd, setSusd] = useState(0);
  const [tomo, setTomo] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    setLoading(true)
    const d = await getDetailTrack(id)
    console.log(d);
    setSusd(Number(d[2]) / (10 ** 18))
    setTomo(Number(d[3]) / (10 ** 18));
    setLoading(false)
  }, [])

  useEffect(() => {
    getData()
  }, [])

  const withdraw = async () => {
    try {
      setLoading(true)
      const { request } = await handleWithdraw(id)
      const { hash } = await writeContract(request);
      const { transactionHash } = await waitForTransaction({
        hash: hash
      })

      await getData()
      dispatch(setShow(true))
      dispatch(setTx(transactionHash))
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <tr>
      <td>{formatCurrency(Number(id))}</td>
      <td>{formatCurrency(susd)}</td>
      <td>{formatCurrency(tomo)}</td>
      <td>
        <button className="btn btn-sm btn-primary" disabled={loading || (susd === 0 && tomo === 0)} onClick={() => withdraw()}>
          {loading && <Spinner customClass="w-4 h-4 opacity-[0.5]" />}
          Withdraw
        </button>
      </td>
    </tr>
  )
}