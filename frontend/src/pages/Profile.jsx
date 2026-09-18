import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User as UserIcon,
  Building2,
  ShieldCheck,
  KeyRound,
  CreditCard,
  Lock,
  LogOut,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  Wallet,
  Eye,
  EyeOff,
  Send,
  QrCode,
  ArrowDownLeft,
  Clock,
  Mail,
  Calendar,
  Sparkles
} from 'lucide-react';
import Logo from '../components/Logo';
import MobileNav from '../components/MobileNav';
import { getProfile } from '../services/authServices.js';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchProfile = (token) => {
    setRefreshing(true);
    getProfile(token)
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

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
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchProfile(token);
  }, [navigate]);

  const displayName = user?.fullname || 'Valtrix Member';
  const displayEmail = user?.email || 'member@valtrix.com';
  const displayUpiId = user?.upiId || `${(user?.email || 'user').split('@')[0]}@valutrix`;
  const displayAccountNumber = user?.accountNumber || '109823478912';
  const displayBalance = user?.balance !== undefined ? Number(user.balance) : 25000;
  const initial = displayName.charAt(0).toUpperCase();

  const formatCurrency = (val) => {
    return '₹' + Number(val ?? 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatAccountNumber = (accNum) => {
    if (!accNum) return '•••• •••• ••••';
    return String(accNum).replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const maskAccountNumber = (accNum) => {
    if (!accNum) return '•••• •••• ••••';
    const str = String(accNum);
    if (str.length < 4) return str;
    return `•••• •••• ${str.slice(-4)}`;
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isPinVerified');
    navigate('/signin');
  };

  const handleLock = () => {
    sessionStorage.removeItem('isPinVerified');
    navigate('/enter-pin');
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      <header className="bg-[#0b1329] border-b border-blue-500/20 px-3 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 sm:px-3 py-2 rounded-xl border border-white/10 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link to="/" className="flex items-center">
            <Logo lightText={true} />
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <Wallet size={14} className="text-blue-400" />
            <span className="text-xs text-slate-400">Balance:</span>
            <span className="text-xs font-bold text-white font-mono">{formatCurrency(displayBalance)}</span>
          </div>

          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              if (token) fetchProfile(token);
            }}
            title="Refresh Profile"
            className={`p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-all ${
              refreshing ? 'animate-spin text-blue-400' : ''
            }`}
          >
            <RefreshCw size={15} />
          </button>

          <button
            onClick={handleLock}
            title="Lock Session"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer"
          >
            <Lock size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Lock</span>
          </button>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-5 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl shadow-blue-600/30 shrink-0">
                {initial}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">{displayName}</h1>
                  <Sparkles size={18} className="text-amber-400 shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 mt-1">
                  <Mail size={13} className="text-slate-500" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{displayEmail}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 size={11} /> KYC Verified
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                    <Calendar size={11} />
                    <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:items-end justify-center self-start sm:self-auto min-w-[200px]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Available Balance</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                {formatCurrency(displayBalance)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Zero-Balance Savings</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-5 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
              <Building2 size={20} className="text-blue-400" />
              <div>
                <h2 className="text-base font-bold text-white">Banking Credentials</h2>
                <p className="text-xs text-slate-400">Your registered account and clearing numbers</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Full Legal Name</div>
                  <div className="text-sm font-bold text-white mt-0.5">{displayName}</div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  Primary Holder
                </span>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">12-Digit Account Number</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {showAccount ? formatAccountNumber(displayAccountNumber) : maskAccountNumber(displayAccountNumber)}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowAccount(!showAccount)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                    title={showAccount ? 'Hide Account Number' : 'Show Account Number'}
                  >
                    {showAccount ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(displayAccountNumber, 'Account Number')}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    {copiedField === 'Account Number' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Assigned UPI VPA</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">{displayUpiId}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(displayUpiId, 'UPI ID')}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                >
                  {copiedField === 'UPI ID' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                </button>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Account Type</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Valtrix Zero-Balance Digital Savings
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-5 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
              <ShieldCheck size={20} className="text-blue-400" />
              <div>
                <h2 className="text-base font-bold text-white">Security & PIN Protection</h2>
                <p className="text-xs text-slate-400">Biometric and PIN protection configurations</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <KeyRound size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Entry / Login PIN</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">•••• (4-Digits)</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Configured
                </span>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Payment Authorization PIN</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">•••• (4-Digits)</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                  Required for Transfers
                </span>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Password Encryption</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">Bcrypt Salted</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                  Bank-Grade
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLock}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                >
                  <Lock size={14} />
                  <span>Lock Dashboard Session Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-5 sm:p-6 shadow-xl">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-4">
            Quick Navigation
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/send-money"
              className="p-4 rounded-2xl bg-white/5 hover:bg-blue-600/15 border border-white/10 hover:border-blue-500/30 flex flex-col items-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Send size={18} />
              </div>
              <span className="text-xs font-bold text-white">Send Money</span>
              <span className="text-[10px] text-slate-400 mt-0.5">UPI & Bank Transfer</span>
            </Link>

            <Link
              to="/scan-pay"
              className="p-4 rounded-2xl bg-white/5 hover:bg-rose-600/15 border border-white/10 hover:border-rose-500/30 flex flex-col items-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <QrCode size={18} />
              </div>
              <span className="text-xs font-bold text-white">Scan & Pay</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Upload & Decode QR</span>
            </Link>

            <Link
              to="/receive-money"
              className="p-4 rounded-2xl bg-white/5 hover:bg-emerald-600/15 border border-white/10 hover:border-emerald-500/30 flex flex-col items-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <ArrowDownLeft size={18} />
              </div>
              <span className="text-xs font-bold text-white">Receive Money</span>
              <span className="text-[10px] text-slate-400 mt-0.5">QR & Bank Details</span>
            </Link>

            <Link
              to="/transactions"
              className="p-4 rounded-2xl bg-white/5 hover:bg-purple-600/15 border border-white/10 hover:border-purple-500/30 flex flex-col items-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Clock size={18} />
              </div>
              <span className="text-xs font-bold text-white">Transactions</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Complete Ledger</span>
            </Link>
          </div>
        </div>
      </main>

      <MobileNav active="profile" />

      {toastMessage && (
        <div className="fixed bottom-7 right-7 z-50 bg-slate-900 text-white border border-blue-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
