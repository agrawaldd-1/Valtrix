import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Wallet,
  Eye,
  EyeOff,
  Sparkles,
  QrCode
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Logo from '../components/Logo';
import MobileNav from '../components/MobileNav';
import { getProfile } from '../services/authServices.js';

export default function ReceiveMoney() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const qrCanvasRef = useRef(null);

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

  const handleDownloadQr = () => {
    const wrapper = qrCanvasRef?.current;
    const canvas = wrapper ? wrapper.querySelector('canvas') : null;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `Valtrix-UPI-QR-${displayName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('QR Code downloaded as PNG!');
    }
  };

  const handleSharePaymentLink = () => {
    const link = `upi://pay?pa=${displayUpiId}&pn=${encodeURIComponent(displayName)}&cu=INR`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      showToast('UPI Payment Link copied to clipboard!');
    }
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
            title="Refresh Account Details"
            className={`p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-all ${
              refreshing ? 'animate-spin text-blue-400' : ''
            }`}
          >
            <RefreshCw size={15} />
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-2 bg-[#101b38] hover:bg-[#16254e] border border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {initial}
            </div>
            <span className="max-w-[110px] sm:max-w-[140px] truncate">{displayName}</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <QrCode size={24} />
              </span>
              <span>Receive Money & Banking Details</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Share your personal UPI QR code or bank account credentials to accept instant payments.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <ShieldCheck size={14} /> 24x7 IMPS / NEFT / UPI Enabled
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#0b1329] rounded-3xl border border-blue-500/20 p-5 sm:p-8 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl mb-3 shadow-lg shadow-blue-600/30">
              {initial}
            </div>
            <h2 className="text-lg font-bold text-white">{displayName}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <span>Valtrix Verified Banking</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={10} /> Active
              </span>
            </div>

            <div
              ref={qrCanvasRef}
              className="my-5 p-5 bg-white rounded-3xl border border-slate-200 shadow-2xl flex items-center justify-center"
            >
              <QRCodeCanvas
                value={`upi://pay?pa=${displayUpiId}&pn=${encodeURIComponent(displayName)}&cu=INR`}
                size={188}
                bgColor="#ffffff"
                fgColor="#070d1e"
                level="M"
              />
            </div>

            <div className="w-full bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center justify-between mb-4">
              <div className="text-left overflow-hidden mr-2">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Your Primary UPI ID</div>
                <div className="text-xs sm:text-sm font-black text-white font-mono truncate mt-0.5">{displayUpiId}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(displayUpiId, 'UPI ID')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-blue-400 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
                title="Copy UPI ID"
              >
                {copiedField === 'UPI ID' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>Download QR</span>
              </button>

              <button
                type="button"
                onClick={handleSharePaymentLink}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <Share2 size={14} />
                <span>Share Link</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-5 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Building2 size={20} className="text-blue-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">Direct Bank Account Details</h2>
                    <p className="text-xs text-slate-400">Use for IMPS, NEFT, RTGS or net banking transfers</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Beneficiary Name</div>
                    <div className="text-sm font-bold text-white mt-0.5">{displayName}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(displayName, 'Account Holder Name')}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    {copiedField === 'Account Holder Name' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">12-Digit Account Number</div>
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

                <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">IFSC Code</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">VALT0002026</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('VALT0002026', 'IFSC Code')}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    {copiedField === 'IFSC Code' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Primary UPI VPA</div>
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Bank & Branch</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                      Valtrix Digital Bank, Mumbai HQ
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
                    Instant 24x7 Settlement
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-5 sm:p-6 shadow-xl text-xs space-y-3">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                How Receiving Works
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Instant Credit</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Incoming UPI or IMPS payments are directly deposited into your live balance in real time.
                  </p>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Zero Surcharge</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    No platform fees, commission, or processing charges on any incoming transactions.
                  </p>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-400" />
                    <span>Any UPI App</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Payers can scan your Valtrix QR code with GPay, PhonePe, Paytm, or any BHIM UPI app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav active="receive" />

      {toastMessage && (
        <div className="fixed bottom-7 right-7 z-50 bg-slate-900 text-white border border-blue-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
