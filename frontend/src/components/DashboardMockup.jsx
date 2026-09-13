import React from 'react';
import {
  Home,
  Send,
  QrCode,
  ArrowDownLeft,
  Clock,
  User,
  LogOut,
  Bell,
  ChevronDown,
  Eye,
  Copy,
  Download,
  Share2,
  TrendingUp
} from 'lucide-react';
import Logo from './Logo';

export const DashboardMockup = () => {
  const navItems = [
    { name: 'Home', icon: Home, active: true },
    { name: 'Send Money', icon: Send, active: false },
    { name: 'Scan & Pay', icon: QrCode, active: false },
    { name: 'Receive Money', icon: ArrowDownLeft, active: false },
    { name: 'Transactions', icon: Clock, active: false },
    { name: 'Profile', icon: User, active: false }
  ];

  const transactions = [
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
  ];

  return (
    <div className="w-full max-w-[620px] lg:max-w-full relative mx-auto select-none pointer-events-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4/5 h-3/5 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none -z-10" />

      <div className="relative z-10 bg-[#090d16] rounded-2xl p-2 sm:p-2.5 pb-3 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.1)]">
        <div className="bg-slate-50 rounded-xl overflow-hidden flex">
          <aside className="w-[125px] sm:w-[145px] shrink-0 bg-[#0c1527] text-slate-400 p-3 sm:p-3.5 flex flex-col justify-between border-r border-white/5">
            <div>
              <div className="pb-3 border-b border-white/10">
                <Logo size="small" lightText={true} showTagline={true} />
              </div>

              <div className="mt-3 flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.name}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-left ${
                        item.active
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'text-slate-400 font-medium'
                      }`}
                    >
                      <Icon size={13} className={item.active ? 'text-white' : 'text-slate-400'} />
                      <span className="truncate">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 font-medium">
              <LogOut size={13} />
              <span>Logout</span>
            </div>
          </aside>

          <main className="flex-1 min-w-0 p-3 sm:p-4 bg-slate-50 overflow-hidden flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-tight truncate">
                  Good evening, Darshan
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Here's your account summary.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold text-slate-800 shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    D
                  </div>
                  <span className="hidden sm:inline">Darshan Agrawal</span>
                  <span className="sm:hidden">Darshan</span>
                  <ChevronDown size={11} className="text-slate-400" />
                </div>

                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center relative shadow-2xs">
                  <Bell size={12} className="text-slate-600" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
              <div className="md:col-span-7 flex flex-col gap-2.5">
                <div className="bg-gradient-to-br from-[#0d172e] to-[#152243] rounded-xl p-3 text-white border border-blue-500/25 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                      Total Balance
                    </span>
                    <div className="text-slate-400">
                      <Eye size={13} />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg sm:text-xl font-extrabold tracking-tight">
                      ₹25,480.00
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                      <TrendingUp size={9} /> + ₹2,340 this month
                    </span>
                  </div>

                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2.5 pt-2 border-t border-white/10 text-[9px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <span>UPI ID:</span>
                      <strong className="text-slate-200">darshan@valtrix</strong>
                      <Copy size={10} className="text-blue-400 ml-0.5" />
                    </div>

                    <div className="flex items-center gap-1">
                      <span>Acc:</span>
                      <strong className="text-slate-200">XXXX 4921</strong>
                      <Copy size={10} className="text-blue-400 ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-2xs">
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                      <Send size={12} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-900 leading-tight">Send Money</div>
                    <div className="text-[8.5px] text-slate-500 leading-tight mt-0.5">Send instantly.</div>
                  </div>

                  <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-2xs">
                    <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-500 flex items-center justify-center mb-1.5">
                      <QrCode size={12} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-900 leading-tight">Scan & Pay</div>
                    <div className="text-[8.5px] text-slate-500 leading-tight mt-0.5">Scan any QR.</div>
                  </div>

                  <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-2xs">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                      <ArrowDownLeft size={12} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-900 leading-tight">Receive Money</div>
                    <div className="text-[8.5px] text-slate-500 leading-tight mt-0.5">Get paid easily.</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10.5px] font-bold text-slate-900">Recent Transactions</span>
                    <span className="text-[9.5px] font-semibold text-blue-600">
                      View All →
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-b-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className={`w-5 h-5 rounded-full ${tx.bg} ${tx.text} flex items-center justify-center text-[8.5px] font-bold shrink-0`}>
                            {tx.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[9.5px] font-semibold text-slate-800 leading-none truncate">{tx.name}</div>
                            <div className="text-[7.5px] text-slate-400 mt-0.5">{tx.time}</div>
                          </div>
                        </div>
                        <span className={`text-[9.5px] font-bold shrink-0 ${tx.isDebit ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-col items-center justify-between">
                <div className="w-full text-left">
                  <span className="text-[11px] font-bold text-slate-900">My QR Code</span>
                </div>

                <div className="my-2 p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
                  <svg width="98" height="98" viewBox="0 0 100 100" fill="none">
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
                    <rect x="38" y="38" width="24" height="24" rx="5" fill="#2563eb" />
                    <path d="M43 44L49 56H46L43 47L43 44Z" fill="#ffffff" />
                    <path d="M57 44L51 56H48L54 44H57Z" fill="#93c5fd" />
                  </svg>
                </div>

                <div className="text-[9.5px] font-medium text-slate-500 mb-2">
                  darshan@valtrix
                </div>

                <div className="grid grid-cols-2 gap-1.5 w-full">
                  <div className="flex items-center justify-center gap-1 py-1.5 rounded-md border border-slate-300 text-[9.5px] font-semibold text-slate-800 bg-white">
                    <Download size={10} /> Download
                  </div>

                  <div className="flex items-center justify-center gap-1 py-1.5 rounded-md border border-slate-300 text-[9.5px] font-semibold text-slate-800 bg-white">
                    <Share2 size={10} /> Share
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-center -mt-0.5 relative z-0">
        <div className="w-20 h-10 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-400 shadow-inner" />
        <div className="w-44 h-2.5 bg-gradient-to-b from-slate-300 to-slate-500 rounded-b-xl shadow-lg" />
      </div>
    </div>
  );
};

export default DashboardMockup;
