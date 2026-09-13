import React from 'react';
import { Link } from 'react-router-dom';
import { User, CreditCard, Send, ArrowRight } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      icon: User,
      title: 'Create Your Account',
      description: 'Sign up with your basic details in minutes.'
    },
    {
      number: '2',
      icon: CreditCard,
      title: 'Set Up Your UPI ID',
      description: 'Get your unique UPI ID and account.'
    },
    {
      number: '3',
      icon: Send,
      title: 'Start Transacting',
      description: 'Send, receive and manage your money effortlessly.'
    }
  ];

  return (
    <section id="how-it-works" className="bg-[#070d1e] py-24 relative overflow-hidden">
      <div className="absolute -bottom-20 right-10 w-[480px] h-[480px] rounded-full bg-blue-600/15 blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-sky-400 inline-block mb-3">
              HOW IT WORKS
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Get Started in <br /> Three Simple Steps
            </h2>

            <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-md">
              Start using Valtrix in minutes and take control of your payments.
            </p>

            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex flex-col items-start relative">
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-16 right-[-24px] h-[1px] bg-[linear-gradient(to_right,rgba(59,130,246,0.5)_50%,transparent_50%)] [background-size:8px_1px] [background-repeat:repeat-x] z-0">
                      <span className="absolute right-1 -top-2 text-xs text-blue-400">›</span>
                    </div>
                  )}

                  <div className="relative mb-5 z-10">
                    <div className="w-16 h-16 rounded-full bg-blue-950/60 border border-blue-500/35 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.25)] backdrop-blur-sm">
                      <Icon size={24} strokeWidth={2} />
                    </div>

                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center border-2 border-[#070d1e] shadow-sm">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
