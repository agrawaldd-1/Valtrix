import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Delete
} from "lucide-react";
import Logo from "../components/Logo";
import { verifyPin, getProfile } from "../services/authServices.js";

export const EnterPin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // If already verified in this session, proceed directly to dashboard
    if (sessionStorage.getItem("isPinVerified") === "true") {
      navigate("/dashboard");
      return;
    }

    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error(e);
      }
    }

    // Fetch fresh profile to have latest enterpin & details
    getProfile(token)
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        }
      })
      .catch((err) => {
        console.error(err);
      });

    // Auto-focus first input
    setTimeout(() => {
      inputRefs[0]?.current?.focus();
    }, 100);
  }, [navigate]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...pinDigits];
    newDigits[index] = value.slice(-1);
    setPinDigits(newDigits);
    setError("");

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }

    // Check if all 4 digits filled
    const completePin = newDigits.join("");
    if (completePin.length === 4) {
      verifyEnteredPin(completePin);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setPinDigits(digits);
      inputRefs[3]?.current?.focus();
      verifyEnteredPin(pastedData);
    }
  };

  // Virtual Keypad press
  const handleKeypadPress = (num) => {
    const emptyIndex = pinDigits.findIndex((d) => d === "");
    if (emptyIndex !== -1) {
      handleDigitChange(emptyIndex, String(num));
    }
  };

  const handleKeypadBackspace = () => {
    const lastFilledIndex = [...pinDigits].reverse().findIndex((d) => d !== "");
    if (lastFilledIndex !== -1) {
      const realIndex = 3 - lastFilledIndex;
      const newDigits = [...pinDigits];
      newDigits[realIndex] = "";
      setPinDigits(newDigits);
      inputRefs[realIndex]?.current?.focus();
      setError("");
    }
  };

  const handleKeypadClear = () => {
    setPinDigits(["", "", "", ""]);
    setError("");
    inputRefs[0]?.current?.focus();
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const verifyEnteredPin = async (pinToVerify) => {
    const pin = pinToVerify || pinDigits.join("");
    if (pin.length !== 4) {
      setError("Please enter your complete 4-digit Security PIN.");
      triggerShake();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let isSuccess = false;

      // Try backend verification
      try {
        const res = await verifyPin(pin, token);
        if (res.success) {
          isSuccess = true;
        }
      } catch (apiErr) {
        // Fallback to local cached enterpin verification if offline or route error
        if (user?.enterpin && Number(user.enterpin) === Number(pin)) {
          isSuccess = true;
        } else {
          throw apiErr;
        }
      }

      if (isSuccess) {
        setSuccess(true);
        sessionStorage.setItem("isPinVerified", "true");
        setTimeout(() => {
          navigate("/dashboard");
        }, 400);
      }
    } catch (err) {
      triggerShake();
      setError(
        err.response?.data?.message ||
        "Incorrect Security PIN. Please try again."
      );
      setPinDigits(["", "", "", ""]);
      inputRefs[0]?.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("isPinVerified");
    navigate("/signin");
  };

  const displayName = user?.fullname || "Valtrix User";
  const displayEmail = user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#070d1e] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/15 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center">
          <Logo lightText={true} />
        </Link>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out / Switch</span>
        </button>
      </header>

      {/* Main PIN Verification Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div
          className={`w-full max-w-[420px] bg-[#0c1527] rounded-3xl border border-blue-500/25 p-7 sm:p-8 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(37,99,235,0.2)] transition-transform ${
            shake ? "animate-bounce" : ""
          }`}
        >
          {/* User Avatar Badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 border border-blue-400/30">
                {initial}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                <KeyRound size={13} />
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome, {displayName.split(" ")[0]}!
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">
              {displayEmail}
            </p>

            <div className="mt-2 text-xs font-medium text-slate-400">
              Enter your <span className="text-blue-400 font-semibold">4-Digit Security PIN</span> to unlock your dashboard.
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={15} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>PIN Verified! Unlocking Dashboard...</span>
            </div>
          )}

          {/* 4 Digit PIN Inputs */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyEnteredPin();
            }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-2" onPaste={handlePaste}>
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type={showPin ? "text" : "password"}
                  maxLength={1}
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={loading || success}
                  className={`w-13 h-14 sm:w-14 sm:h-15 text-center text-2xl font-bold rounded-2xl border transition-all outline-none ${
                    digit
                      ? "border-blue-500 bg-blue-500/15 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]"
                      : "border-white/10 bg-white/5 text-white focus:border-blue-400 focus:bg-white/10"
                  }`}
                />
              ))}
            </div>

            {/* Toggle show/hide PIN */}
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPin ? "Hide PIN" : "Show PIN"}</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success || pinDigits.some((d) => !d)}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {loading ? (
                <span>Verifying PIN...</span>
              ) : success ? (
                <span>Unlocked!</span>
              ) : (
                <>
                  <span>Unlock Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Virtual Numeric Keypad for Mobile & Touch */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  disabled={loading || success}
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-blue-600/30 border border-white/5 text-base font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={handleKeypadClear}
                disabled={loading || success}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 border border-white/5 transition-all cursor-pointer disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => handleKeypadPress(0)}
                disabled={loading || success}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-blue-600/30 border border-white/5 text-base font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleKeypadBackspace}
                disabled={loading || success}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
              >
                <Delete size={17} />
              </button>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Valtrix Multi-Factor Banking Security</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 relative z-10">
        © 2026 Valtrix. All rights reserved.
      </footer>
    </div>
  );
};

export default EnterPin;
