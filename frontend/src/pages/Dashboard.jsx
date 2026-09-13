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
  ArrowUpRight
} from 'lucide-react';
import Logo from '../components/Logo';
import { getProfile } from '../services/authServices.js';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [copiedField, setCopiedField] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendData, setSendData] = useState({ to: '', amount: '' });

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      type: 'UPI/QR/Account',
      amount: '- ₹2,000',
      time: '2:33 PM',
      isDebit: true,
      initials: 'RS',
      bg: 'bg-amber-500/15',
      text: 'text-amber-500'
    },
    {
      id: 2,
      name: 'Amit Kumar',
      type: 'UPI/QR/Account',
      amount: '+ ₹500',
      time: '3:20 AM',
      isDebit: false,
      initials: 'AK',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-500'
    },
    {
      id: 3,
      name: 'Priya Singh',
      type: 'UPI/QR/Account',
      amount: '- ₹750',
      time: '3:37 PM',
      isDebit: true,
      initials: 'PS',
      bg: 'bg-rose-500/15',
      text: 'text-rose-500'
    },
    {
      id: 4,
      name: 'Neha Patel',
      type: 'UPI/QR/Account',
      amount: '+ ₹1,200',
      time: '3:00 PM',
      isDebit: false,
      initials: 'NP',
      bg: 'bg-lime-500/15',
      text: 'text-lime-500'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
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
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendMoney = (e) => {
    e.preventDefault();
    if (!sendData.to || !sendData.amount) return;

    const newTx = {
      id: Date.now(),
      name: sendData.to,
      type: 'UPI Transfer',
      amount: `- ₹${Number(sendData.amount).toLocaleString('en-IN')}`,
      time: 'Just now',
      isDebit: true,
      initials: sendData.to.slice(0, 2).toUpperCase(),
      bg: 'bg-blue-500/15',
      text: 'text-blue-500'
    };

    setTransactions([newTx, ...transactions]);
    setSendModalOpen(false);
    setSendData({ to: '', amount: '' });
    showToast(`₹${sendData.amount} sent to ${sendData.to}!`);
  };

  const displayName = user?.fullname || 'Darshan Agrawal';
  const displayEmail = user?.email || 'darshan@valtrix';
  const initial = displayName.charAt(0).toUpperCase();

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Send Money', icon: Send },
    { name: 'Scan & Pay', icon: QrCode },
    { name: 'Receive Money', icon: ArrowDownLeft },
    { name: 'Transactions', icon: Clock },
    { name: 'Profile', icon: UserIcon }
  ];

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-900 flex flex-col font-sans">
      <header className="bg-[#0b1329] border-b border-blue-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo lightText={true} />
        </Link>

        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2 bg-[#101b38] border border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-white">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {initial}
            </div>
            <span>{displayName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 rounded-lg transition-all"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1360px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 bg-[#0b1329] rounded-2xl border border-blue-500/20 p-4 flex flex-col justify-between self-start">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (item.name === 'Send Money') setSendModalOpen(true);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all text-left ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-4 border-t border-white/10 text-xs text-slate-500">
            <div>Signed in as:</div>
            <div className="text-slate-300 font-medium truncate mt-0.5">{displayEmail}</div>
          </div>
        </aside>

        <main className="lg:col-span-9 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {displayName.split(' ')[0]}!
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Here is your real-time financial overview and recent transactions.
                </p>
              </div>

              <button
                onClick={() => setSendModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md hover:-translate-y-0.5 transition-all self-start sm:self-auto"
              >
                <Send size={15} />
                <span>Send Money</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 flex flex-col gap-6">
                <div className="bg-gradient-to-br from-[#0d172e] to-[#152243] rounded-2xl p-5 sm:p-6 text-white border border-blue-500/25 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Total Balance
                    </span>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>

                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      {showBalance ? '₹25,480.00' : '••••••••'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                      <TrendingUp size={12} /> + ₹2,340 this month
                    </span>
                  </div>

                  <div className="flex items-center flex-wrap gap-4 mt-5 pt-3 border-t border-white/10 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>UPI ID:</span>
                      <strong className="text-slate-200">{displayEmail.split('@')[0]}@valtrix</strong>
                      <button
                        onClick={() => handleCopy(`${displayEmail.split('@')[0]}@valtrix`, 'UPI ID')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {copiedField === 'UPI ID' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>Account:</span>
                      <strong className="text-slate-200">XXXX XXXX 4921</strong>
                      <button
                        onClick={() => handleCopy('XXXX XXXX 4921', 'Account Number')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {copiedField === 'Account Number' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setSendModalOpen(true)}
                    className="bg-slate-50 hover:bg-blue-50/50 rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-blue-400 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                      <Send size={15} />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">Send Money</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Instant transfer</div>
                  </div>

                  <div
                    onClick={() => showToast('Opening QR Scanner...')}
                    className="bg-slate-50 hover:bg-rose-50/50 rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-rose-400 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
                      <QrCode size={15} />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">Scan & Pay</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Scan any code</div>
                  </div>

                  <div
                    onClick={() => showToast('Share QR code to receive funds')}
                    className="bg-slate-50 hover:bg-emerald-50/50 rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-emerald-400 transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                      <ArrowDownLeft size={15} />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">Receive</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Show your QR</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-900">Recent Transactions</span>
                    <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
                      View All
                    </span>
                  </div>

                  <div className="flex flex-col divide-y divide-slate-200/80">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${tx.bg} ${tx.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                            {tx.initials}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{tx.name}</div>
                            <div className="text-xs text-slate-400">{tx.type} • {tx.time}</div>
                          </div>
                        </div>

                        <span className={`text-sm font-bold ${tx.isDebit ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col items-center justify-between">
                <div className="w-full text-left">
                  <span className="text-sm font-bold text-slate-900">My Personalized QR</span>
                  <p className="text-xs text-slate-500 mt-0.5">Share with others to receive payments directly.</p>
                </div>

                <div className="my-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                  <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
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
                    <text x="50" y="53" fill="#60a5fa" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">VALTRIX</text>
                  </svg>
                </div>

                <div className="text-xs font-semibold text-slate-700 mb-3 text-center">
                  {displayEmail.split('@')[0]}@valtrix
                </div>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <button
                    onClick={() => showToast('QR Code image downloaded!')}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 transition-colors"
                  >
                    <Download size={13} /> Download
                  </button>

                  <button
                    onClick={() => showToast('QR payment link copied!')}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 transition-colors"
                  >
                    <Share2 size={13} /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {sendModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSendModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0f172a] rounded-3xl border border-blue-500/25 p-7 text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Send Money Instantly</h3>
              <button
                onClick={() => setSendModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSendMoney} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Recipient UPI ID or Phone</label>
                <input
                  type="text"
                  placeholder="recipient@valtrix"
                  value={sendData.to}
                  onChange={(e) => setSendData({ ...sendData, to: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="500"
                  min="1"
                  value={sendData.amount}
                  onChange={(e) => setSendData({ ...sendData, amount: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Transfer Now</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-7 right-7 z-50 bg-slate-900 text-white border border-blue-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
