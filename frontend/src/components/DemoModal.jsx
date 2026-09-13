import React, { useState } from 'react';
import { X, Play, ArrowRight, Shield, QrCode } from 'lucide-react';

export const DemoModal = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const demoFeatures = [
    {
      title: '1. Scan & Pay Any QR in 0.5s',
      desc: 'Point your camera at any BharatQR, UPI QR, or merchant code to transfer funds instantly with zero failed transactions.',
      tag: 'Zero Latency',
      visual: (
        <div className="bg-[#0b1329] p-6 rounded-2xl text-center border border-blue-500/30">
          <div className="inline-flex p-4 bg-blue-600/15 rounded-2xl mb-3 text-blue-400">
            <QrCode size={44} />
          </div>
          <div className="text-sm font-semibold text-white">Instant Auto-Detection</div>
          <div className="text-xs text-slate-400 mt-1">darshan@valtrix • Verified Merchant</div>
        </div>
      )
    },
    {
      title: '2. Unified Bank Accounts in One Dashboard',
      desc: 'Connect multiple bank accounts, view real-time balances, and track money inflows and outflows with pinpoint clarity.',
      tag: 'Smart Analytics',
      visual: (
        <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-500/30">
          <div className="flex justify-between mb-3">
            <span className="text-slate-400 text-xs">Current Balance</span>
            <span className="text-emerald-400 text-xs font-semibold">+12.4%</span>
          </div>
          <div className="text-2xl font-bold text-white">₹25,480.00</div>
          <div className="h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
            <div className="w-3/4 h-full bg-blue-600" />
          </div>
        </div>
      )
    },
    {
      title: '3. Military-Grade 256-Bit Protection',
      desc: 'Every payment is protected by hardware security module authentication, multi-factor verification, and instant fraud alerts.',
      tag: 'Bank Security',
      visual: (
        <div className="bg-[#0b1329] p-6 rounded-2xl text-center border border-blue-500/30">
          <div className="inline-flex p-4 bg-emerald-500/15 rounded-2xl mb-3 text-emerald-400">
            <Shield size={44} />
          </div>
          <div className="text-sm font-semibold text-white">Tokenized & Encrypted</div>
          <div className="text-xs text-slate-400 mt-1">Certified by RBI & NPCI standards</div>
        </div>
      )
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0f172a] rounded-3xl border border-blue-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(37,99,235,0.2)] overflow-hidden text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600/20 rounded-lg text-blue-400">
              <Play size={15} />
            </span>
            <span className="font-bold text-sm">Valtrix Platform Demo</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {demoFeatures[activeStep].visual}

          <div className="mt-5">
            <div className="text-[10.5px] font-bold text-blue-400 uppercase tracking-wider mb-1">
              {demoFeatures[activeStep].tag}
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">
              {demoFeatures[activeStep].title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {demoFeatures[activeStep].desc}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <div className="flex gap-2">
              {demoFeatures.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`h-2 rounded-full transition-all ${
                    activeStep === i ? 'w-6 bg-blue-600' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (activeStep < demoFeatures.length - 1) {
                  setActiveStep(activeStep + 1);
                } else {
                  onClose();
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>{activeStep < demoFeatures.length - 1 ? 'Next Step' : 'Get Started Now'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
