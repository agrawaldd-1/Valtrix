import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  X,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Send,
  RefreshCw,
  ChevronRight,
  Wallet,
  Calendar,
  Hash,
  ShieldCheck,
  Lock,
  LogOut,
  Home,
} from 'lucide-react';
import Logo from '../components/Logo';
import { getAllTransactionsApi, fetchTransactionApi } from '../services/transactionServices.js';

// ─── helpers ────────────────────────────────────────────────────────────────

const formatCurrency = (val) =>
  '\u20b9' + Number(val ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDate = (dateStr) =>
  new Date(dateStr || Date.now()).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatDateShort = (dateStr) =>
  new Date(dateStr || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const statusConfig = {
  Success: { color: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
  Pending: { color: 'text-amber-400', border: 'border-amber-500/30', icon: Clock },
  Failed: { color: 'text-rose-400', border: 'border-rose-500/30', icon: AlertCircle },
};

const mapTx = (tx, currentUserId) => {
  const isDebit = String(tx.sender?._id || tx.sender) === String(currentUserId);
  const otherParty = isDebit ? tx.receiver : tx.sender;
  const otherName = otherParty?.fullname || (isDebit ? 'Transferred' : 'Received');
  return {
    _raw: tx,
    id: tx._id,
    transactionId: tx.transactionId,
    name: otherName,
    type: isDebit ? 'Instant Transfer' : 'Account Credit',
    amount: Number(tx.amount),
    formattedAmount: `${isDebit ? '\u2212' : '+'} ${formatCurrency(tx.amount)}`,
    isDebit,
    initials: (otherName || 'TX').slice(0, 2).toUpperCase(),
    status: tx.status || 'Success',
    createdAt: tx.createdAt,
    sender: tx.sender,
    receiver: tx.receiver,
  };
};

// ─── Detail Drawer ──────────────────────────────────────────────────────────

function TransactionDrawer({ tx, detailData, detailLoading, onClose }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard?.writeText(String(text));
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ value, label }) => (
    <button
      onClick={() => handleCopy(value, label)}
      className="p-1 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors cursor-pointer"
      title={'Copy ' + label}
    >
      {copied === label ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
    </button>
  );

  const raw = detailData || tx?._raw;
  const cfg = statusConfig[tx?.status] || statusConfig.Success;
  const StatusIcon = cfg.icon;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0b1329] border-l border-blue-500/20 z-50 flex flex-col shadow-2xl overflow-y-auto" style={{ animation: 'slideInRight 0.25s ease-out' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#0b1329] z-10">
          <div>
            <h2 className="text-base font-bold text-white">Transaction Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">Full breakdown of this transaction</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {detailLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-400" />
            <p className="text-sm">Loading details...</p>
          </div>
        ) : (
          <div className="flex-1 px-6 py-6 space-y-5">

            {/* Amount Hero */}
            <div className={`rounded-2xl p-6 text-center border ${tx?.isDebit ? 'bg-rose-500/8 border-rose-500/20' : 'bg-emerald-500/8 border-emerald-500/20'}`}>
              <div className={`text-4xl font-black font-mono mb-1 ${tx?.isDebit ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tx?.formattedAmount}
              </div>
              <p className="text-sm text-slate-400">{tx?.type}</p>
              <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.border}`}>
                <StatusIcon size={13} />
                {tx?.status}
              </div>
            </div>

            {/* Transaction ID */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Hash size={13} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Transaction ID</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-mono text-white break-all">{tx?.transactionId || '\u2014'}</span>
                {tx?.transactionId && <CopyBtn value={tx.transactionId} label="Txn ID" />}
              </div>
            </div>

            {/* Timestamp */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={13} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Date & Time</span>
              </div>
              <span className="text-sm text-white font-medium">{formatDate(tx?.createdAt)}</span>
            </div>

            {/* Sender */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpRight size={13} className="text-rose-400" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Sender</span>
              </div>
              {raw?.sender ? (
                <div className="space-y-2.5">
                  <InfoRow label="Name" value={raw.sender.fullname} onCopy={(v) => handleCopy(v, 'Sender Name')} copied={copied === 'Sender Name'} />
                  {raw.sender.upiId && <InfoRow label="UPI ID" value={raw.sender.upiId} mono onCopy={(v) => handleCopy(v, 'Sender UPI')} copied={copied === 'Sender UPI'} highlight />}
                  {raw.sender.accountNumber && <InfoRow label="Account" value={raw.sender.accountNumber} mono onCopy={(v) => handleCopy(v, 'Sender Acc')} copied={copied === 'Sender Acc'} />}
                </div>
              ) : <span className="text-sm text-slate-500">{'\u2014'}</span>}
            </div>

            {/* Arrow divider */}
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                <ArrowDownLeft size={14} className="text-blue-400" />
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownLeft size={13} className="text-emerald-400" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Receiver</span>
              </div>
              {raw?.receiver ? (
                <div className="space-y-2.5">
                  <InfoRow label="Name" value={raw.receiver.fullname} onCopy={(v) => handleCopy(v, 'Receiver Name')} copied={copied === 'Receiver Name'} />
                  {raw.receiver.upiId && <InfoRow label="UPI ID" value={raw.receiver.upiId} mono onCopy={(v) => handleCopy(v, 'Receiver UPI')} copied={copied === 'Receiver UPI'} highlight />}
                  {raw.receiver.accountNumber && <InfoRow label="Account" value={raw.receiver.accountNumber} mono onCopy={(v) => handleCopy(v, 'Receiver Acc')} copied={copied === 'Receiver Acc'} />}
                </div>
              ) : <span className="text-sm text-slate-500">{'\u2014'}</span>}
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl p-4">
              <ShieldCheck size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                This transaction is secured with 256-bit SSL encryption and logged immutably on the Valtrix ledger.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function InfoRow({ label, value, mono, highlight, onCopy, copied }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <div className="flex items-center gap-1 min-w-0">
        <span className={`text-sm truncate ${mono ? 'font-mono' : ''} ${highlight ? 'text-blue-300' : 'text-white font-semibold'}`}>
          {value}
        </span>
        <button
          onClick={() => onCopy(value)}
          className="p-1 rounded text-blue-400 hover:text-blue-300 transition-colors cursor-pointer shrink-0"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function Transactions() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const [selectedTx, setSelectedTx] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  const totalCredit = transactions.filter((t) => !t.isDebit).reduce((s, t) => s + t.amount, 0);
  const totalDebit = transactions.filter((t) => t.isDebit).reduce((s, t) => s + t.amount, 0);

  const fetchAll = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');
    getAllTransactionsApi()
      .then((res) => {
        if (res.success && res.transactions) {
          setTransactions(res.transactions.map((tx) => mapTx(tx, currentUser._id)));
        }
      })
      .catch(() => setError('Failed to load transactions. Please try again.'))
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, [currentUser._id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/signin'); return; }
    const isPinVerified = sessionStorage.getItem('isPinVerified');
    if (isPinVerified !== 'true') { navigate('/enter-pin'); return; }
    fetchAll();
  }, [navigate, fetchAll]);

  const openDetail = (tx) => {
    setSelectedTx(tx);
    setDetailData(null);
    setDetailLoading(true);
    fetchTransactionApi(tx.transactionId)
      .then((res) => { if (res.success) setDetailData(res.transaction); })
      .catch(() => {})
      .finally(() => setDetailLoading(false));
  };

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase();
    const matchSearch =
      tx.name.toLowerCase().includes(q) ||
      tx.type.toLowerCase().includes(q) ||
      (tx.transactionId || '').toLowerCase().includes(q);
    if (filter === 'debit') return matchSearch && tx.isDebit;
    if (filter === 'credit') return matchSearch && !tx.isDebit;
    return matchSearch;
  });

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

  const initial = (currentUser?.fullname || 'V').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#070d1e] text-white font-sans flex flex-col">

      {/* ── Navbar ── */}
      <header className="bg-[#0b1329] border-b border-blue-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <Link to="/" className="flex items-center">
          <Logo lightText={true} />
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchAll(true)}
            title="Refresh"
            className={'p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all' + (refreshing ? ' animate-spin text-blue-400' : '')}
          >
            <RefreshCw size={15} />
          </button>

          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-[#101b38] hover:bg-[#152347] border border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-white cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
              {initial}
            </div>
            <span className="max-w-[120px] truncate">{currentUser?.fullname || 'User'}</span>
          </div>

          <button
            onClick={handleLock}
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

      {/* ── Page Body ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-pointer">
            <Home size={12} />
            <span>Dashboard</span>
          </button>
          <ChevronRight size={12} />
          <span className="text-slate-300 font-medium">All Transactions</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-blue-400" />
              </div>
              Transaction History
            </h1>
            <p className="text-sm text-slate-400 mt-1 ml-14">
              Complete ledger of all your inbound credits and outbound transfers.
            </p>
          </div>

          <button
            onClick={() => navigate('/send-money')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/25 hover:-translate-y-0.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Send size={15} />
            Send Money
          </button>
        </div>

        {/* Summary Cards */}
        {!loading && transactions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0b1329] rounded-2xl p-5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={14} className="text-blue-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Transactions</span>
              </div>
              <div className="text-2xl font-black text-white">{transactions.length}</div>
            </div>
            <div className="bg-[#0b1329] rounded-2xl p-5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownLeft size={14} className="text-emerald-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Credits</span>
              </div>
              <div className="text-2xl font-black text-emerald-400">{formatCurrency(totalCredit)}</div>
            </div>
            <div className="bg-[#0b1329] rounded-2xl p-5 border border-rose-500/20">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight size={14} className="text-rose-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Debits</span>
              </div>
              <div className="text-2xl font-black text-rose-400">{formatCurrency(totalDebit)}</div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0b1329] border border-blue-500/20 rounded-xl px-4 py-2.5 flex-1">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, type, or Transaction ID..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-full"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#0b1329] border border-blue-500/20 p-1 rounded-xl self-start sm:self-auto">
            {[
              { key: 'all', label: 'All (' + transactions.length + ')' },
              { key: 'debit', label: 'Debits (-)' },
              { key: 'credit', label: 'Credits (+)' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ' + (
                  filter === key
                    ? key === 'debit' ? 'bg-rose-600 text-white shadow-sm'
                    : key === 'credit' ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-[#0b1329] rounded-2xl border border-blue-500/20 overflow-hidden">
          {loading ? (
            <div className="p-16 flex flex-col items-center gap-4 text-slate-400">
              <Loader2 size={36} className="animate-spin text-blue-400" />
              <p className="text-sm font-medium">Loading your transactions...</p>
            </div>
          ) : error ? (
            <div className="p-16 flex flex-col items-center gap-3 text-slate-400">
              <AlertCircle size={36} className="text-rose-400" />
              <p className="text-sm font-semibold text-slate-300">{error}</p>
              <button
                onClick={() => fetchAll()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center gap-3 text-slate-400">
              <Clock size={36} className="text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No transactions found</p>
              <p className="text-xs text-slate-500">
                {search ? 'Try a different search term or clear filters.' : 'Your transaction history will appear here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold bg-white/3">
                <div className="col-span-5">Party</div>
                <div className="col-span-3 hidden sm:block">Transaction ID</div>
                <div className="col-span-2 hidden sm:block">Date</div>
                <div className="col-span-7 sm:col-span-2 text-right">Amount</div>
              </div>

              {filtered.map((tx) => {
                const cfg = statusConfig[tx.status] || statusConfig.Success;
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={tx.id}
                    onClick={() => openDetail(tx)}
                    className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-white/4 transition-all cursor-pointer group items-center"
                  >
                    {/* Avatar + Name */}
                    <div className="col-span-7 sm:col-span-5 flex items-center gap-3 min-w-0">
                      <div className={'w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ' + (tx.isDebit ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400')}>
                        {tx.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{tx.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-400">{tx.type}</span>
                          <span className={'inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ' + cfg.color + ' ' + cfg.border}>
                            <StatusIcon size={9} />
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Txn ID */}
                    <div className="col-span-3 hidden sm:flex items-center">
                      <span className="text-xs font-mono text-slate-500 truncate">{tx.transactionId}</span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 hidden sm:flex items-center">
                      <span className="text-xs text-slate-400">{formatDateShort(tx.createdAt)}</span>
                    </div>

                    {/* Amount */}
                    <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-2">
                      <span className={'text-sm font-bold font-mono ' + (tx.isDebit ? 'text-rose-400' : 'text-emerald-400')}>
                        {tx.formattedAmount}
                      </span>
                      <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-slate-500 pb-2">
            Showing <span className="text-slate-300 font-semibold">{filtered.length}</span> of{' '}
            <span className="text-slate-300 font-semibold">{transactions.length}</span> transactions
          </p>
        )}
      </main>

      {/* ── Detail Drawer ── */}
      {selectedTx && (
        <TransactionDrawer
          tx={selectedTx}
          detailData={detailData}
          detailLoading={detailLoading}
          onClose={() => { setSelectedTx(null); setDetailData(null); }}
        />
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
