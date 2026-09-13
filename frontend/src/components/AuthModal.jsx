import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export const AuthModal = ({ isOpen, onClose, defaultTab = 'signin', onToast }) => {
  const [tab, setTab] = useState(defaultTab);
  const [formData, setFormData] = useState({
    name: 'Darshan Agrawal',
    email: 'darshan@valtrix.com',
    password: '••••••••',
    upiId: 'darshan@valtrix'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onToast) {
        onToast(tab === 'signin' ? 'Welcome back, Darshan!' : 'Account created successfully!');
      }
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0f172a] rounded-3xl border border-blue-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(37,99,235,0.2)] overflow-hidden text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-7 py-5 flex items-center justify-between border-b border-white/10">
          <Logo size="small" lightText={true} />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-7 pt-5">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setTab('signin')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === 'signin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-7">
          {tab === 'signup' && (
            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Full Name
              </label>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 transition-colors">
                <User size={16} className="text-blue-400 shrink-0" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                  className="bg-transparent border-none outline-hidden text-white w-full text-sm"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Email or UPI ID
            </label>
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 transition-colors">
              <Mail size={16} className="text-blue-400 shrink-0" />
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@valtrix.com"
                required
                className="bg-transparent border-none outline-hidden text-white w-full text-sm"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Password
            </label>
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 transition-colors">
              <Lock size={16} className="text-blue-400 shrink-0" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="bg-transparent border-none outline-hidden text-white w-full text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all"
          >
            {submitted ? (
              <>
                <CheckCircle2 size={17} /> Processing...
              </>
            ) : (
              <>
                {tab === 'signin' ? 'Sign In to Dashboard' : 'Create Free Account'} <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>End-to-end 256-bit encrypted banking security</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
