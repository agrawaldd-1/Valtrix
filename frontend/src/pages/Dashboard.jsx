import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Home,
  Send,
  QrCode,
  ArrowDownLeft,
  Clock,
  User as UserIcon,
  LogOut,
  Bell,
  ChevronDown,
  Eye,
  EyeOff,
  Copy,
  Download,
  Share2,
  TrendingUp,
  Check,
  X,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  CreditCard,
  KeyRound,
  ShieldCheck,
  Search,
  Filter,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Wallet,
  Smartphone,
  Building2,
  Lock
} from 'lucide-react';
import Logo from '../components/Logo';
import { getProfile } from '../services/authServices.js';
import { getAllTransactionsApi } from '../services/transactionServices.js';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [showAccount, setShowAccount] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [copiedField, setCopiedField] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Send Money Modal State
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendData, setSendData] = useState({
    to: '',
    amount: '',
    paymentPin: '',
    note: ''
  });
  const [showPaymentPinInput, setShowPaymentPinInput] = useState(false);
  const [sendError, setSendError] = useState('');

  // Scan & Pay Modal State
  const [scanModalOpen, setScanModalOpen] = useState(false);

  // Transactions State & Filters
  const [txSearch, setTxSearch] = useState('');
  const [txFilter, setTxFilter] = useState('all'); // 'all' | 'debit' | 'credit'
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      type: 'UPI Transfer',
      amount: '- ₹2,000.00',
      time: 'Today, 2:33 PM',
      isDebit: true,
      initials: 'RS',
      bg: 'bg-amber-500/15',
      text: 'text-amber-500',
      refId: 'TXN983204918',
      status: 'Successful'
    },
    {
      id: 2,
      name: 'Amit Kumar',
      type: 'Account Credit',
      amount: '+ ₹500.00',
      time: 'Yesterday, 3:20 AM',
      isDebit: false,
      initials: 'AK',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-500',
      refId: 'TXN849201934',
      status: 'Successful'
    },
    {
      id: 3,
      name: 'Priya Singh',
      type: 'Scan & Pay',
      amount: '- ₹750.00',
      time: '12 Sep, 3:37 PM',
      isDebit: true,
      initials: 'PS',
      bg: 'bg-rose-500/15',
      text: 'text-rose-500',
      refId: 'TXN748291039',
      status: 'Successful'
    },
    {
      id: 4,
      name: 'Neha Patel',
      type: 'UPI Transfer',
      amount: '+ ₹1,200.00',
      time: '11 Sep, 3:00 PM',
      isDebit: false,
      initials: 'NP',
      bg: 'bg-sky-500/15',
      text: 'text-sky-500',
      refId: 'TXN648392018',
      status: 'Successful'
    }
  ]);

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    // Enforce mandatory Security PIN verification before dashboard access
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

    fetchUserProfile(token);

    getAllTransactionsApi()
      .then((res) => {
        if (res.success && res.transactions && res.transactions.length > 0) {
          const currentUserId = user?._id || JSON.parse(cachedUser || '{}')?._id;
          const mapped = res.transactions.map((tx) => {
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
              status: tx.status || 'Successful',
            };
          });
          setTransactions(mapped);
        }
      })
      .catch((err) => {
        console.error('Error fetching transactions:', err);
      });
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

  // User schema field derivations
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

  // Send Money Handler with Payment PIN Verification
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
    // Verify against user.paymentpin if available
    if (user?.paymentpin && Number(sendData.paymentPin) !== Number(user.paymentpin)) {
      setSendError('Incorrect Payment PIN! Please enter the 4-digit Payment PIN configured on your account.');
      return;
    }

    // Deduct from live balance
    const newBalance = displayBalance - numAmount;
    const updatedUser = { ...user, balance: newBalance };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Append to transactions
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

  // Download QR Code
  const handleDownloadQr = () => {
    const svgElement = document.getElementById('user-qr-code-svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `Valtrix-QR-${displayName.replace(/\s+/g, '_')}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
      showToast('Personalized QR Code downloaded successfully!');
    } else {
      showToast('QR Code downloaded!');
    }
  };

  // Share UPI link
  const handleSharePaymentLink = () => {
    const upiLink = `upi://pay?pa=${displayUpiId}&pn=${encodeURIComponent(displayName)}&cu=INR`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiLink);
    }
    showToast('UPI Payment Link copied to clipboard!');
  };

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Send Money', icon: Send },
    { name: 'Scan & Pay', icon: QrCode },
    { name: 'Receive Money', icon: ArrowDownLeft },
    { name: 'Transactions', icon: Clock },
    { name: 'Profile', icon: UserIcon }
  ];

  // Filtered transactions for Transactions tab
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.name.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.type.toLowerCase().includes(txSearch.toLowerCase()) ||
      (tx.refId && tx.refId.toLowerCase().includes(txSearch.toLowerCase()));

    if (txFilter === 'debit') return matchesSearch && tx.isDebit;
    if (txFilter === 'credit') return matchesSearch && !tx.isDebit;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#0b1329] border-b border-blue-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <Link to="/" className="flex items-center">
          <Logo lightText={true} />
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              if (token) fetchUserProfile(token);
            }}
            title="Refresh Account Details"
            className={`p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all ${
              refreshing ? 'animate-spin text-blue-400' : ''
            }`}
          >
            <RefreshCw size={15} />
          </button>

          <div
            onClick={() => setActiveTab('Profile')}
            className="flex items-center gap-2 bg-[#101b38] hover:bg-[#152347] border border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-white cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
              {initial}
            </div>
            <span className="max-w-[140px] truncate">{displayName}</span>
          </div>

          <button
            onClick={handleLock}
            title="Lock Dashboard (Requires PIN)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 rounded-lg transition-all cursor-pointer"
          >
            <Lock size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Lock</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 rounded-lg transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

        </div>
      </header>

      {/* Main Grid Container */}
      <div className="flex-1 max-w-[1380px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 bg-[#0b1329] rounded-2xl border border-blue-500/20 p-4 flex flex-col justify-between self-start shadow-xl">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.name === 'Send Money') {
                      navigate('/send-money');
                    } else if (item.name === 'Scan & Pay') {
                      setScanModalOpen(true);
                    } else {
                      setActiveTab(item.name);
                    }
                  }}
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

          {/* Account Quick Card in Sidebar */}
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

        {/* Content Area */}
        <main className="lg:col-span-9 flex flex-col gap-6">
          {/* TAB 1: HOME */}
          {activeTab === 'Home' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Welcome back, {displayName.split(' ')[0]}!</span>
                    <Sparkles size={20} className="text-amber-500 shrink-0" />
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Here is your real-time financial overview, account credentials, and recent transfers.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => navigate('/send-money')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/25 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Send size={15} />
                    <span>Send Money</span>
                  </button>

                  <button
                    onClick={() => setScanModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold border border-slate-300 transition-all cursor-pointer"
                  >
                    <QrCode size={15} />
                    <span>Scan</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 flex flex-col gap-6">
                  {/* Total Balance Card */}
                  <div className="bg-gradient-to-br from-[#0d172e] via-[#111e3d] to-[#172852] rounded-2xl p-6 text-white border border-blue-500/25 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-blue-400" />
                        <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
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
                      <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                        {showBalance ? formatCurrency(displayBalance) : '••••••••'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        <TrendingUp size={12} /> Active
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-4 mt-6 pt-4 border-t border-white/10 text-xs text-slate-300 relative z-10">
                      {/* UPI ID */}
                      <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                        <span className="text-slate-400">UPI ID:</span>
                        <strong className="text-white font-mono">{displayUpiId}</strong>
                        <button
                          onClick={() => handleCopy(displayUpiId, 'UPI ID')}
                          className="text-blue-400 hover:text-blue-300 p-0.5 cursor-pointer"
                          title="Copy UPI ID"
                        >
                          {copiedField === 'UPI ID' ? (
                            <Check size={13} className="text-emerald-400" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>

                      {/* Account Number */}
                      <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                        <span className="text-slate-400">A/C:</span>
                        <strong className="text-white font-mono">
                          {showAccount
                            ? formatAccountNumber(displayAccountNumber)
                            : maskAccountNumber(displayAccountNumber)}
                        </strong>
                        <button
                          onClick={() => setShowAccount(!showAccount)}
                          className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                          title={showAccount ? 'Mask Account Number' : 'Reveal Account Number'}
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

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      onClick={() => navigate('/send-money')}
                      className="bg-slate-50 hover:bg-blue-50/50 rounded-xl p-3.5 sm:p-4 border border-slate-200 hover:border-blue-400 transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <Send size={16} />
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">Send Money</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Instant UPI / A/C</div>
                    </div>

                    <div
                      onClick={() => setScanModalOpen(true)}
                      className="bg-slate-50 hover:bg-rose-50/50 rounded-xl p-3.5 sm:p-4 border border-slate-200 hover:border-rose-400 transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <QrCode size={16} />
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">Scan & Pay</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Any QR / BharatQR</div>
                    </div>

                    <div
                      onClick={() => setActiveTab('Receive Money')}
                      className="bg-slate-50 hover:bg-emerald-50/50 rounded-xl p-3.5 sm:p-4 border border-slate-200 hover:border-emerald-400 transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <ArrowDownLeft size={16} />
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">Receive</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">My QR & Account</div>
                    </div>
                  </div>

                  {/* Recent Transactions Preview */}
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Clock size={16} className="text-slate-600" />
                        <span>Recent Transactions</span>
                      </span>
                      <button
                        onClick={() => setActiveTab('Transactions')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-200/80">
                      {transactions.slice(0, 4).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${tx.bg} ${tx.text} flex items-center justify-center text-xs font-bold shrink-0`}
                            >
                              {tx.initials}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800">{tx.name}</div>
                              <div className="text-xs text-slate-400">
                                {tx.type} • {tx.time}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`text-sm font-bold font-mono ${
                                tx.isDebit ? 'text-rose-600' : 'text-emerald-600'
                              }`}
                            >
                              {tx.amount}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono">{tx.refId}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Personalized QR & Account Overview */}
                <div className="md:col-span-5 flex flex-col gap-5">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col items-center justify-between shadow-sm">
                    <div className="w-full text-left">
                      <span className="text-sm font-bold text-slate-900">Personalized UPI QR</span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Accept payments directly to your Valtrix account.
                      </p>
                    </div>

                    {/* QR Code SVG */}
                    <div className="my-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                      <svg
                        id="user-qr-code-svg"
                        width="150"
                        height="150"
                        viewBox="0 0 100 100"
                        fill="none"
                      >
                        <rect width="100" height="100" rx="10" fill="#ffffff" />
                        <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                        <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                        <rect x="13" y="13" width="10" height="10" rx="1" fill="#0f172a" />
                        <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                        <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                        <rect x="77" y="13" width="10" height="10" rx="1" fill="#0f172a" />
                        <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
                        <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                        <rect x="13" y="77" width="10" height="10" rx="1" fill="#0f172a" />
                        <rect x="36" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="46" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="56" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="36" y="20" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="46" y="20" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="56" y="20" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="8" y="36" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="20" y="36" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="8" y="46" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="20" y="46" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="8" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="20" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="68" y="36" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="80" y="36" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="74" y="46" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="86" y="46" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="68" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="80" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="36" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="46" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="56" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="36" y="80" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="46" y="80" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="56" y="80" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="68" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="80" y="74" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="74" y="86" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="86" y="86" width="6" height="6" rx="1" fill="#0f172a" />
                        <rect x="37" y="37" width="26" height="26" rx="6" fill="#0c1527" />
                        <text
                          x="50"
                          y="53"
                          fill="#60a5fa"
                          fontSize="6.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          VALTRIX
                        </text>
                      </svg>
                    </div>

                    <div className="text-center mb-3">
                      <div className="text-xs font-bold text-slate-800 font-mono">{displayUpiId}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{displayName}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        onClick={handleDownloadQr}
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

                  {/* Security & Credentials Summary Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                      Security & Authentications
                    </span>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="flex items-center gap-2">
                          <KeyRound size={15} className="text-blue-600" />
                          <span className="text-slate-700 font-medium">Entry PIN (Login)</span>
                        </div>
                        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                          Configured
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="flex items-center gap-2">
                          <CreditCard size={15} className="text-indigo-600" />
                          <span className="text-slate-700 font-medium">Payment PIN (Transfers)</span>
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
          )}

          {/* TAB 2: RECEIVE MONEY */}
          {activeTab === 'Receive Money' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Receive Money & Account Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Share your QR code or banking credentials to receive funds instantly from any bank.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col items-center text-center shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 font-bold text-lg">
                    {initial}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{displayName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Valtrix Verified Banking</p>

                  <div className="my-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-md">
                    <svg width="180" height="180" viewBox="0 0 100 100" fill="none">
                      <rect width="100" height="100" rx="10" fill="#ffffff" />
                      <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                      <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                      <rect x="13" y="13" width="10" height="10" rx="1" fill="#0f172a" />
                      <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                      <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                      <rect x="77" y="13" width="10" height="10" rx="1" fill="#0f172a" />
                      <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
                      <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                      <rect x="13" y="77" width="10" height="10" rx="1" fill="#0f172a" />
                      <rect x="36" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="46" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="56" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="36" y="20" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="46" y="20" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="56" y="20" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="8" y="36" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="20" y="36" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="8" y="46" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="20" y="46" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="8" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="20" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="68" y="36" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="80" y="36" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="74" y="46" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="86" y="46" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="68" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="80" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="36" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="46" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="56" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="36" y="80" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="46" y="80" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="56" y="80" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="68" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="80" y="74" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="74" y="86" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="86" y="86" width="6" height="6" rx="1" fill="#0f172a" />
                      <rect x="37" y="37" width="26" height="26" rx="6" fill="#0c1527" />
                      <text
                        x="50"
                        y="53"
                        fill="#60a5fa"
                        fontSize="6.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        VALTRIX
                      </text>
                    </svg>
                  </div>

                  <div className="font-mono text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 mb-4">
                    {displayUpiId}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <button
                      onClick={handleDownloadQr}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition-all cursor-pointer"
                    >
                      <Download size={14} /> Download QR
                    </button>
                    <button
                      onClick={handleSharePaymentLink}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Share2 size={14} /> Share Link
                    </button>
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Building2 size={16} className="text-blue-600" />
                      <span>Direct Bank Transfer Details</span>
                    </h4>

                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                        <div>
                          <div className="text-[11px] text-slate-400 font-medium">Account Holder</div>
                          <div className="text-sm font-semibold text-slate-800">{displayName}</div>
                        </div>
                        <button
                          onClick={() => handleCopy(displayName, 'Account Holder Name')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                        <div>
                          <div className="text-[11px] text-slate-400 font-medium">12-Digit Account Number</div>
                          <div className="text-sm font-semibold text-slate-800 font-mono">
                            {displayAccountNumber}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(displayAccountNumber, 'Account Number')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                        <div>
                          <div className="text-[11px] text-slate-400 font-medium">IFSC Code</div>
                          <div className="text-sm font-semibold text-slate-800 font-mono">VALT0002026</div>
                        </div>
                        <button
                          onClick={() => handleCopy('VALT0002026', 'IFSC Code')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                        <div>
                          <div className="text-[11px] text-slate-400 font-medium">UPI ID</div>
                          <div className="text-sm font-semibold text-slate-800 font-mono">
                            {displayUpiId}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(displayUpiId, 'UPI ID')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                        <div>
                          <div className="text-[11px] text-slate-400 font-medium">Bank & Branch</div>
                          <div className="text-sm font-semibold text-slate-800">
                            Valtrix Digital Bank, Mumbai HQ
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
                          24x7 IMPS / NEFT / RTGS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSACTIONS */}
          {activeTab === 'Transactions' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Transaction History
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Complete ledger of all inbound credits and outbound UPI / account debits.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/send-money')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Send size={14} /> Send Money
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex-1 max-w-md">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    placeholder="Search by name, type, or Txn ID..."
                    className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 w-full"
                  />
                  {txSearch && (
                    <button onClick={() => setTxSearch('')} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                  <button
                    onClick={() => setTxFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      txFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All ({transactions.length})
                  </button>
                  <button
                    onClick={() => setTxFilter('debit')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      txFilter === 'debit'
                        ? 'bg-white text-rose-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Debits (-)
                  </button>
                  <button
                    onClick={() => setTxFilter('credit')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      txFilter === 'credit'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Credits (+)
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
                {filteredTransactions.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <Clock size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold">No transactions found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filter.</p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-full ${tx.bg} ${tx.text} flex items-center justify-center text-xs font-bold shrink-0`}
                        >
                          {tx.initials}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{tx.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {tx.type} • {tx.time}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-sm font-bold font-mono ${
                            tx.isDebit ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {tx.amount}
                        </div>
                        <div className="flex items-center gap-2 justify-end mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono">{tx.refId}</span>
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'Profile' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                    {initial}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{displayName}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{displayEmail}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={11} /> KYC Verified
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
                >
                  Sign Out Account
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banking Credentials */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 size={16} className="text-blue-600" />
                    <span>Banking Credentials</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400">Full Legal Name</div>
                        <div className="text-sm font-semibold text-slate-800">{displayName}</div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Primary Holder</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400">12-Digit Account Number</div>
                        <div className="text-sm font-semibold text-slate-800 font-mono">
                          {showAccount
                            ? formatAccountNumber(displayAccountNumber)
                            : maskAccountNumber(displayAccountNumber)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setShowAccount(!showAccount)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {showAccount ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => handleCopy(displayAccountNumber, 'Account Number')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400">Assigned UPI ID</div>
                        <div className="text-sm font-semibold text-slate-800 font-mono">{displayUpiId}</div>
                      </div>
                      <button
                        onClick={() => handleCopy(displayUpiId, 'UPI ID')}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                      >
                        <Copy size={14} />
                      </button>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400">Account Type</div>
                        <div className="text-sm font-semibold text-slate-800">
                          Valtrix Zero-Balance Digital Savings
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security & PIN Configuration */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <span>Security & PIN Protection</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400">Login / Security PIN</div>
                        <div className="text-sm font-semibold text-slate-800 font-mono">•••• (4 Digits)</div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400">Payment Authorization PIN</div>
                        <div className="text-sm font-semibold text-slate-800 font-mono">•••• (4 Digits)</div>
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        Required for Transfers
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400">Password Encryption</div>
                        <div className="text-sm font-semibold text-slate-800 font-mono">
                          Bcrypt Hashed (Salted)
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        Protected
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400">Current Balance</div>
                        <div className="text-sm font-bold text-slate-800 font-mono">
                          {formatCurrency(displayBalance)}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Send Money with Payment PIN verification */}
      {sendModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setSendModalOpen(false);
            setSendError('');
          }}
        >
          <div
            className="w-full max-w-md bg-[#0f172a] rounded-3xl border border-blue-500/25 p-7 text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Send size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Send Money Instantly</h3>
                  <p className="text-xs text-slate-400">Transfer via UPI or Account Number</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSendModalOpen(false);
                  setSendError('');
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {sendError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-rose-400" />
                <span>{sendError}</span>
              </div>
            )}

            <form onSubmit={handleSendMoney} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Recipient UPI ID, Account, or Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. friend@valutrix or 9823481928"
                  value={sendData.to}
                  onChange={(e) => setSendData({ ...sendData, to: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Amount (₹)</label>
                  <span className="text-[11px] text-slate-400">
                    Available: <strong className="text-emerald-400 font-mono">{formatCurrency(displayBalance)}</strong>
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="500"
                    min="1"
                    max={displayBalance}
                    value={sendData.amount}
                    onChange={(e) => setSendData({ ...sendData, amount: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                  />
                </div>

                {/* Quick Amount Pills */}
                <div className="flex items-center gap-2 mt-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSendData({ ...sendData, amount: String(amt) })}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment PIN Field */}
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
                    type={showPaymentPinInput ? 'text' : 'password'}
                    placeholder="Enter 4-digit PIN"
                    maxLength={4}
                    inputMode="numeric"
                    value={sendData.paymentPin}
                    onChange={(e) => setSendData({ ...sendData, paymentPin: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono tracking-widest text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500 placeholder:tracking-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPaymentPinInput(!showPaymentPinInput)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPaymentPinInput ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>Authorize & Transfer</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Scan & Pay Simulator */}
      {scanModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setScanModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0f172a] rounded-3xl border border-blue-500/25 p-6 text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-blue-400" />
                <h3 className="text-lg font-bold text-white">Scan Any QR Code</h3>
              </div>
              <button
                onClick={() => setScanModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Viewfinder simulator */}
            <div className="relative w-full h-56 bg-slate-900 rounded-2xl border border-blue-500/30 flex items-center justify-center overflow-hidden mb-4">
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

              {/* Corner Frame Lines */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-blue-500 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-blue-500 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-blue-500 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-blue-500 rounded-br-lg" />

              {/* Scanning Laser Animation */}
              <div className="absolute w-44 h-0.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse" />

              <div className="text-center z-10 px-4">
                <QrCode size={40} className="mx-auto text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">Align QR code within the frame to pay</p>
              </div>
            </div>

            {/* Quick Demo Payees */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-semibold mb-1">Or Quick Select Test Merchant:</div>
              {[
                { name: 'Cafe Coffee Point', vpa: 'cafepoint@valutrix', amount: '240' },
                { name: 'Metro Rail Ticket', vpa: 'metropay@valutrix', amount: '60' },
                { name: 'Reliance Supermart', vpa: 'supermart@valutrix', amount: '1250' }
              ].map((m) => (
                <div
                  key={m.vpa}
                  onClick={() => {
                    setScanModalOpen(false);
                    setSendData({
                      to: m.vpa,
                      amount: m.amount,
                      paymentPin: '',
                      note: `Payment to ${m.name}`
                    });
                    setSendModalOpen(true);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{m.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{m.vpa}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400 font-mono">₹{m.amount}</div>
                    <span className="text-[10px] text-blue-400 hover:underline">Pay Now</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-7 right-7 z-50 bg-slate-900 text-white border border-blue-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
