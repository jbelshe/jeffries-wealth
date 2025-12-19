
import React from 'react';
import { Check, Plus, Rocket, Users, Shield } from 'lucide-react';

const PricingCard = ({ 
    title, 
    price, 
    description, 
    features, 
    icon: Icon, 
    highlighted = false,
    onBook,
    ctaText = "Get Started",
    footerSubtext
}: { 
    title: string; 
    price: string | null; 
    description: string; 
    features: string[]; 
    icon: any;
    highlighted?: boolean;
    onBook: () => void;
    ctaText?: string;
    footerSubtext?: string;
}) => (
    <div className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
        highlighted 
        ? 'bg-stone-900 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)] scale-105 z-10' 
        : 'bg-stone-950 border-stone-800 hover:border-stone-700'
    }`}>
        {highlighted && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-stone-950 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Most Popular
            </div>
        )}
        
        <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                highlighted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-900 text-stone-500'
            }`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-stone-100">{title}</h3>
                <div className="text-stone-500 text-xs mt-0.5">
                    {price ? 'Monthly Subscription' : 'Professional Advisory'}
                </div>
            </div>
        </div>

        <div className="mb-6">
            {price ? (
                <>
                    <span className="text-4xl font-bold text-stone-100">{price}</span>
                    <span className="text-stone-500">/mo</span>
                </>
            ) : (
                <span className="text-2xl font-bold text-stone-100 italic">Strategic Advisory</span>
            )}
            <p className="mt-3 text-stone-400 text-sm leading-relaxed min-h-[60px]">
                {description}
            </p>
        </div>

        <div className="flex-grow space-y-4 mb-8">
            {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                    <Check size={18} className={`shrink-0 mt-0.5 ${highlighted ? 'text-emerald-500' : 'text-stone-600'}`} />
                    <span className="text-sm text-stone-300">{feature}</span>
                </div>
            ))}
        </div>

        <div className="space-y-3">
            <button 
                onClick={onBook}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                highlighted 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 shadow-lg' 
                : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
            }`}>
                {ctaText}
            </button>
            {footerSubtext && (
                <p className="text-[10px] text-stone-600 text-center italic tracking-wide">
                    {footerSubtext}
                </p>
            )}
        </div>
    </div>
);

const Pricing: React.FC<{ onBook: (source?: 'general' | 'audit' | 'private-wealth' | 'discovery') => void }> = ({ onBook }) => {
  return (
    <section className="py-24 bg-stone-950 relative overflow-hidden" id="pricing">
        {/* Background blobs */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-stone-900/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-stone-100 mb-6 font-display">
                    Transparent, Flat-Fee Pricing
                </h2>
                <p className="text-lg text-stone-400">
                    We separate advice from management. Pay for the plan, not just a percentage of your portfolio.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <PricingCard 
                    title="Emerging"
                    price="$200"
                    icon={Rocket}
                    description="For single professionals establishing their financial foundation."
                    onBook={() => onBook('discovery')}
                    features={[
                        "Cash flow & Budgeting System",
                        "Employer Benefit Review",
                        "Basic Investment Allocation",
                        "Annual Tax Return Review",
                        "Twice Annual Strategy Calls"
                    ]}
                />
                
                <PricingCard 
                    title="Accumulator"
                    price="$400"
                    icon={Users}
                    highlighted={true}
                    description="For dual-income households and high earners with complexity."
                    onBook={() => onBook('discovery')}
                    features={[
                        "Everything in Emerging",
                        "RSU & Stock Option Strategy",
                        "Advanced Tax Planning",
                        "1099 Strategy & Retirement Funding",
                        "Real Estate Purchase Analysis",
                        "Quarterly Strategy Calls"
                    ]}
                />

                <PricingCard 
                    title="Private Wealth"
                    price={null}
                    icon={Shield}
                    ctaText="Request Private Wealth Access"
                    footerSubtext="Engagements are customized and capacity-limited."
                    description="For households with $5M+ in investable assets, complex compensation, or upcoming liquidity events requiring proactive, multi-year planning."
                    onBook={() => onBook('private-wealth')}
                    features={[
                        "Everything in Accumulator",
                        "Advanced tax coordination and multi-year planning",
                        "Concentrated stock and liquidity event planning",
                        "Tax-aware strategies designed for high-tax households",
                        "Estate, trust, and beneficiary coordination",
                        "Ongoing strategic advisory access"
                    ]}
                />
            </div>

            {/* AUM Add-on Box */}
            <div className="mt-12 bg-stone-900/50 border border-stone-800 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center shrink-0">
                    <Plus className="text-emerald-500" size={32} />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h3 className="text-xl font-bold text-stone-100 mb-2">Optional Investment Management</h3>
                    <p className="text-stone-400 text-sm">
                        Prefer to hand off the day-to-day trading? We offer full-service portfolio management (rebalancing, tax-loss harvesting, direct indexing) for an additional fee.
                    </p>
                </div>
                <div className="text-center md:text-right shrink-0">
                    <div className="text-3xl font-bold text-emerald-400">0.50%</div>
                    <div className="text-stone-500 text-sm uppercase tracking-wider font-medium">Of Assets Managed</div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Pricing;
