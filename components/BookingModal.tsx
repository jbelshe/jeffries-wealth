
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, CalendarCheck, CheckCircle2, Shield, Info } from 'lucide-react';
import { logClientData } from '../services/loggingService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: 'general' | 'audit' | 'private-wealth' | 'discovery';
  prefillData?: any;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, source = 'general', prefillData }) => {
  const [step, setStep] = useState<'contact' | 'details' | 'pw-intake' | 'discovery-intake' | 'calendar'>('contact');
  const [pwConfirmed, setPwConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '', // Used for Discovery flow
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
    vision: '',
    // Private Wealth & Discovery specific
    state: '',
    pwNetWorth: '',
    pwRole: '',
    pwComplexities: [] as string[],
    pwVariablePct: '',
    pwAnnualComp: '',
    pwTiming: '',
    pwNotes: '',
    // Discovery specific
    discoveryReason: '',
    discoveryNotes: ''
  });

  // Reset step when modal opens and prefill data
  useEffect(() => {
    if (isOpen) {
        setPwConfirmed(false);
        if (source === 'private-wealth') {
            setStep('pw-intake');
        } else if (source === 'discovery') {
            setStep('discovery-intake');
        } else {
            setStep('contact');
        }
        
        if (prefillData) {
            setFormData(prev => ({
                ...prev,
                firstName: prefillData.firstName || '',
                lastName: prefillData.lastName || '',
                fullName: prefillData.firstName ? `${prefillData.firstName} ${prefillData.lastName || ''}`.trim() : '',
                email: prefillData.email || '',
                phone: prefillData.phone || '',
                employer: prefillData.employer || '',
            }));
        }
    }
  }, [isOpen, prefillData, source]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleToggleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleComplexity = (val: string) => {
    setFormData(prev => {
        const current = prev.pwComplexities;
        if (current.includes(val)) {
            return { ...prev, pwComplexities: current.filter(c => c !== val) };
        }
        if (current.length >= 2) {
            return prev;
        }
        return { ...prev, pwComplexities: [...current, val] };
    });
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic for Private Wealth Intake
    if (source === 'private-wealth') {
        await logClientData('INTAKE_FORM', { ...formData, source: 'private_wealth_intake', submittedAt: new Date().toISOString() });
        setPwConfirmed(true);
        setStep('calendar');
        return;
    }

    // Logic for Discovery Call Flow
    if (source === 'discovery') {
        await logClientData('INTAKE_FORM', { ...formData, source: 'discovery_call_intake', submittedAt: new Date().toISOString() });
        setStep('calendar');
        return;
    }

    // Logic for Audit Source: Skip Details Step, Log Immediately
    if (source === 'audit' && step === 'contact') {
         await logClientData('INTAKE_FORM', { ...formData, source: 'audit_roadmap', submittedAt: new Date().toISOString() });
         setStep('calendar');
         return;
    }

    // Standard Flow
    if (step === 'contact') {
        setStep('details');
    } else if (step === 'details') {
        await logClientData('INTAKE_FORM', { ...formData, source: 'general_booking', submittedAt: new Date().toISOString() });
        setStep('calendar');
    }
  };

  const handleBack = () => {
    if (step === 'details') setStep('contact');
    if (step === 'calendar') {
        if (source === 'private-wealth') {
            setPwConfirmed(false);
            setStep('pw-intake');
        } else if (source === 'discovery') {
            setStep('discovery-intake');
        } else {
            setStep(source === 'audit' ? 'contact' : 'details');
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className={`relative w-full ${source === 'private-wealth' && step === 'pw-intake' || step === 'discovery-intake' ? 'max-w-3xl' : 'max-w-2xl'} bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-stone-800 bg-stone-900/50">
          <div>
            <h3 className="text-xl font-bold text-stone-100 font-display">
              {step === 'calendar' ? (source === 'private-wealth' ? 'Schedule Private Wealth Intro' : source === 'discovery' ? 'Schedule Discovery Call' : 'Select a Time') : (
                  source === 'private-wealth' ? 'Private Wealth Access Request' :
                  source === 'discovery' ? 'Discovery Call' :
                  source === 'audit' ? 'Review Audit Findings' : 'Strategy Session Intake'
              )}
            </h3>
            <p className="text-sm text-stone-400">
              {source === 'private-wealth' ? (
                  step === 'pw-intake' ? 'Advisory for high-net-worth households' : 'Schedule Your Introduction Call'
              ) : source === 'discovery' ? (
                  step === 'discovery-intake' ? 'A short conversation to understand your situation, priorities, and whether working together is a good fit.' : 'Schedule Your Discovery Call'
              ) : source === 'audit' ? (
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
             <div className="flex flex-col h-full">
               {pwConfirmed && (
                   <div className="bg-emerald-900/20 border border-emerald-900/40 p-4 rounded-xl mb-6 text-center animate-in slide-in-from-top-2">
                       <p className="text-emerald-100 font-bold">Thanks — you can now schedule a Private Wealth Intro.</p>
                   </div>
               )}
               <div className="h-[500px] w-full bg-white rounded-lg overflow-hidden shrink-0">
                <iframe 
                    src="https://calendly.com/jeffrieswealth/discoverycall?hide_event_type_details=1&hide_gdpr_banner=1" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0"
                    title="Calendly Scheduling"
                ></iframe>
               </div>
            </div>
          ) : step === 'discovery-intake' ? (
              <form onSubmit={handleNext} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Identify Yourself</h4>
                        <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Full Name</label>
                            <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500" placeholder="Jane Doe" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Email Address</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500" placeholder="jane@email.com" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">State of Residence</label>
                            <input required name="state" value={formData.state} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500" placeholder="CA, NY, etc." />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Professional Context</h4>
                        <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Primary Role / Job Title</label>
                            <input 
                              required 
                              name="pwRole" 
                              value={formData.pwRole} 
                              onChange={handleChange} 
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500" 
                              placeholder="e.g. Sales Leader, Executive, Founder" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Employer / Company Name (Optional)</label>
                            <input name="employer" value={formData.employer} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500" placeholder="e.g. Google, Stripe" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-t border-stone-800 pt-6">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Financial Snapshot</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Approx. Household Net Worth (Excl. Home)</label>
                            <select required name="pwNetWorth" value={formData.pwNetWorth} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500">
                                <option value="">Select range...</option>
                                <option>Under $500k</option>
                                <option>$500k – $1M</option>
                                <option>$1M – $3M</option>
                                <option>$3M – $5M</option>
                                <option>$5M – $10M</option>
                                <option>$10M+</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Approx. Annual Household Income</label>
                            <select required name="pwAnnualComp" value={formData.pwAnnualComp} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500">
                                <option value="">Select range...</option>
                                <option>Under $200k</option>
                                <option>$200k – $400k</option>
                                <option>$400k – $750k</option>
                                <option>$750k – $1.5M</option>
                                <option>$1.5M+</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-t border-stone-800 pt-6">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Reason for the Call</h4>
                    <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">What prompted you to book today?</label>
                        <select required name="discoveryReason" value={formData.discoveryReason} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500">
                            <option value="">Select one...</option>
                            <option>Getting organized / clarity</option>
                            <option>Reducing taxes</option>
                            <option>Managing variable or equity compensation</option>
                            <option>Preparing for a major decision or transition</option>
                            <option>Exploring ongoing advisory support</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Anything else we should know? (Optional)</label>
                        <textarea name="discoveryNotes" value={formData.discoveryNotes} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 h-24 resize-none outline-none focus:border-emerald-500" placeholder="Specific questions or details..." />
                    </div>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold py-5 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 text-lg">
                    Confirm & View Calendar <ChevronRight size={20} />
                </button>
              </form>
          ) : step === 'pw-intake' ? (
              <form onSubmit={handleNext} className="space-y-8">
                  <div className="flex items-start gap-4 p-4 bg-stone-950 border border-stone-800 rounded-xl">
                      <Shield className="text-emerald-500 shrink-0 mt-1" size={20} />
                      <p className="text-sm text-stone-300 leading-relaxed">
                          This offering is designed for households with complex financial planning needs. A brief overview helps us prepare for a productive conversation.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Contact Identity</h4>
                          <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Full Name</label>
                              <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500" placeholder="Jane Doe" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Email</label>
                                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500" placeholder="jane@email.com" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Phone</label>
                                  <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500" placeholder="555-0123" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">State of Residence</label>
                              <input required name="state" value={formData.state} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500" placeholder="CA, NY, etc." />
                          </div>
                      </div>

                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Wealth Profile</h4>
                          <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Approx. Net Worth (Excl. Residence)</label>
                              <select required name="pwNetWorth" value={formData.pwNetWorth} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500">
                                  <option value="">Select range...</option>
                                  <option>Less than $1M</option>
                                  <option>$1–2M</option>
                                  <option>$2–5M</option>
                                  <option>$5–10M</option>
                                  <option>$10M+</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Primary Role / Function</label>
                              <select required name="pwRole" value={formData.pwRole} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500">
                                  <option value="">Select role...</option>
                                  <option>Business Owner / Founder</option>
                                  <option>Executive (C-suite)</option>
                                  <option>VP / Director</option>
                                  <option>Senior Individual Contributor</option>
                                  <option>Professional / Partner</option>
                                  <option>Other</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Desired Timing</label>
                              <select required name="pwTiming" value={formData.pwTiming} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none focus:border-emerald-500">
                                  <option value="">Select timing...</option>
                                  <option>Immediately (0–30 days)</option>
                                  <option>Soon (1–3 months)</option>
                                  <option>Exploring options (3–6 months)</option>
                              </select>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Planning Focus</h4>
                      <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-3">Primary Planning Complexity (Select up to 2)</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {[
                                  "Concentrated stock or equity compensation",
                                  "Liquidity event or upcoming sale",
                                  "Advanced tax planning",
                                  "Estate or trust coordination",
                                  "Multi-entity or multi-income household",
                                  "High income with inconsistent cash flow",
                                  "Other"
                              ].map(item => (
                                  <button
                                      key={item}
                                      type="button"
                                      onClick={() => toggleComplexity(item)}
                                      className={`p-3 text-left rounded-lg text-[11px] font-bold transition-all border ${
                                          formData.pwComplexities.includes(item)
                                          ? 'bg-emerald-900/30 border-emerald-500 text-emerald-100 shadow-lg'
                                          : 'bg-stone-950 border-stone-800 text-stone-500 hover:border-stone-700'
                                      }`}
                                  >
                                      {item}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Comp. type (Variable or Equity %)</label>
                              <select required name="pwVariablePct" value={formData.pwVariablePct} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none">
                                  <option value="">Select %...</option>
                                  <option>0–10%</option>
                                  <option>10–25%</option>
                                  <option>25–50%</option>
                                  <option>50%+</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Approx. Annual Compensation</label>
                              <select required name="pwAnnualComp" value={formData.pwAnnualComp} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 outline-none">
                                  <option value="">Select comp...</option>
                                  <option>Under $250K</option>
                                  <option>$250K–$500K</option>
                                  <option>$500K–$1M</option>
                                  <option>$1M+</option>
                              </select>
                          </div>
                      </div>

                      <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-2">Anything else we should know? (Optional)</label>
                          <textarea name="pwNotes" value={formData.pwNotes} onChange={handleChange} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-stone-200 h-24 resize-none" placeholder="Details about your specific situation..." />
                      </div>
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold py-5 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 text-lg">
                      Request Private Wealth Access <ChevronRight size={20} />
                  </button>
              </form>
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
                {/* Simplified check to avoid Redundant comparisons on narrowed union types */}
                {step === 'details' && (
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
                {/* 
                  Dot 1: Represents Step 1 (contact, pw-intake, or discovery-intake).
                  Use type assertions (as string) to prevent narrowing overlap errors in JSX.
                */}
                <div className={`h-2 w-2 rounded-full transition-colors ${ ((step as string) === 'contact' || (step as string) === 'pw-intake' || (step as string) === 'discovery-intake') ? 'bg-emerald-500' : 'bg-emerald-900'}`}></div>
                {source === 'general' && (
                    <div className={`h-2 w-2 rounded-full transition-colors ${step === 'details' ? 'bg-emerald-500' : step === 'calendar' ? 'bg-emerald-900' : 'bg-stone-800'}`}></div>
                )}
                <div className={`h-2 w-2 rounded-full transition-colors ${step === 'calendar' ? 'bg-emerald-500' : 'bg-stone-800'}`}></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
