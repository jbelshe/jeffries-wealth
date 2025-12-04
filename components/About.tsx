
import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section className="py-24 bg-stone-900 border-t border-stone-800" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Image / Visual Column */}
          <div className="relative">
             {/* Decorative Elements */}
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-stone-700/10 rounded-full blur-3xl"></div>
             
             {/* Image Container */}
             <div className="relative z-10 aspect-[4/5] rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 shadow-2xl group">
                <img 
                    src="../assets/headshot_updated_website.png"
                    alt="Clark Jeffries"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 text-left">
                    <h3 className="text-2xl font-bold text-white font-display">Clark Jeffries</h3>
                    <p className="text-emerald-400 font-medium">Founder & CEO</p>
                </div>
             </div>
          </div>

          {/* Text Content Column */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 border border-stone-700 text-stone-400 text-xs font-bold uppercase tracking-widest mb-6">
                About The Firm
            </div>
            <h2 className="text-4xl font-bold text-stone-100 mb-6 font-display leading-tight">
                Built by a peer, <br/>
                <span className="text-emerald-500">for peers.</span>
            </h2>
            
            <div className="space-y-6 text-lg text-stone-400 leading-relaxed">
                <p>
                    I founded Jeffries Wealth to solve a specific problem: Traditional financial advice is built for retirees, not builders. 
                </p>
                <p>
                    With a background in FinTech and Sales, I realized that high-earners with complex compensation (RSUs, Commissions, Bonuses) were being underserved by the standard "Asset Management" model. You don't need someone to just watch your portfolio; you need a strategic partner to optimize your cash flow, taxes, and equity today.
                </p>
                <p>
                    My mission is simple: To provide the sophistication of a family office with the transparency of a modern subscription model. We help you convert your high income into permanent financial independence—not someday, but starting right now.
                </p>
            </div>

            <div className="mt-10 flex gap-6">
                <a 
                    href="https://www.linkedin.com/in/clark-jeffries-11366112a/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-stone-300 hover:text-emerald-400 transition-colors font-medium"
                >
                    <Linkedin size={20} />
                    <span>Connect on LinkedIn</span>
                </a>
                <a 
                    href="mailto:Clark@JeffriesWealth.com" 
                    className="flex items-center gap-2 text-stone-300 hover:text-emerald-400 transition-colors font-medium"
                >
                    <Mail size={20} />
                    <span>Email Me</span>
                </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
