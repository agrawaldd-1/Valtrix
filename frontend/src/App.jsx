import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import MobileShowcaseSection from './components/MobileShowcaseSection';
import Footer from './components/Footer';
import DemoModal from './components/DemoModal';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EnterPin from './pages/EnterPin';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import Transactions from './pages/Transactions';
import ScanPay from './pages/ScanPay';
import ReceiveMoney from './pages/ReceiveMoney';
import Profile from './pages/Profile';

function LandingPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full overflow-x-hidden">
        <HeroSection onOpenDemo={() => setDemoModalOpen(true)} />
        <FeaturesSection />
        <HowItWorksSection />
        <MobileShowcaseSection />
      </main>

      <Footer />

      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/enter-pin" element={<EnterPin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/send-money" element={<SendMoney />} />
      <Route path="/send" element={<SendMoney />} />
      <Route path="/scan-pay" element={<ScanPay />} />
      <Route path="/scan" element={<ScanPay />} />
      <Route path="/receive-money" element={<ReceiveMoney />} />
      <Route path="/receive" element={<ReceiveMoney />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}


export default App;
