import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Zap, Shield, BarChart3 } from 'lucide-react';
import DashboardMockup from './DashboardMockup';

export const HeroSection = ({ onOpenDemo }) => {
  return (
    <section
      id="home"
      className="relative bg-[#070d1e] min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden flex items-center"
    >
      <div className="absolute -top-24 -right-10 w-[550px] h-[550px] rounded-full bg-blue-600/20 blur-[90px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -left-10 w-[450px] h-[450px] rounded-full bg-sky-400/10 blur-[90px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none -z-10" />

      <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)] mb-6">
              <span className="text-[11px] font-bold tracking-[0.14em] text-blue-400">FAST</span>
              <span className="w-1 h-1 rounded-full bg-blue-400/40" />
              <span className="text-[11px] font-bold tracking-[0.14em] text-blue-400">SECURE</span>
              <span className="w-1 h-1 rounded-full bg-blue-400/40" />
              <span className="text-[11px] font-bold tracking-[0.14em] text-blue-400">SIMPLE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.08] tracking-tight text-white mb-5">
              Your Money. <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Your Control.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg mb-8">
              Valtrix is a modern, secure and simple platform to send money, receive payments, scan & pay,
              and manage your transactions — all in one place.
            </p>

            <div className="flex items-center flex-wrap gap-4 mb-10 w-full sm:w-auto">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_10px_28px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight size={17} />
              </Link>

              <button
                onClick={onOpenDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-[15px] font-semibold border border-white/15 hover:border-blue-500/50 backdrop-blur-sm transition-all"
              >
                <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
                  <Play size={10} fill="#ffffff" className="ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                  <Zap size={15} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Simple</div>
                  <div className="text-[10.5px] text-slate-400">for Everyone</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                  <Shield size={15} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Secure</div>
                  <div className="text-[10.5px] text-slate-400">by Design</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                  <BarChart3 size={15} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Built for</div>
                  <div className="text-[10.5px] text-slate-400">a Smarter Tomorrow</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 w-full min-w-0 flex justify-center lg:justify-end">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
