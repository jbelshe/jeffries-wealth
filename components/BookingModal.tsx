
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { logClientData } from '../services/loggingService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: 'general' | 'audit';
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, source = 'general' }) => {
  const [step, setStep] = useState<'contact' | 'details' | 'calendar'>('contact');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employer: '',
    income: '',
    assets: '',
    goal: '',
    // Step 2 details
    ownsHome: 'no',
    hasDebt: 'no',
    debtDescription: 'Student Loans',
    hasInsurance: false,
    tracksExpenses: false,
    hasCPA: false,
    vision: ''
  });

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
        setStep('contact');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleToggleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic for Audit Source: Skip Details Step
    if (source === 'audit' && step === 'contact') {
        // console.log("calling log for intake_form audit_roadmap");
         logClientData('INTAKE_FORM', { 
          ...formData, 
          formType: 'audit_roadmap' 
        });
         setStep('calendar');
         return;
    }

    // Standard Flow
    if (step === 'contact') {
        setStep('details');
    } else if (step === 'details') {
        // console.log("calling log for intake_form audit_roadmap");
        logClientData('INTAKE_FORM', {
          ...formData, 
          formType: 'general_booking' 
        });
        setStep('calendar');
    }
  };

  const handleBack = () => {
    if (step === 'details') setStep('contact');
    if (step === 'calendar') {
        // If coming from Audit, go back to contact, else go back to details
        setStep(source === 'audit' ? 'contact' : 'details');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-stone-800 bg-stone-900/50">
          <div>
            <h3 className="text-xl font-bold text-stone-100 font-display">
              {step === 'calendar' ? 'Select a Time' : (source === 'audit' ? 'Review Audit Findings' : 'Strategy Session Intake')}
            </h3>
            <p className="text-sm text-stone-400">
              {source === 'audit' ? (
                  step === 'calendar' ? 'Step 2: Schedule Review' : 'Step 1: Contact Info'
              ) : (
                  <>
                  {step === 'contact' && 'Step 1: The Basics'}
                  {step === 'details' && 'Step 2: Your Financial Picture'}
                  {step === 'calendar' && 'Step 3: Schedule Your Call'}
                  </>
              )}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-stone-300 transition-colors p-2 hover:bg-stone-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 md:p-8">
          {step === 'calendar' ? (
             <div className="h-[500px] w-full bg-white rounded-lg overflow-hidden">
               {/* Replace src with your actual Calendly URL */}
              <iframe 
                src="https://calendly.com/jeffrieswealth/discoverycall?hide_event_type_details=1&hide_gdpr_banner=1" 
                width="100%" 
                height="100%" 
                frameBorder="0"
                title="Calendly Scheduling"
              ></iframe>
            </div>
          ) : (
            <form onSubmit={handleNext} className="space-y-6">
              
              {/* STEP 1: CONTACT & BASIC INFO */}
              {step === 'contact' && (
                <div className="space-y-6 animate-fade-in">
                    {source === 'audit' && (
                        <div className="bg-emerald-900/20 border border-emerald-900/30 p-4 rounded-lg mb-4 text-sm text-emerald-200">
                             <strong>Next Steps:</strong> Schedule a 20-minute call to review your Wealth Leakage Audit. You will receive a copy of your full report and roadmap after our team verifies the data during the call.
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">First Name</label>
                        <input 
                            required
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="Jane"
                        />
                        </div>
                        <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Last Name</label>
                        <input 
                            required
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="Doe"
                        />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Work Email</label>
                            <input 
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="jane@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Phone Number</label>
                            <input 
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="(555) 123-4567"
                            />
                        </div> 
                    </div>

                    {/* Standard Fields (Hidden if Audit Source) */}
                    {source !== 'audit' && (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Current Employer</label>
                                <input 
                                required
                                name="employer"
                                value={formData.employer}
                                onChange={handleChange}
                                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="e.g. Google, Salesforce"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Est. Annual Income</label>
                                <select 
                                name="income"
                                value={formData.income}
                                onChange={handleChange}
                                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                >
                                <option value="">Select Range...</option>
                                <option value="<200k">Under $200k</option>
                                <option value="200-400k">$200k - $400k</option>
                                <option value="400-800k">$400k - $800k</option>
                                <option value="800k+">$800k+</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Investable Assets</label>
                                <select 
                                name="assets"
                                value={formData.assets}
                                onChange={handleChange}
                                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                >
                                <option value="">Select Range...</option>
                                <option value="<250k">Under $250k</option>
                                <option value="250k-1M">$250k - $1M</option>
                                <option value="1M-3M">$1M - $3M</option>
                                <option value="3M+">$3M+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Top Priority</label>
                                <select 
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                >
                                <option value="">Select Priority...</option>
                                <option value="Tax Planning">Reduce Taxes</option>
                                <option value="Equity Comp">Optimize Equity/RSUs</option>
                                <option value="Organization">Get Organized</option>
                                <option value="Retirement">Retirement Roadmap</option>
                                </select>
                            </div>
                        </div>
                        </>
                    )}
                </div>
              )}

              {/* STEP 2: DETAILS (Standard Flow Only) */}
              {step === 'details' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Do you own a home?</label>
                            <div className="flex rounded-lg overflow-hidden border border-stone-800">
                                <button type="button" onClick={() => handleToggleChange('ownsHome', 'yes')} className={`flex-1 py-3 text-sm font-bold transition-colors ${formData.ownsHome === 'yes' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-stone-900 text-stone-500 hover:bg-stone-800'}`}>Yes</button>
                                <button type="button" onClick={() => handleToggleChange('ownsHome', 'no')} className={`flex-1 py-3 text-sm font-bold transition-colors ${formData.ownsHome === 'no' ? 'bg-stone-800 text-stone-300' : 'bg-stone-900 text-stone-500 hover:bg-stone-800'}`}>No</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Any consumer debt?</label>
                            <div className="flex rounded-lg overflow-hidden border border-stone-800">
                                <button type="button" onClick={() => handleToggleChange('hasDebt', 'yes')} className={`flex-1 py-3 text-sm font-bold transition-colors ${formData.hasDebt === 'yes' ? 'bg-red-900/20 text-red-400' : 'bg-stone-900 text-stone-500 hover:bg-stone-800'}`}>Yes</button>
                                <button type="button" onClick={() => handleToggleChange('hasDebt', 'no')} className={`flex-1 py-3 text-sm font-bold transition-colors ${formData.hasDebt === 'no' ? 'bg-stone-800 text-stone-300' : 'bg-stone-900 text-stone-500 hover:bg-stone-800'}`}>No</button>
                            </div>
                        </div>
                    </div>

                    {formData.hasDebt === 'yes' && (
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Debt Type</label>
                            <select 
                                name="debtDescription"
                                value={formData.debtDescription}
                                onChange={handleChange}
                                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 outline-none"
                            >
                                <option>Student Loans</option>
                                <option>Mortgage Only</option>
                                <option>Credit Cards / High Interest</option>
                                <option>Business Debt</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-3 pt-2">
                        <label className="flex items-center gap-3 p-3 bg-stone-950 border border-stone-800 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-colors">
                            <input type="checkbox" name="hasInsurance" checked={formData.hasInsurance} onChange={(e) => handleToggleChange('hasInsurance', e.target.checked)} className="accent-emerald-500 w-5 h-5" />
                            <span className="text-sm text-stone-300">I have private life/disability insurance</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-stone-900 border border-stone-800 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-colors">
                            <input type="checkbox" name="tracksExpenses" checked={formData.tracksExpenses} onChange={(e) => handleToggleChange('tracksExpenses', e.target.checked)} className="accent-emerald-500 w-5 h-5" />
                            <span className="text-sm text-stone-300">I actively track expenses / budget</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-stone-900 border border-stone-800 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-colors">
                            <input type="checkbox" name="hasCPA" checked={formData.hasCPA} onChange={(e) => handleToggleChange('hasCPA', e.target.checked)} className="accent-emerald-500 w-5 h-5" />
                            <span className="text-sm text-stone-300">I work with a CPA for tax planning</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Success Vision (5 Years)</label>
                        <textarea 
                            name="vision"
                            value={formData.vision}
                            onChange={handleChange}
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all h-24 resize-none"
                            placeholder="e.g. Work optionality, buying a second home, starting a business..."
                        />
                    </div>
                </div>
              )}

              <div className="pt-6 flex gap-4">
                {step !== 'contact' && (
                    <button 
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <ChevronLeft size={18} />
                        Back
                    </button>
                )}
                <button 
                  type="submit"
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {step === 'contact' && source === 'audit' ? 'View Calendar' : step === 'details' ? 'View Calendar' : 'Next Step'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer / Progress */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-center">
            <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full transition-colors ${step === 'contact' ? 'bg-emerald-500' : 'bg-emerald-900'}`}></div>
                <div className={`h-2 w-2 rounded-full transition-colors ${step === 'details' ? 'bg-emerald-500' : step === 'calendar' ? 'bg-emerald-900' : 'bg-stone-800'}`}></div>
                <div className={`h-2 w-2 rounded-full transition-colors ${step === 'calendar' ? 'bg-emerald-500' : 'bg-stone-800'}`}></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
