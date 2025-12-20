
import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { logClientData } from '../services/loggingService';

const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        // Log newsletter signup to backend/Zapier
        await logClientData('NEWSLETTER', { email });
        setStatus('success');
        setEmail('');
    };

    return (
        <section className="py-20 bg-stone-900 border-t border-stone-800 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

             <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
                    <Mail size={24} />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-stone-100 mb-4 font-display">
                    Join the Inner Circle
                </h2>
                <p className="text-stone-400 mb-10 max-w-xl mx-auto text-lg">
                    Insights on equity compensation, tax strategy, and wealth accumulation. No spam, just value.
                </p>

                {status === 'success' ? (
                    <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-xl p-6 flex flex-col items-center animate-fade-in">
                        <CheckCircle2 size={48} className="text-emerald-500 mb-3" />
                        <h3 className="text-xl font-bold text-emerald-100">You're on the list!</h3>
                        <p className="text-emerald-400/80">Keep an eye on your inbox for our next issue.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input 
                            type="email" 
                            required
                            placeholder="Enter your email address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow bg-stone-950 border border-stone-800 rounded-xl px-6 py-4 text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-stone-600"
                        />
                        <button 
                            type="submit" 
                            disabled={status === 'loading'}
                            className="bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {status === 'loading' ? 'Joining...' : 'Subscribe'}
                            {!status && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}
             </div>
        </section>
    );
};

export default Newsletter;
