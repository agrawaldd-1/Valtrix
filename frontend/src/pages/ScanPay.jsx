import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  QrCode,
  ArrowLeft,
  Upload,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Check,
  Send,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  Wallet,
  ArrowRight,
  Share2,
  Sparkles,
  Store,
  FileCheck
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Logo from '../components/Logo';
import MobileNav from '../components/MobileNav';
import { getProfile } from '../services/authServices.js';
import { sendMoneyApi } from '../services/transactionServices.js';

export default function ScanPay() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [scanStep, setScanStep] = useState('upload');
  const [scanImageSrc, setScanImageSrc] = useState(null);
  const [scannedQrData, setScannedQrData] = useState(null);
  const [scanError, setScanError] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const scanFileInputRef = useRef(null);
  const myQrCanvasRef = useRef(null);

  const [payAmount, setPayAmount] = useState('');
  const [paymentPin, setPaymentPin] = useState('');
  const [note, setNote] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState('');
  const [txSuccessData, setTxSuccessData] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchProfile = (token) => {
    setRefreshing(true);
    getProfile(token)
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const isPinVerified = sessionStorage.getItem('isPinVerified');
    if (isPinVerified !== 'true') {
      navigate('/enter-pin');
      return;
    }

    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchProfile(token);
  }, [navigate]);

  const displayName = user?.fullname || 'Valtrix Member';
  const displayUpiId = user?.upiId || `${(user?.email || 'user').split('@')[0]}@valutrix`;
  const displayBalance = user?.balance !== undefined ? Number(user.balance) : 25000;

  const formatCurrency = (val) => {
    return '₹' + Number(val ?? 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const parseUpiQr = (rawText) => {
    try {
      let urlStr = rawText;
      if (rawText.startsWith('upi://')) {
        urlStr = rawText.replace('upi://', 'https://');
      }
      const url = new URL(urlStr);
      const pa = url.searchParams.get('pa') || '';
      const pn = url.searchParams.get('pn') || '';
      const am = url.searchParams.get('am') || '';
      const tn = url.searchParams.get('tn') || '';
      if (pa) {
        return {
          upiId: pa,
          name: decodeURIComponent(pn),
          amount: am,
          note: decodeURIComponent(tn)
        };
      }
    } catch (_) {
      if (rawText.includes('@')) {
        return { upiId: rawText.trim(), name: '', amount: '', note: '' };
      }
    }
    return null;
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setScanError('');
    setScannedQrData(null);
    setPayError('');
    setIsDecoding(true);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target.result;
      setScanImageSrc(src);
      setScanStep('preview');

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        import('jsqr')
          .then(({ default: jsQR }) => {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            setIsDecoding(false);
            if (code && code.data) {
              const parsed = parseUpiQr(code.data);
              if (parsed) {
                setScannedQrData(parsed);
                setPayAmount(parsed.amount || '');
                setNote(parsed.note || (parsed.name ? `Payment to ${parsed.name}` : ''));
                setScanStep('confirm');
              } else {
                setScanError(`QR decoded but does not contain a valid UPI payment format: "${code.data.slice(0, 50)}"`);
              }
            } else {
              setScanError('Could not detect any QR code in this image. Please upload a high-resolution, clear QR code image.');
            }
          })
          .catch(() => {
            setIsDecoding(false);
            setScanError('Failed to load the QR scanner engine. Please try again.');
          });
      };
      img.onerror = () => {
        setIsDecoding(false);
        setScanError('Unable to load this image file. Please choose a valid image.');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleQuickMerchant = (merchant) => {
    setScanError('');
    setPayError('');
    setScannedQrData({
      upiId: merchant.vpa,
      name: merchant.name,
      amount: merchant.amount,
      note: `Payment to ${merchant.name}`
    });
    setPayAmount(merchant.amount);
    setNote(`Payment to ${merchant.name}`);
    setScanStep('confirm');
  };

  const handleDownloadUploadedQr = () => {
    if (!scanImageSrc) return;
    const link = document.createElement('a');
    link.href = scanImageSrc;
    link.download = `Scanned-QR-${scannedQrData?.name || 'UPI'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Scanned QR image downloaded!');
  };

  const handleDownloadMyQr = () => {
    const wrapper = myQrCanvasRef?.current;
    const canvas = wrapper ? wrapper.querySelector('canvas') : null;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `Valtrix-My-QR-${displayName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Your UPI QR code downloaded as PNG!');
    }
  };

  const handleSharePaymentLink = () => {
    const link = `upi://pay?pa=${displayUpiId}&pn=${encodeURIComponent(displayName)}&cu=INR`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      showToast('UPI Payment Link copied to clipboard!');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPayError('');

    if (!scannedQrData?.upiId) {
      setPayError('Payee UPI ID not detected.');
      return;
    }

    const numAmount = Number(payAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setPayError('Please enter a valid transfer amount greater than 0.');
      return;
    }

    if (numAmount > displayBalance) {
      setPayError(`Insufficient balance! Available balance is ${formatCurrency(displayBalance)}.`);
      return;
    }

    if (!paymentPin || paymentPin.length < 4) {
      setPayError('Please enter your 4-digit Payment PIN to authorize.');
      return;
    }

    if (user?.paymentpin && Number(paymentPin) !== Number(user.paymentpin)) {
      setPayError('Incorrect Payment PIN! Please enter the 4-digit PIN configured on your account.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await sendMoneyApi({
        to: scannedQrData.upiId.trim(),
        amount: numAmount,
        paymentPin: paymentPin.trim()
      });

      if (res.success) {
        const newBalance = res.newBalance !== undefined ? res.newBalance : displayBalance - numAmount;
        const updatedUser = { ...user, balance: newBalance };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setTxSuccessData({
          transactionId: res.transaction?.transactionId || `TXN${Date.now()}`,
          amount: numAmount,
          recipient: scannedQrData.name || scannedQrData.upiId,
          upiId: scannedQrData.upiId,
          newBalance: newBalance,
          date: new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        });
        setScanStep('success');
      } else {
        setPayError(res.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
      setPayError(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetScan = () => {
    setScanStep('upload');
    setScanImageSrc(null);
    setScannedQrData(null);
    setScanError('');
    setPayAmount('');
    setPaymentPin('');
    setNote('');
    setPayError('');
    setTxSuccessData(null);
    if (scanFileInputRef.current) {
      scanFileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      <header className="bg-[#0b1329] border-b border-blue-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Dashboard</span>
          </Link>
          <Link to="/" className="flex items-center">
            <Logo lightText={true} />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <Wallet size={14} className="text-blue-400" />
            <span className="text-xs text-slate-400">Balance:</span>
            <span className="text-xs font-bold text-white font-mono">{formatCurrency(displayBalance)}</span>
          </div>

          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              if (token) fetchProfile(token);
            }}
            title="Refresh Account"
            className={`p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-all ${
              refreshing ? 'animate-spin text-blue-400' : ''
            }`}
          >
            <RefreshCw size={15} />
          </button>

          <div className="flex items-center gap-2 bg-[#101b38] border border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-white">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[130px] truncate hidden md:inline">{displayName}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <ScanLine size={24} />
              </span>
              <span>Scan & Pay via UPI</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Upload any UPI QR code image from your local device to verify payee and pay instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <ShieldCheck size={14} /> 256-Bit Encrypted Transfer
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {scanStep === 'upload' && (
              <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <QrCode size={20} className="text-blue-400" />
                    <h2 className="text-base font-bold text-white">Upload QR Code Image</h2>
                  </div>
                  <span className="text-xs text-slate-400">Step 1 of 2</span>
                </div>

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => scanFileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-500/40 hover:border-blue-500/80 bg-blue-500/5 hover:bg-blue-500/10 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-4">
                    <Upload size={28} />
                  </div>
                  <h3 className="text-base font-bold text-white">Select or Drag QR Image Here</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Supports PNG, JPG, JPEG, and WEBP formats stored on your local disk or mobile gallery.
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all pointer-events-none"
                  >
                    Browse Files from Device
                  </button>
                  <input
                    ref={scanFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Store size={14} className="text-blue-400" /> Test Merchants (Quick Try)
                    </span>
                    <span className="text-[11px] text-slate-500">1-click simulation</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Cafe Coffee Point', vpa: 'cafepoint@valutrix', amount: '240' },
                      { name: 'Metro Rail Ticket', vpa: 'metropay@valutrix', amount: '60' },
                      { name: 'Reliance Supermart', vpa: 'supermart@valutrix', amount: '1250' }
                    ].map((m) => (
                      <div
                        key={m.vpa}
                        onClick={() => handleQuickMerchant(m)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-xl p-3.5 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                            {m.name}
                          </span>
                          <span className="text-xs font-black text-emerald-400 font-mono">₹{m.amount}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">{m.vpa}</div>
                        <div className="mt-2 text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                          <span>Auto Fill Details</span>
                          <ArrowRight size={10} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {scanStep === 'preview' && (
              <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-white">Analyzing QR Image...</h2>
                  <button
                    onClick={handleResetScan}
                    className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                  >
                    Cancel
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center p-4 min-h-[260px]">
                  {scanImageSrc && (
                    <img
                      src={scanImageSrc}
                      alt="Uploaded QR"
                      className="max-h-72 max-w-full object-contain rounded-lg"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                    {isDecoding && !scanError ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-semibold text-white">Extracting UPI Credentials...</p>
                        <p className="text-xs text-slate-400">Reading payload with jsQR</p>
                      </div>
                    ) : scanError ? (
                      <div className="flex flex-col items-center gap-3 max-w-md">
                        <AlertCircle size={36} className="text-rose-400" />
                        <p className="text-sm font-semibold text-rose-300">{scanError}</p>
                        <button
                          onClick={handleResetScan}
                          className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 cursor-pointer"
                        >
                          Upload A Different Image
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {scanStep === 'confirm' && scannedQrData && (
              <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                    <div>
                      <h2 className="text-base font-bold text-white">Payee Verified</h2>
                      <p className="text-xs text-slate-400">Confirm payment details and authorize transfer</p>
                    </div>
                  </div>

                  <button
                    onClick={handleResetScan}
                    className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Scan Another
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
                  <div className="md:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Recipient UPI ID
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-base sm:text-lg font-black font-mono text-white tracking-wide">
                          {scannedQrData.upiId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(scannedQrData.upiId, 'Payee UPI ID')}
                          className="text-slate-400 hover:text-blue-400 p-1 cursor-pointer"
                        >
                          {copiedField === 'Payee UPI ID' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    {scannedQrData.name && (
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Payee Name
                        </span>
                        <div className="text-sm font-bold text-slate-200 mt-0.5">{scannedQrData.name}</div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs text-emerald-400">
                      <ShieldCheck size={14} />
                      <span>Ready for instant settlement</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 bg-slate-950/60 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                    {scanImageSrc ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={scanImageSrc}
                          alt="Scanned QR Thumbnail"
                          className="max-h-24 max-w-full object-contain rounded-lg border border-white/10 bg-slate-900"
                        />
                        <button
                          type="button"
                          onClick={handleDownloadUploadedQr}
                          className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                        >
                          <Download size={11} />
                          <span>Save QR Image</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-3 text-slate-500">
                        <QrCode size={36} className="text-blue-500/40" />
                        <span className="text-[11px] text-slate-400">Merchant Selected</span>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {payError && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{payError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Amount (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="0.00"
                        value={payAmount}
                        onChange={(e) => {
                          setPayAmount(e.target.value);
                          setPayError('');
                        }}
                        required
                        className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 focus:border-blue-500 focus:outline-none text-white font-mono text-lg font-bold transition-colors"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {[100, 250, 500, 1000, 2000].map((quick) => (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => {
                            setPayAmount(String(quick));
                            setPayError('');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-300 transition-colors cursor-pointer"
                        >
                          +₹{quick}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Remarks / Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dinner, Shopping, Utilities"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 focus:border-blue-500 focus:outline-none text-white text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      4-Digit Payment PIN (Authorization)
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        maxLength={4}
                        placeholder="••••"
                        value={paymentPin}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 4) {
                            setPaymentPin(val);
                            setPayError('');
                          }
                        }}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 focus:border-blue-500 focus:outline-none text-white font-mono text-base font-bold tracking-widest transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Authorizing Payment...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Pay {payAmount ? `₹${Number(payAmount).toLocaleString('en-IN')}` : 'Now'}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetScan}
                      className="py-3.5 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {scanStep === 'success' && txSuccessData && (
              <div className="bg-[#0b1329] rounded-3xl border border-emerald-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} />
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">Payment Successful!</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Your payment has been authorized and settled via Valtrix Instant Core.
                </p>

                <div className="my-6 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto space-y-3 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs text-slate-400">Amount Paid</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      ₹{txSuccessData.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Paid To</span>
                    <span className="font-bold text-white">{txSuccessData.recipient}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Payee UPI ID</span>
                    <span className="font-mono text-slate-300">{txSuccessData.upiId}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Transaction ID</span>
                    <div className="flex items-center gap-1 font-mono text-slate-300">
                      <span>{txSuccessData.transactionId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(txSuccessData.transactionId, 'TxID')}
                        className="text-blue-400 hover:text-blue-300 p-0.5 cursor-pointer"
                      >
                        {copiedField === 'TxID' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                    <span className="text-slate-400">Remaining Balance</span>
                    <span className="font-bold font-mono text-white">
                      {formatCurrency(txSuccessData.newBalance)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetScan}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ScanLine size={14} />
                    <span>Scan Another QR Code</span>
                  </button>

                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors text-center"
                  >
                    Back to Dashboard
                  </Link>

                  <Link
                    to="/transactions"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors text-center"
                  >
                    View All Transactions
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-5 sm:p-6 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-full text-left mb-3">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">My Account QR</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Receive Payments</h3>
                <p className="text-[11px] text-slate-400">Share or download your personalized Valtrix QR</p>
              </div>

              <div
                ref={myQrCanvasRef}
                className="my-3 p-4 bg-white rounded-2xl border border-white/20 shadow-md flex items-center justify-center"
              >
                <QRCodeCanvas
                  value={`upi://pay?pa=${displayUpiId}&pn=${encodeURIComponent(displayName)}&cu=INR`}
                  size={152}
                  bgColor="#ffffff"
                  fgColor="#070d1e"
                  level="M"
                />
              </div>

              <div className="w-full bg-white/5 rounded-xl p-2.5 border border-white/10 text-center mb-3">
                <div className="text-xs font-black text-white font-mono">{displayUpiId}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{displayName}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  type="button"
                  onClick={handleDownloadMyQr}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download QR</span>
                </button>

                <button
                  type="button"
                  onClick={handleSharePaymentLink}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>Share Link</span>
                </button>
              </div>
            </div>

            <div className="bg-[#0b1329] rounded-3xl border border-blue-500/20 p-5 shadow-xl text-xs space-y-3">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Security Checklist
              </span>

              <div className="flex items-start gap-2.5 text-slate-400">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Verify payee name before entering your secret 4-digit Payment PIN.</span>
              </div>

              <div className="flex items-start gap-2.5 text-slate-400">
                <FileCheck size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <span>QR images from phone gallery or desktop drive are safely parsed locally.</span>
              </div>

              <div className="flex items-start gap-2.5 text-slate-400">
                <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Zero gateway fees on peer-to-peer and merchant UPI transactions.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav active="scan" />

      {toastMessage && (
        <div className="fixed bottom-7 right-7 z-50 bg-slate-900 text-white border border-blue-500/30 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
