import React from 'react';
import {
  ShieldCheck,
  Smartphone,
  Zap,
  Send,
  ArrowDownLeft,
  QrCode,
  Eye,
  Bell,
  Copy,
  TrendingUp,
  Download,
  Share2,
  Home,
  Clock,
  User,
  Scan
} from 'lucide-react';
import Logo from './Logo';

export const MobileShowcaseSection = () => {
  const mobileTransactions = [
    {
      id: 1,
      name: 'Rahul Sharma',
      type: 'UPI/QR/Account',
      amount: '- ₹2,000',
      time: '2:33 PM',
      isDebit: true,
      initials: 'RS',
      bg: 'bg-orange-500/15',
      text: 'text-orange-500'
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
    }
  ];

  const features = [
    {
      title: 'Secure & Reliable',
      desc: 'Your data is protected with industry-standard security.',
      icon: ShieldCheck
    },
    {
      title: 'Access Anywhere',
      desc: 'Use Valtrix on web and mobile, whenever you need.',
      icon: Smartphone
    },
    {
      title: 'Fast Transactions',
      desc: 'Experience instant and seamless payments.',
      icon: Zap
    }
  ];

  return (
    <section id="mobile-app" className="bg-white py-20 sm:py-24 relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center gap-6 relative select-none pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none -z-10" />

            <div className="w-[305px] h-[610px] bg-[#090d16] rounded-[44px] p-2.5 shadow-[0_25px_65px_-12px_rgba(15,23,42,0.35),0_0_0_1px_rgba(15,23,42,0.1),inset_0_0_0_2px_rgba(255,255,255,0.2)] relative shrink-0">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-end pr-2">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
              </div>

              <div className="w-full h-full bg-[#070d1e] rounded-[34px] overflow-hidden flex flex-col text-white pt-6 pb-2 px-3.5 relative">
                <div className="flex items-center justify-between mt-2 mb-3 px-1">
                  <Logo size="small" lightText={true} showTagline={true} />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-[10px] font-bold text-blue-200">
                      D
                    </div>
                    <div className="relative">
                      <Bell size={14} className="text-slate-300" />
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e1935] rounded-2xl p-3 border border-blue-500/25 shadow-sm mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] uppercase tracking-wider text-slate-400 font-medium">
                      Total Balance
                    </span>
                    <div className="text-slate-400">
                      <Eye size={12} />
                    </div>
                  </div>

                  <div className="text-[21px] font-extrabold tracking-tight text-white mt-0.5">
                    ₹25,480.00
                  </div>

                  <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400 mt-0.5">
                    <TrendingUp size={9} /> + ₹2,340 this month
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10 text-[8.5px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <span>UPI ID:</span>
                      <span className="text-slate-200 font-medium">darshan@...</span>
                      <Copy size={10} className="text-blue-400" />
                    </div>

                    <div className="flex items-center gap-1">
                      <span>Acc:</span>
                      <span className="text-slate-200 font-medium">...4821</span>
                      <Copy size={10} className="text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded-xl py-2 px-1 flex flex-col items-center justify-center shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-1">
                      <Send size={13} />
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-900 leading-tight">Send Money</span>
                  </div>

                  <div className="bg-white rounded-xl py-2 px-1 flex flex-col items-center justify-center shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-1">
                      <Scan size={13} />
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-900 leading-tight">Scan & Pay</span>
                  </div>

                  <div className="bg-white rounded-xl py-2 px-1 flex flex-col items-center justify-center shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-1">
                      <ArrowDownLeft size={13} />
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-900 leading-tight">Receive Money</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-2.5 shadow-2xs text-slate-900 mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-900">Recent Transactions</span>
                    <span className="text-[9px] font-semibold text-blue-600">View All →</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {mobileTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between py-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-full ${tx.bg} ${tx.text} flex items-center justify-center text-[8px] font-bold shrink-0`}>
                            {tx.initials}
                          </div>
                          <div>
                            <div className="text-[9px] font-semibold text-slate-800 leading-none">{tx.name}</div>
                            <div className="text-[7.5px] text-slate-400 mt-0.5">{tx.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-[9px] font-bold ${tx.isDebit ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {tx.amount}
                          </div>
                          <div className="text-[7.5px] text-slate-400">{tx.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto bg-white rounded-xl p-1.5 flex items-center justify-around shadow-xs text-slate-600">
                  <div className="flex flex-col items-center gap-0.5 text-blue-600">
                    <Home size={13} />
                    <span className="text-[8px] font-bold">Home</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <Clock size={13} />
                    <span className="text-[8px] font-medium">History</span>
                  </div>

                  <div className="flex flex-col items-center -mt-4">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.4)] border-2 border-white">
                      <QrCode size={16} />
                    </div>
                    <span className="text-[8px] font-bold text-blue-600 mt-0.5">QR Pay</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <User size={13} />
                    <span className="text-[8px] font-medium">Profile</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[185px] bg-white rounded-2xl p-3.5 border border-slate-200 shadow-md flex flex-col items-center justify-between shrink-0">
              <div className="w-full text-left">
                <span className="text-xs font-bold text-slate-900">My QR Code</span>
              </div>

              <div className="my-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
                <svg width="105" height="105" viewBox="0 0 100 100" fill="none">
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

              <div className="text-[10px] font-medium text-slate-500 mb-2.5 text-center">
                darshan@valtrix
              </div>

              <div className="grid grid-cols-2 gap-1.5 w-full">
                <div className="flex items-center justify-center gap-1 py-1.5 rounded-md border border-slate-300 text-[10px] font-semibold text-slate-800 bg-white">
                  <Download size={11} /> Download
                </div>

                <div className="flex items-center justify-center gap-1 py-1.5 rounded-md border border-slate-300 text-[10px] font-semibold text-slate-800 bg-white">
                  <Share2 size={11} /> Share
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 inline-block mb-2.5">
              ALWAYS WITH YOU
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              Payments, Anytime <br /> Anywhere
            </h2>

            <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-lg">
              Access your money, make payments and stay in control — across all your devices.
            </p>

            <div className="flex items-center flex-wrap gap-3.5 mb-10">
              <div className="flex items-center gap-2.5 bg-black text-white px-4 py-2.5 rounded-xl border border-slate-800 shadow-md">
                <svg width="22" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3.6 1.8C3.3 2.1 3.1 2.6 3.1 3.2V20.8C3.1 21.4 3.3 21.9 3.6 22.2L12.5 13.3L3.6 1.8Z" fill="#2196F3"/>
                  <path d="M16.4 9.4L13.5 12.3L12.5 13.3L16.4 17.2L20.8 14.7C21.9 14.1 21.9 12.5 20.8 11.9L16.4 9.4Z" fill="#FFC107"/>
                  <path d="M3.6 22.2C4.1 22.5 4.8 22.4 5.5 22L16.4 15.8L12.5 11.9L3.6 22.2Z" fill="#4CAF50"/>
                  <path d="M3.6 1.8L12.5 10.7L16.4 6.8L5.5 0.6C4.8 0.2 4.1 0.1 3.6 0.4V1.8Z" fill="#F44336"/>
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase text-slate-400 tracking-wider">GET IT ON</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-black text-white px-4 py-2.5 rounded-xl border border-slate-800 shadow-md">
                <svg width="20" height="22" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.93-2.84-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.02-.5 2.63-1.25z"/>
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase text-slate-400 tracking-wider">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcaseSection;
