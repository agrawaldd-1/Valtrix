import React from 'react';
import { Send, Scan, Download, FileText } from 'lucide-react';

export const FeaturesSection = ({ onToast }) => {
  const features = [
    {
      id: 'send',
      title: 'Send Money Instantly',
      description: 'Transfer money using UPI ID, account number or QR code.',
      icon: Send
    },
    {
      id: 'scan',
      title: 'Scan & Pay',
      description: 'Scan a QR code to make instant payments.',
      icon: Scan
    },
    {
      id: 'receive',
      title: 'Receive Money',
      description: 'Share your QR code and get paid easily.',
      icon: Download
    },
    {
      id: 'track',
      title: 'Track Transactions',
      description: 'Keep a complete history of all your payments.',
      icon: FileText
    }
  ];

  return (
    <section id="features" className="bg-white py-20 sm:py-24 relative">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 inline-block mb-2">
            WHY CHOOSE VALTRIX
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Built for Your Everyday Payments
          </h2>

          <p className="text-base text-slate-500 leading-relaxed">
            Everything you need to send, receive and manage your money — in one seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => onToast && onToast(`${feature.title} selected`)}
                className="bg-white rounded-2xl p-7 border border-slate-150 hover:border-blue-300 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.12)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6">
                  <Icon size={24} strokeWidth={2.2} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="mt-auto text-xs font-semibold text-blue-600 inline-flex items-center gap-1 group">
                  <span>Learn more</span>
                  <span className="text-sm transition-transform duration-200">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
