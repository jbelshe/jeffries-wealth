
import React from 'react';
import { TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import logoUrl from "../assets/logo.svg";

const Hero: React.FC<{ onStart: () => void; onBook: () => void }> = ({ onStart, onBook }) => {
  return (
    <div className="relative overflow-hidden bg-stone-950 pt-20 pb-32">
      {/* Organic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-800 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-stone-700 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 border border-emerald-900/50 text-emerald-100 text-sm font-medium mb-8 shadow-lg shadow-emerald-900/10">
          <img src={logoUrl} alt="Logo" className="h-6 w-auto text-emerald-500 -mt-2" />
          <span>Flat-Fee & Subscription Model &bull; Fiduciary</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-100 mb-6 font-display">
          Wealth Planning for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">
            High-Growth Accumulators
          </span>
        </h1>

        <p className="text-xl text-stone-400 max-w-2xl mb-10 leading-relaxed">
          Stop using "retirement" strategies for your growth years. We specialize in 
          <strong> variable compensation</strong>, <strong>aggressive tax planning</strong>, 
          and <strong>cash flow systems</strong> for professionals in Tech & Sales.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onStart}
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-stone-950 bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            See The Difference
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onBook}
            className="px-8 py-4 text-lg font-semibold text-stone-300 border border-stone-700 rounded-lg hover:bg-stone-900 transition-all"
          >
            Book Discovery Call
          </button>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl w-full">
            <div className="p-8 bg-stone-900/50 backdrop-blur border border-stone-800 rounded-2xl hover:border-emerald-900/50 transition-colors">
                <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-lg font-semibold text-stone-100">Variable Comp Expert</h3>
                <p className="text-stone-400 mt-2 leading-relaxed">We build systems that smooth out the volatility of commissions, bonuses, and RSU vesting schedules.</p>
            </div>
            <div className="p-8 bg-stone-900/50 backdrop-blur border border-stone-800 rounded-2xl hover:border-emerald-900/50 transition-colors">
                <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-3.5L11 21l2.5-2.5L17 21z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-stone-100">Proactive Tax Design</h3>
                <p className="text-stone-400 mt-2 leading-relaxed">Forward-looking tax planning for high and low income years designed to help lower your lifetime tax rate.</p>
            </div>
            <div className="p-8 bg-stone-900/50 backdrop-blur border border-stone-800 rounded-2xl hover:border-emerald-900/50 transition-colors">
                 <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                   <CheckCircle size={24} />
                 </div>
                <h3 className="text-lg font-semibold text-stone-100">Subscription Pricing</h3>
                <p className="text-stone-400 mt-2 leading-relaxed">Transparent flat fees. We don't need to "manage" your assets to give you world-class advice.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
