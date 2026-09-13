import React from 'react';

export const Logo = ({ size = 'default', lightText = true, showTagline = false }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconWidth = isLarge ? 38 : isSmall ? 24 : 30;
  const iconHeight = isLarge ? 38 : isSmall ? 24 : 30;
  const textSizeClass = isLarge ? 'text-2xl' : isSmall ? 'text-base' : 'text-xl';

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)]"
      >
        <defs>
          <linearGradient id="valtrixGrad1" x1="6" y1="8" x2="22" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1D4ED8" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="valtrixGrad2" x1="18" y1="8" x2="36" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="valtrixGradFold" x1="10" y1="20" x2="26" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <path d="M7 6L18 34H11L3 12L7 6Z" fill="url(#valtrixGrad1)" />
        <path d="M11 34L20 18L26 26L18 34H11Z" fill="url(#valtrixGradFold)" />
        <path d="M37 6L23 34H17L29 6H37Z" fill="url(#valtrixGrad2)" />
      </svg>

      <div className="flex flex-col">
        <span
          className={`${textSizeClass} font-extrabold tracking-[0.08em] leading-none ${
            lightText ? 'text-white' : 'text-slate-900'
          }`}
        >
          VALTRIX
        </span>
        {showTagline && (
          <span
            className={`text-[10px] font-medium mt-0.5 tracking-tight ${
              lightText ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Your Money. Your Control.
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
