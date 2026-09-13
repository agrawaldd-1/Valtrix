import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { loginUser } from "../services/authServices.js";
import Logo from "../components/Logo";

export const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser(formData);

      if (response.success) {
        localStorage.setItem("token", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password. Please try again."
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
        <div className="w-full max-w-[440px] bg-[#0c1527] rounded-3xl border border-blue-500/25 p-8 sm:p-9 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(37,99,235,0.2)]">
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign In to Valtrix
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Enter your credentials to access your financial dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address or UPI ID
              </label>

              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-blue-500 transition-colors">
                <Mail
                  size={16}
                  className="text-blue-400 shrink-0"
                />

                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="bg-transparent border-none outline-hidden text-white w-full text-sm placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>

                <a
                  href="#forgot"
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot?
                </a>
              </div>

              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-blue-500 transition-colors">
                <Lock
                  size={16}
                  className="text-blue-400 shrink-0"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>256-bit SSL encrypted secure banking gateway</span>
          </div>
        </div>
      </main>

      <footer className="py-5 text-center text-xs text-slate-500 relative z-10">
        © 2026 Valtrix. All rights reserved.
      </footer>
    </div>
  );
};

export default SignIn;