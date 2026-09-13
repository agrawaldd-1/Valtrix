import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'About', href: '/#mobile-app' },
    { name: 'Contact', href: '/#contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#070d1e]/90 backdrop-blur-md border-b border-blue-500/20'
        : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <Logo lightText={true} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-[15px] font-medium text-slate-400 hover:text-white relative py-1.5 transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3.5">
          <Link
            to="/signin"
            className="px-5 py-2 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 rounded-lg backdrop-blur-sm transition-all inline-block"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 rounded-lg shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)] transition-all inline-block"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-white bg-white/10 border border-white/15"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b1329] border-b border-blue-500/20 px-6 py-5 flex flex-col gap-3">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 py-2 border-b border-white/5"
            >
              {item.name}
            </a>
          ))}
          <div className="flex gap-3 pt-3">
            <Link
              to="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 text-center text-sm font-semibold text-white border border-white/20 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
