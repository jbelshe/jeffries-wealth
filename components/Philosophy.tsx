import React from 'react';
import { 
  HeartHandshake, 
  BrainCircuit, 
  TrendingUp, 
  ShieldCheck, 
  Smartphone, 
  Scale 
} from 'lucide-react';

const PhilosophyCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="flex flex-col items-start p-8 bg-stone-900/50 border border-stone-800 rounded-2xl hover:border-emerald-500/30 hover:bg-stone-900 transition-all duration-300 group">
    <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-bold text-stone-100 mb-3 group-hover:text-emerald-400 transition-colors">{title}</h3>
    <p className="text-stone-400 leading-relaxed text-sm">
      {description}
    </p>
  </div>
);

const Philosophy: React.FC = () => {
  return (
    <section className="py-24 bg-stone-950 relative" id="philosophy">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/20 border border-emerald-900/50 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-6">
            Our Ethos
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-100 mb-6 font-display">
            Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Outsourced CFO</span>
          </h2>
          <p className="text-xl text-stone-400 leading-relaxed">
            We don't just "manage money." We steward your entire financial life with the rigor of a corporate balance sheet and the empathy of a dedicated partner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PhilosophyCard 
            icon={HeartHandshake}
            title="Stewardship & Accountability"
            description="The greatest gap is between intention and action. We act as your accountability partner, ensuring you stick to the plan when emotions run high or life gets busy."
          />
          
          <PhilosophyCard 
            icon={BrainCircuit}
            title="The 'CFO' Mindset"
            description="A business tracks cash flow, ROI, and net margins. We apply these same principles to your household, optimizing your personal P&L for maximum efficiency."
          />

          <PhilosophyCard 
            icon={TrendingUp}
            title="After-Tax Performance"
            description="It’s not what you make; it’s what you keep. Our obsession is 'Tax Alpha'—using asset location, harvesting, and strategic deferral to boost your real, take-home net worth."
          />

          <PhilosophyCard 
            icon={Smartphone}
            title="Tech-Forward, Human-First"
            description="We leverage modern fintech for real-time data and automated logic, freeing us up to spend our time on what matters most: your vision, your values, and your life decisions."
          />

          <PhilosophyCard 
            icon={ShieldCheck}
            title="Fiduciary Standard"
            description="Fiduciary advice with flexible engagement options, including flat-fee planning and investment management."
          />

          <PhilosophyCard 
            icon={Scale}
            title="Evidence-Based Investing"
            description="We reject speculation and market timing. We build portfolios based on decades of academic research, focusing on low costs, proper diversification, and disciplined rebalancing."
          />
        </div>

        {/* Bottom Line Statement */}
        <div className="mt-20 p-8 md:p-12 bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
            <h3 className="text-2xl font-bold text-stone-100 mb-4">The Jeffries Wealth Promise</h3>
            <p className="text-lg text-stone-400 max-w-3xl mx-auto italic">
              "To provide the sophistication you deserve, the convenience of modern tech, and the care of a trusted friend—with transparent, clearly disclosed fees."
            </p>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;