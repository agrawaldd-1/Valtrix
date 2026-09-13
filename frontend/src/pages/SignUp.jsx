import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  CreditCard,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { registerUser } from "../services/authServices.js";
import Logo from "../components/Logo";

export const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    pin: "",
    paymentPin: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showPaymentPin, setShowPaymentPin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await registerUser(formData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-white flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/15 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none" />

      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center">
          <Logo lightText={true} />
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 transition-all"
        >
          <ArrowLeft size={15} />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-[460px] bg-[#0c1527] rounded-3xl border border-blue-500/25 p-8 sm:p-9 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(37,99,235,0.2)]">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Your Account
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Start managing your money and transactions securely.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Account created successfully! Redirecting to Sign In...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  First Name
                </label>

                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-blue-500 transition-colors">
                  <User size={16} className="text-blue-400 shrink-0" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    autoComplete="given-name"
                    required
                    className="bg-transparent border-none outline-hidden text-white w-full text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Last Name
                </label>

                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-blue-500 transition-colors">
                  <User size={16} className="text-blue-400 shrink-0" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    autoComplete="family-name"
                    required
                    className="bg-transparent border-none outline-hidden text-white w-full text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>

              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-blue-500 transition-colors">
                <Mail size={16} className="text-blue-400 shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="bg-transparent border-none outline-hidden text-white w-full text-sm placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>

              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-blue-500 transition-colors">
                <Lock size={16} className="text-blue-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                  className="bg-transparent border-none outline-hidden text-white w-full text-sm placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security PIN
              </label>

              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-blue-500 transition-colors">
                <KeyRound size={16} className="text-blue-400 shrink-0" />
                <input
                  type={showPin ? "text" : "password"}
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="Enter 4-digit PIN"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  className="bg-transparent border-none outline-hidden text-white w-full text-sm placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Payment PIN
              </label>

              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-blue-500 transition-colors">
                <CreditCard size={16} className="text-blue-400 shrink-0" />
                <input
                  type={showPaymentPin ? "text" : "password"}
                  name="paymentPin"
                  value={formData.paymentPin}
                  onChange={handleChange}
                  placeholder="Enter 4-digit payment PIN"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  className="bg-transparent border-none outline-hidden text-white w-full text-sm placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPaymentPin(!showPaymentPin)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPaymentPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Encrypted with bank-grade security protocols</span>
          </div>
        </div>
      </main>

      <footer className="py-5 text-center text-xs text-slate-500 relative z-10">
        © 2026 Valtrix. All rights reserved.
      </footer>
    </div>
  );
};

export default SignUp;