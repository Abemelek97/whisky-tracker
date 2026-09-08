import React, { useState } from 'react';
import { Wine, PhoneCall, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ONBOARDING_STEPS } from '../data/mockShipments';

export default function OnboardingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const getStepIcon = (iconKey) => {
    switch (iconKey) {
      case 'wine':
        return <Wine className="w-10 h-10 text-amber-500" />;
      case 'phone':
        return <PhoneCall className="w-10 h-10 text-sky-400" />;
      case 'check':
        return <CheckCircle2 className="w-10 h-10 text-emerald-400" />;
      default:
        return null;
    }
  };

  const handleFinish = () => {
    setStep(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-center">
        
        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {ONBOARDING_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === step ? 'w-8 bg-amber-500' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center justify-center shadow-inner">
          {getStepIcon(ONBOARDING_STEPS[step].iconKey)}
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2">
          {ONBOARDING_STEPS[step].title}
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          {ONBOARDING_STEPS[step].desc}
        </p>

        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              Skip
            </button>
          )}

          {step < ONBOARDING_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-sm font-semibold transition cursor-pointer ml-auto"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-sm font-semibold transition cursor-pointer ml-auto flex items-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" /> Start Tracking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}