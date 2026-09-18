import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Home,
  Send,
  QrCode,
  ArrowDownLeft,
  Clock,
  User as UserIcon,
  LogOut,
  Eye,
  EyeOff,
  Copy,
  Download,
  Share2,
  TrendingUp,
  Check,
  X,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  KeyRound,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Wallet,
  Lock,
  Menu
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Logo from '../components/Logo';
import MobileNav from '../components/MobileNav';
import { getProfile } from '../services/authServices.js';
import { getAllTransactionsApi } from '../services/transactionServices.js';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [showAccount, setShowAccount] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendData, setSendData] = useState({
    to: '',
    amount: '',
    paymentPin: '',
    note: ''
  });
  const [showPaymentPinInput, setShowPaymentPinInput] = useState(false);
  const [sendError, setSendError] = useState('');

  const myQrCanvasRef = useRef(null);
  const [transactions, setTransactions] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchUserProfile = (token) => {
    setRefreshing(true);
    getProfile(token)
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user profile:', err);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const mapTransactions = (rawTxs, currentUserId) => {
    return rawTxs.map((tx) => {
      const isDebit = String(tx.sender?._id || tx.sender) === String(currentUserId);
      const otherParty = isDebit ? tx.receiver : tx.sender;
      const otherName = otherParty?.fullname || (isDebit ? 'Transferred' : 'Received');
      return {
        id: tx._id || tx.transactionId,
        name: otherName,
        type: isDebit ? 'Instant Transfer' : 'Account Credit',
        amount: `${isDebit ? '-' : '+'} ₹${Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        time: new Date(tx.createdAt || Date.now()).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        isDebit,
        initials: (otherName || 'TX').slice(0, 2).toUpperCase(),
        bg: isDebit ? 'bg-rose-500/15' : 'bg-emerald-500/15',
        text: isDebit ? 'text-rose-500' : 'text-emerald-500',
        refId: tx.transactionId || 'TXN',
        status: tx.status || 'Success',
      };
    });
  };

  const fetchTransactions = (currentUserId) => {
    getAllTransactionsApi()
      .then((res) => {
        if (res.success && res.transactions) {
          const uid = currentUserId || user?._id || JSON.parse(localStorage.getItem('user') || '{}')?._id;
          setTransactions(mapTransactions(res.transactions, uid));
        }
      })
      .catch((err) => {
        console.error('Error fetching transactions:', err);
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
    let cachedUserId = null;
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
        cachedUserId = parsed._id;
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchUserProfile(token);
    fetchTransactions(cachedUserId);
  }, [navigate]);

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

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  const handleSendMoney = (e) => {
    e.preventDefault();
    setSendError('');

    const numAmount = Number(sendData.amount);
    if (!sendData.to.trim()) {
      setSendError('Please enter a recipient UPI ID, Account Number, or Name.');
      return;
    }
    if (!numAmount || numAmount <= 0) {
      setSendError('Please enter a valid amount.');
      return;
    }
    if (numAmount > displayBalance) {
      setSendError(`Insufficient balance! Available balance is ${formatCurrency(displayBalance)}.`);
      return;
    }
    if (!sendData.paymentPin || sendData.paymentPin.length < 4) {
      setSendError('Please enter your 4-digit Payment PIN to authorize this transfer.');
      return;
    }
    if (user?.paymentpin && Number(sendData.paymentPin) !== Number(user.paymentpin)) {
      setSendError('Incorrect Payment PIN! Please enter the 4-digit Payment PIN configured on your account.');
      return;
    }

    const newBalance = displayBalance - numAmount;
    const updatedUser = { ...user, balance: newBalance };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    const newTx = {
      id: Date.now(),
      name: sendData.to,
      type: sendData.to.includes('@') ? 'UPI Transfer' : 'Account Transfer',
      amount: `- ₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      time: 'Just now',
      isDebit: true,
      initials: sendData.to.slice(0, 2).toUpperCase(),
      bg: 'bg-rose-500/15',
      text: 'text-rose-500',
      refId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
      status: 'Successful'
    };

    setTransactions([newTx, ...transactions]);
    setSendModalOpen(false);
    setSendData({ to: '', amount: '', paymentPin: '', note: '' });
    showToast(`₹${numAmount.toLocaleString('en-IN')} sent successfully to ${sendData.to}!`);
  };

  const handleDownloadQr = (canvasRef) => {
    const wrapper = canvasRef?.current;
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
    } else {
      showToast('QR ready to download!');
    }
  };

  const handleSharePaymentLink = () => {
    const upiLink = `upi://pay?pa=${displayUpiId}&pn=${encodeURIComponent(displayName)}&cu=INR`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiLink);
    }
    showToast('UPI Payment Link copied to clipboard!');
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home, active: true },
    { name: 'Send Money', path: '/send-money', icon: Send },
    { name: 'Scan & Pay', path: '/scan-pay', icon: QrCode },
    { name: 'Receive Money', path: '/receive-money', icon: ArrowDownLeft },
    { name: 'Transactions', path: '/transactions', icon: Clock },
    // { name: 'Profile', path: '/profile', icon: UserIcon }
  ];

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      <header className="bg-[#0b1329] border-b border-blue-500/20 px-3 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link to="/" className="flex items-center">
            <Logo lightText={true} />
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              if (token) fetchUserProfile(token);
            }}
            title="Refresh Account Details"
            className={`p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-all ${
              refreshing ? 'animate-spin text-blue-400' : ''
            }`}
          >
            <RefreshCw size={15} />
          </button>

          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 bg-[#101b38] hover:bg-[#152347] border border-blue-500/20 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-white cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
              {initial}
            </div>
            <span className="max-w-[100px] sm:max-w-[140px] truncate">{displayName}</span>
          </div>

          <button
            onClick={handleLock}
            title="Lock Dashboard (Requires PIN)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 rounded-lg transition-all cursor-pointer"
          >
            <Lock size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Lock</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 rounded-lg transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0b1329] border-b border-blue-500/20 p-4 animate-in slide-in-from-top-2">
          <nav className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(item.path);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 bg-white/5 border border-white/10'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      <div className="flex-1 max-w-[1380px] w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="hidden lg:flex lg:col-span-3 bg-[#0b1329] rounded-2xl border border-blue-500/20 p-4 flex-col justify-between self-start shadow-xl">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30 translate-x-1'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-4 border-t border-white/10 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Account Status</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={11} /> Verified
              </span>
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">Primary UPI ID:</div>
              <div className="text-slate-200 font-medium truncate mt-0.5">{displayUpiId}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">Signed in as:</div>
              <div className="text-slate-300 font-medium truncate mt-0.5">{displayEmail}</div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Welcome back, {displayName.split(' ')[0]}!</span>
                  <Sparkles size={20} className="text-amber-500 shrink-0" />
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Real-time financial overview, instant transfers, and personalized account QR.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => navigate('/send-money')}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Send size={15} />
                  <span>Send Money</span>
                </button>

                <button
                  onClick={() => navigate('/scan-pay')}
                  className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition-all cursor-pointer"
                >
                  <QrCode size={15} />
                  <span>Scan & Pay</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 flex flex-col gap-5 sm:gap-6">
                <div className="bg-gradient-to-br from-[#0d172e] via-[#111e3d] to-[#172852] rounded-2xl p-5 sm:p-6 text-white border border-blue-500/25 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                      <Wallet size={16} className="text-blue-400" />
                      <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-300 font-semibold">
                        Total Available Balance
                      </span>
                    </div>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                      title={showBalance ? 'Hide Balance' : 'Show Balance'}
                    >
                      {showBalance ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>
                  </div>

                  <div className="flex items-baseline gap-3 mt-3 relative z-10">
                    <span className="text-2xl sm:text-4xl font-black tracking-tight font-mono">
                      {showBalance ? formatCurrency(displayBalance) : '••••••••'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 sm:px-2.5 py-0.5 rounded-full">
                      <TrendingUp size={12} /> Active
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-6 pt-4 border-t border-white/10 text-xs text-slate-300 relative z-10">
                    <div className="flex items-center justify-between sm:justify-start gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 overflow-hidden">
                      <span className="text-slate-400 shrink-0">UPI ID:</span>
                      <strong className="text-white font-mono truncate">{displayUpiId}</strong>
                      <button
                        onClick={() => handleCopy(displayUpiId, 'UPI ID')}
                        className="text-blue-400 hover:text-blue-300 p-0.5 cursor-pointer shrink-0"
                        title="Copy UPI ID"
                      >
                        {copiedField === 'UPI ID' ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                      <span className="text-slate-400 shrink-0">A/C:</span>
                      <strong className="text-white font-mono">
                        {showAccount
                          ? formatAccountNumber(displayAccountNumber)
                          : maskAccountNumber(displayAccountNumber)}
                      </strong>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setShowAccount(!showAccount)}
                          className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                          title={showAccount ? 'Mask Account' : 'Reveal Account'}
                        >
                          {showAccount ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          onClick={() => handleCopy(displayAccountNumber, 'Account Number')}
                          className="text-blue-400 hover:text-blue-300 p-0.5 cursor-pointer"
                          title="Copy Account Number"
                        >
                          {copiedField === 'Account Number' ? (
                            <Check size={13} className="text-emerald-400" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  <div
                    onClick={() => navigate('/send-money')}
                    className="bg-slate-50 hover:bg-blue-50/50 rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-blue-400 transition-all cursor-pointer group text-center sm:text-left"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 sm:mb-2.5 mx-auto sm:mx-0 group-hover:scale-105 transition-transform">
                      <Send size={16} />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">Send</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden sm:block">Instant UPI</div>
                  </div>

                  <div
                    onClick={() => navigate('/scan-pay')}
                    className="bg-slate-50 hover:bg-rose-50/50 rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-rose-400 transition-all cursor-pointer group text-center sm:text-left"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-2 sm:mb-2.5 mx-auto sm:mx-0 group-hover:scale-105 transition-transform">
                      <QrCode size={16} />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">Scan & Pay</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden sm:block">Upload & Pay</div>
                  </div>

                  <div
                    onClick={() => navigate('/receive-money')}
                    className="bg-slate-50 hover:bg-emerald-50/50 rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-emerald-400 transition-all cursor-pointer group text-center sm:text-left"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 sm:mb-2.5 mx-auto sm:mx-0 group-hover:scale-105 transition-transform">
                      <ArrowDownLeft size={16} />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">Receive</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden sm:block">My QR & Bank</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock size={16} className="text-slate-600" />
                      <span>Recent Transactions</span>
                    </span>
                    <button
                      onClick={() => navigate('/transactions')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex flex-col divide-y divide-slate-200/80">
                    {transactions.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No transactions found. Start by sending or receiving funds.
                      </div>
                    ) : (
                      transactions.slice(0, 4).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between py-2.5 sm:py-3 gap-2">
                          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                            <div
                              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${tx.bg} ${tx.text} flex items-center justify-center text-xs font-bold shrink-0`}
                            >
                              {tx.initials}
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{tx.name}</div>
                              <div className="text-[10px] sm:text-xs text-slate-400 truncate">
                                {tx.type} • {tx.time}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`text-xs sm:text-sm font-bold font-mono ${
                                tx.isDebit ? 'text-rose-600' : 'text-emerald-600'
                              }`}
                            >
                              {tx.amount}
                            </span>
                            <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono">{tx.refId}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col gap-5">
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col items-center justify-between shadow-sm">
                  <div className="w-full text-left">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">Personalized UPI QR</span>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      Accept payments directly into your Valtrix account.
                    </p>
                  </div>

                  <div ref={myQrCanvasRef} className="my-3 sm:my-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                    <QRCodeCanvas
                      value={`upi://pay?pa=${displayUpiId}&pn=${encodeURIComponent(displayName)}&cu=INR`}
                      size={144}
                      bgColor="#ffffff"
                      fgColor="#0f172a"
                      level="M"
                    />
                  </div>

                  <div className="text-center mb-3">
                    <div className="text-xs font-bold text-slate-800 font-mono">{displayUpiId}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{displayName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button
                      onClick={() => handleDownloadQr(myQrCanvasRef)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Download size={13} /> Download
                    </button>

                    <button
                      onClick={handleSharePaymentLink}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Share2 size={13} /> Share Link
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                    Security & Authentications
                  </span>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center gap-2">
                        <KeyRound size={15} className="text-blue-600" />
                        <span className="text-slate-700 font-medium">Entry PIN</span>
                      </div>
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                        Configured
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center gap-2">
                        <CreditCard size={15} className="text-indigo-600" />
                        <span className="text-slate-700 font-medium">Payment PIN</span>
                      </div>
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                        Active (4-Digit)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={15} className="text-emerald-600" />
                        <span className="text-slate-700 font-medium">Bank Protection</span>
                      </div>
                      <span className="text-slate-500 font-medium text-[11px]">256-Bit SSL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav active="home" />

      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-7 right-4 sm:right-7 z-50 bg-slate-900 text-white border border-blue-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
