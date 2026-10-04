import React from 'react';
import { X, Check, Coins, Sparkles, Shield, GraduationCap, Building } from 'lucide-react';
import { PlanType, UserState } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserState;
  onSelectPlan: (plan: PlanType) => void;
  onAddUnits: (units: number) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  user,
  onSelectPlan,
  onAddUnits
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Student Plans & Academic Credits</div>
            <h2 className="text-lg font-serif font-bold text-neutral-900">
              ScholarFlow Transparent Plans
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* Current balance */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-neutral-500">Current Plan & Balance</div>
              <div className="text-base font-bold text-neutral-900 mt-0.5 font-serif">
                {user.plan} Plan · <span className="font-mono-numbers">{user.aiUnits.toLocaleString()}</span> Credits
              </div>
            </div>
            <button
              onClick={() => {
                onAddUnits(500);
                alert('Added 500 academic AI credits to your workspace!');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Refill 500 Credits (Demo)</span>
            </button>
          </div>

          {/* Transparent Unit Rates */}
          <div>
            <div className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              Transparent Credit System (Master Spec #13)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-neutral-600">
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-white">
                <div className="font-semibold text-neutral-900">Grammar</div>
                <div className="font-mono text-neutral-500 mt-0.5">1 Credit</div>
              </div>
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-white">
                <div className="font-semibold text-neutral-900">Rewriting</div>
                <div className="font-mono text-neutral-500 mt-0.5">2 Credits</div>
              </div>
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-white">
                <div className="font-semibold text-neutral-900">Outline Gen</div>
                <div className="font-mono text-neutral-500 mt-0.5">3 Credits</div>
              </div>
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-white">
                <div className="font-semibold text-neutral-900">Section Draft</div>
                <div className="font-mono text-neutral-500 mt-0.5">5 Credits</div>
              </div>
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-white">
                <div className="font-semibold text-neutral-900">Full Audit</div>
                <div className="font-mono text-neutral-500 mt-0.5">5 Credits</div>
              </div>
            </div>
          </div>

          {/* Three Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Free */}
            <div className="p-5 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-neutral-900">Free Student</h3>
                <div className="text-2xl font-bold font-mono-numbers text-neutral-900 mt-2">$0</div>
                <div className="text-xs text-neutral-500 mt-0.5">100 AI credits / month</div>
                <div className="my-4 border-t border-neutral-100" />
                <ul className="space-y-2 text-xs text-neutral-600">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-neutral-900" /> 3 active documents</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-neutral-900" /> Standard citation tools</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-neutral-900" /> 100 AI credits / month</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  onSelectPlan('Free');
                  onClose();
                }}
                className={`mt-6 w-full py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  user.plan === 'Free'
                    ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                    : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {user.plan === 'Free' ? 'Current Plan' : 'Select Free'}
              </button>
            </div>

            {/* Student */}
            <div className="p-5 rounded-xl border-2 border-neutral-900 bg-neutral-900 text-white flex flex-col justify-between shadow-md relative">
              <span className="absolute -top-2.5 right-4 bg-amber-400 text-neutral-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wide">
                Most Popular
              </span>
              <div>
                <h3 className="font-serif font-bold text-base text-white">Student Plan</h3>
                <div className="text-2xl font-bold font-mono-numbers text-white mt-2">$9.99 <span className="text-xs font-normal text-neutral-400">/ mo</span></div>
                <div className="text-xs text-neutral-400 mt-0.5">2,000 AI credits / month</div>
                <div className="my-4 border-t border-neutral-800" />
                <ul className="space-y-2 text-xs text-neutral-300">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> 30 active documents</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> Personal Writing Profile</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> Multi-model AI routing</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> Pre-flight 9-point audit</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400" /> 2,000 AI credits / month</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  onSelectPlan('Student');
                  onClose();
                }}
                className={`mt-6 w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                  user.plan === 'Student'
                    ? 'bg-neutral-800 text-neutral-300'
                    : 'bg-white text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                {user.plan === 'Student' ? 'Current Plan' : 'Select Student'}
              </button>
            </div>

            {/* Pro */}
            <div className="p-5 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-neutral-900">Pro Plan</h3>
                <div className="text-2xl font-bold font-mono-numbers text-neutral-900 mt-2">$19.99 <span className="text-xs font-normal text-neutral-500">/ mo</span></div>
                <div className="text-xs text-neutral-500 mt-0.5">6,000 AI credits / month</div>
                <div className="my-4 border-t border-neutral-100" />
                <ul className="space-y-2 text-xs text-neutral-600">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-neutral-900" /> 100 active documents</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-neutral-900" /> Deep research reasoning</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-neutral-900" /> Priority processing</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-neutral-900" /> 6,000 AI credits / month</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  onSelectPlan('Pro');
                  onClose();
                }}
                className={`mt-6 w-full py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  user.plan === 'Pro'
                    ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                    : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {user.plan === 'Pro' ? 'Current Plan' : 'Select Pro'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

