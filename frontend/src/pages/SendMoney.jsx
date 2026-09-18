import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Send,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowUpRight,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { Logo } from '../components/Logo';
import MobileNav from '../components/MobileNav';
import { getProfile } from '../services/authServices';
import { sendMoneyApi } from '../services/transactionServices';

export default function SendMoney() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [recipient, setRecipient] = useState(location.state?.recipient || location.state?.to || '');
  const [amount, setAmount] = useState(location.state?.amount ? String(location.state.amount) : '');
  const [paymentPin, setPaymentPin] = useState('');
  const [note, setNote] = useState(location.state?.note || '');
  const [showPin, setShowPin] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [txSuccessData, setTxSuccessData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const isPinVerified = sessionStorage.getItem('isPinVerified');
    if (isPinVerified !== 'true') {
      navigate('/enter-pin');
      return;
    }

    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error(e);
      }
    }

    getProfile(token)
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
      });
  }, [navigate]);

  const currentBalance = Number(user?.balance ?? 25000);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleQuickAmount = (val) => {
    setAmount(String(val));
    setErrorMsg('');
  };

  const handleCopyTxId = (id) => {
    if (navigator.clipboard && id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!recipient.trim()) {
      setErrorMsg('Please enter recipient UPI ID, Account Number, or Email.');
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      return;
    }

    if (numAmount > currentBalance) {
      setErrorMsg(`Insufficient balance! Available balance is ${formatCurrency(currentBalance)}.`);
      return;
    }

    if (!paymentPin || paymentPin.length < 4) {
      setErrorMsg('Please enter your 4-digit Payment PIN to authorize this transfer.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await sendMoneyApi({
        to: recipient.trim(),
        amount: numAmount,
        paymentPin: paymentPin.trim(),
      });

      if (res.success) {
        const updatedBalance = res.newBalance !== undefined ? res.newBalance : currentBalance - numAmount;
        const updatedUser = { ...user, balance: updatedBalance };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setTxSuccessData({
          transactionId: res.transaction?.transactionId || `TXN${Date.now()}`,
          amount: numAmount,
          recipient: res.receiver?.fullname || res.receiver?.upiId || recipient,
          recipientDetails: res.receiver?.upiId || res.receiver?.accountNumber || res.receiver?.email || recipient,
          newBalance: updatedBalance,
          date: new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
        });
      } else {
        setErrorMsg(res.message || 'Payment failed. Please check details and try again.');
      }
    } catch (err) {
      console.error('Send money error:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
      setErrorMsg(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTxSuccessData(null);
    setRecipient('');
    setAmount('');
    setPaymentPin('');
    setNote('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      
      <header className="sticky top-0 z-40 bg-[#0a1228]/80 backdrop-blur-md border-b border-blue-500/15 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />
          <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Logo size="small" />
          </div>
        </div>

        
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs">
            <Wallet size={14} className="text-blue-400" />
            <span className="text-slate-400 hidden sm:inline">Balance:</span>
            <span className="font-bold text-emerald-400 font-mono">
              {formatCurrency(currentBalance)}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border border-blue-400/40">
            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </header>

      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-lg">
          {txSuccessData ? (
            <div className="bg-[#0e172e] rounded-3xl border border-emerald-500/30 p-7 sm:p-8 text-white shadow-2xl shadow-emerald-500/10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={36} className="animate-bounce" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Transfer Successful
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-3 text-white">
                  ₹{txSuccessData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Sent securely to <span className="text-slate-200 font-semibold">{txSuccessData.recipient}</span>
                </p>
              </div>

              
              <div className="bg-slate-900/70 rounded-2xl border border-white/10 p-4 sm:p-5 space-y-3 text-xs mb-6 font-sans">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                  <span className="text-slate-400">Transaction ID</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-200 font-medium">{txSuccessData.transactionId}</span>
                    <button
                      onClick={() => handleCopyTxId(txSuccessData.transactionId)}
                      className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors cursor-pointer"
                      title="Copy Transaction ID"
                    >
                      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                  <span className="text-slate-400">Recipient Identifier</span>
                  <span className="font-medium text-slate-200">{txSuccessData.recipientDetails}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                  <span className="text-slate-400">Date & Time</span>
                  <span className="font-medium text-slate-200">{txSuccessData.date}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                  <span className="text-slate-400">Payment Channel</span>
                  <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Valtrix Instant IMPS
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Remaining Balance</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    {formatCurrency(txSuccessData.newBalance)}
                  </span>
                </div>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
                >
                  <Send size={14} /> Send Another
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Go to Dashboard <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0e172e] rounded-3xl border border-blue-500/25 p-7 sm:p-9 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                  <Send size={20} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Send Money Instantly
                  </h1>
                  <p className="text-xs text-slate-400">
                    Direct transfer via UPI ID, Account Number, or Email
                  </p>
                </div>
              </div>

              
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle size={17} className="shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Recipient UPI ID, Account, or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. friend@valutrix, 9823481928, or darshan@gmail.com"
                      value={recipient}
                      onChange={(e) => {
                        setRecipient(e.target.value);
                        setErrorMsg('');
                      }}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500 transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports Valtrix UPI handle, 12-digit account number, or registered email.
                  </p>
                </div>

                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">Amount (₹)</label>
                    <span className="text-[11px] text-slate-400">
                      Available:{' '}
                      <strong className="text-emerald-400 font-mono">
                        {formatCurrency(currentBalance)}
                      </strong>
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="500"
                      min="1"
                      max={currentBalance}
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setErrorMsg('');
                      }}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3.5 py-3 text-base font-mono text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500 transition-colors"
                    />
                  </div>

                  
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {[500, 1000, 2000, 5000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleQuickAmount(val)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer"
                      >
                        +₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Transfer Note <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rent payment, Dinner, Gift"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500 transition-colors"
                  />
                </div>

                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <KeyRound size={13} className="text-blue-400" />
                      <span>4-Digit Payment PIN</span>
                    </label>
                    <span className="text-[11px] text-slate-500">Configured at registration</span>
                  </div>

                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      placeholder="••••"
                      maxLength={4}
                      inputMode="numeric"
                      value={paymentPin}
                      onChange={(e) => {
                        setPaymentPin(e.target.value.replace(/\D/g, ''));
                        setErrorMsg('');
                      }}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm font-mono tracking-widest text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500 placeholder:tracking-normal transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                
                <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <span>256-Bit SSL Encrypted. Authenticated with your personal Payment PIN.</span>
                </div>

                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Authorizing & Transferring...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize & Transfer {amount ? `₹${Number(amount).toLocaleString('en-IN')}` : ''}</span>
                      <ArrowUpRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <MobileNav active="send" />
    </div>
  );
}
