import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Send,
  QrCode,
  ArrowDownLeft,
  Clock,
  User as UserIcon
} from 'lucide-react';

export default function MobileNav({ active = '' }) {
  const items = [
    { id: 'home', label: 'Home', path: '/dashboard', icon: Home },
    { id: 'send', label: 'Send', path: '/send-money', icon: Send },
    { id: 'scan', label: 'Scan', path: '/scan-pay', icon: QrCode },
    { id: 'receive', label: 'Receive', path: '/receive-money', icon: ArrowDownLeft },
    { id: 'history', label: 'History', path: '/transactions', icon: Clock },
    // { id: 'profile', label: 'Profile', path: '/profile', icon: UserIcon }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b1329]/95 backdrop-blur-md border-t border-blue-500/20 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center py-1 px-2 text-[10px] transition-colors ${
              isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white font-medium'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
            <span className="mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
