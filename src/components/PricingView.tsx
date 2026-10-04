import React, { useState } from 'react';
import { Check, Coins, Sparkles, Shield, Building, Award, ArrowRight } from 'lucide-react';
import { PlanType, UserState } from '../types';

interface PricingViewProps {
  user: UserState;
  onSelectPlan: (plan: PlanType, cycle: 'monthly' | 'annual') => void;
  onBuyCredits: (amount: number, price: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  user,
  onSelectPlan,
  onBuyCredits,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans: {
    type: PlanType;
    name: string;
    monthlyPrice: string;
    annualPrice: string;
    credits: string;
    badge?: string;
    description: string;
    features: string[];
    buttonText: string;
    popular?: boolean;
  }[] = [
    {
      type: 'Free',
      name: 'Free',
      monthlyPrice: '$0',
      annualPrice: '$0',
      credits: '100 AI credits',
      description: 'Ideal for trying out the editor and basic grammar formatting.',
      features: [
        '100 AI credits / month',
        '3 active documents',
        'Basic AI writing & grammar',
        'Basic templates',
        'Standard citations (APA, MLA)',
        'DOCX / PDF export'
      ],
      buttonText: user.plan === 'Free' ? 'Current Plan' : 'Select Free'
    },
    {
      type: 'Student',
      name: 'Student',
      monthlyPrice: '$9.99',
      annualPrice: '$7.99',
      credits: '2,000 AI credits',
      badge: 'Most Popular',
      popular: true,
      description: 'Everything you need for graduate applications, SOPs, and papers.',
      features: [
        '2,000 AI credits / month',
        '30 active documents',
        'Multi-model AI routing (Gemini + Claude + DeepSeek)',
        'Personal Writing Profile ("Make it sound like me")',
        'SOP & Motivation Letter workflows',
        'PDF sources & evidence extraction',
        'Full 9-dimension pre-flight review',
        'Version history & restore'
      ],
      buttonText: user.plan === 'Student' ? 'Current Plan' : 'Upgrade to Student'
    },
    {
      type: 'Pro',
      name: 'Pro',
      monthlyPrice: '$19.99',
      annualPrice: '$15.99',
      credits: '6,000 AI credits',
      description: 'For active graduate students and multi-paper thesis writers.',
      features: [
        '6,000 AI credits / month',
        '100 active documents',
        'Deep research reasoning (DeepSeek R1)',
        'Semantic evidence extraction from large PDFs',
        'Priority AI server processing',
        'Advanced multi-style citation manager',
        'Dedicated writing style presets'
      ],
      buttonText: user.plan === 'Pro' ? 'Current Plan' : 'Upgrade to Pro'
    },
    {
      type: 'Researcher',
      name: 'Researcher',
      monthlyPrice: '$39.99',
      annualPrice: '$31.99',
      credits: '15,000 AI credits',
      description: 'Maximum capacity for lab researchers and publication authors.',
      features: [
        '15,000 AI credits / month',
        'Unlimited active documents',
        'Large research projects & multi-PDF synthesis',
        'Literature review thematic synthesis matrix',
        'Highest priority model orchestration',
        'Full document intelligence audit'
      ],
      buttonText: user.plan === 'Researcher' ? 'Current Plan' : 'Select Researcher'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      
      {/* Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 mb-3">
          Transparent Academic Plans
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto mb-8">
          One unified platform with automatic multi-model routing. No hidden token math—simple, predictable AI credits.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="inline-flex items-center gap-2 p-1.5 bg-neutral-200/80 rounded-xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              billingCycle === 'monthly' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Save 20%</span>
          </button>
        </div>
      </section>

      {/* 4 Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const price = billingCycle === 'monthly' ? p.monthlyPrice : p.annualPrice;
            const isCurrent = user.plan === p.type;

            return (
              <div
                key={p.type}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all ${
                  p.popular 
                    ? 'bg-neutral-900 text-white border-2 border-neutral-900 shadow-md relative' 
                    : 'bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 right-6 bg-amber-400 text-neutral-950 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wide">
                    {p.badge}
                  </span>
                )}

                <div>
                  <div className="text-base font-serif font-bold">{p.name}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono-numbers">{price}</span>
                    <span className={`text-xs ${p.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {p.monthlyPrice !== '$0' ? (billingCycle === 'monthly' ? '/mo' : '/mo, billed annually') : ''}
                    </span>
                  </div>

                  <div className={`text-xs font-medium mt-1 font-mono-numbers ${p.popular ? 'text-amber-300' : 'text-neutral-900'}`}>
                    {p.credits}
                  </div>

                  <p className={`text-xs mt-3 leading-relaxed ${p.popular ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {p.description}
                  </p>

                  <div className={`my-5 border-t ${p.popular ? 'border-neutral-800' : 'border-neutral-100'}`} />

                  <ul className="space-y-2.5 text-xs">
                    {p.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${p.popular ? 'text-amber-400' : 'text-neutral-900'}`} />
                        <span className={p.popular ? 'text-neutral-200' : 'text-neutral-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPlan(p.type, billingCycle)}
                  className={`mt-8 w-full py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                    p.popular
                      ? 'bg-white text-neutral-950 hover:bg-neutral-100'
                      : isCurrent
                        ? 'bg-neutral-100 text-neutral-500 cursor-default'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {p.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Credit Top-up Packs (Master Spec #14) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                On-Demand Refills
              </div>
              <h2 className="text-xl font-serif font-bold text-neutral-900 mt-1">
                Purchase Additional AI Credits
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Credits never expire. Top up anytime without altering your monthly plan.
              </p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <span className="text-neutral-500">Your Current Balance:</span>{' '}
              <strong className="text-neutral-900 font-mono-numbers">{user.aiUnits.toLocaleString()} credits</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
              <div>
                <div className="font-semibold text-sm text-neutral-900">1,000 Credits</div>
                <div className="text-2xl font-bold font-mono-numbers text-neutral-900 mt-2">$5</div>
                <div className="text-[11px] text-neutral-500 mt-1">~500 rewrites or 100 section drafts</div>
              </div>
              <button
                onClick={() => onBuyCredits(1000, '$5')}
                className="mt-4 w-full py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
              >
                Buy 1,000 Credits
              </button>
            </div>

            <div className="p-4 rounded-xl border-2 border-neutral-900 bg-white flex flex-col justify-between shadow-2xs relative">
              <span className="absolute -top-2.5 right-4 bg-neutral-900 text-white text-[9px] uppercase px-2 py-0.5 rounded font-bold">
                Best Value
              </span>
              <div>
                <div className="font-semibold text-sm text-neutral-900">5,000 Credits</div>
                <div className="text-2xl font-bold font-mono-numbers text-neutral-900 mt-2">$20</div>
                <div className="text-[11px] text-neutral-500 mt-1">Full thesis, literature reviews, and SOPs</div>
              </div>
              <button
                onClick={() => onBuyCredits(5000, '$20')}
                className="mt-4 w-full py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
              >
                Buy 5,000 Credits
              </button>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
              <div>
                <div className="font-semibold text-sm text-neutral-900">10,000 Credits</div>
                <div className="text-2xl font-bold font-mono-numbers text-neutral-900 mt-2">$35</div>
                <div className="text-[11px] text-neutral-500 mt-1">Extended research & multi-model synthesis</div>
              </div>
              <button
                onClick={() => onBuyCredits(10000, '$35')}
                className="mt-4 w-full py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
              >
                Buy 10,000 Credits
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Operation Ledger (Master Spec #13) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-lg font-serif font-bold text-neutral-900 mb-2">
          Transparent AI Credit Ledger
        </h2>
        <p className="text-xs text-neutral-500 mb-4">
          Every operation has a fixed, documented credit deduction based on model compute requirements.
        </p>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-neutral-100 text-xs">
          <div className="grid grid-cols-3 p-3 bg-neutral-50 font-semibold text-neutral-700">
            <span>Operation</span>
            <span>Target AI Engine</span>
            <span className="text-right">Credits Deducted</span>
          </div>

          <div className="grid grid-cols-3 p-3 text-neutral-800">
            <span>Grammar & Academic Polish</span>
            <span className="text-neutral-500 font-mono">Google Gemini 3.8 Flash</span>
            <span className="text-right font-mono font-bold text-neutral-900">1 Credit</span>
          </div>

          <div className="grid grid-cols-3 p-3 text-neutral-800">
            <span>"Make It Sound Like Me" / Rewrite</span>
            <span className="text-neutral-500 font-mono">Anthropic Claude 3.5 Sonnet</span>
            <span className="text-right font-mono font-bold text-neutral-900">2 Credits</span>
          </div>

          <div className="grid grid-cols-3 p-3 text-neutral-800">
            <span>Source Summary & Claim Check</span>
            <span className="text-neutral-500 font-mono">Google Gemini 3.8 Flash</span>
            <span className="text-right font-mono font-bold text-neutral-900">2 Credits</span>
          </div>

          <div className="grid grid-cols-3 p-3 text-neutral-800">
            <span>Structured Outline Generation</span>
            <span className="text-neutral-500 font-mono">Claude / Gemini</span>
            <span className="text-right font-mono font-bold text-neutral-900">3 Credits</span>
          </div>

          <div className="grid grid-cols-3 p-3 text-neutral-800">
            <span>Section Drafting (Grounded)</span>
            <span className="text-neutral-500 font-mono">Claude 3.5 Sonnet</span>
            <span className="text-right font-mono font-bold text-neutral-900">5 Credits</span>
          </div>

          <div className="grid grid-cols-3 p-3 text-neutral-800">
            <span>Pre-Flight 9-Dimension Final Audit</span>
            <span className="text-neutral-500 font-mono">OpenAI GPT-4o</span>
            <span className="text-right font-mono font-bold text-neutral-900">5 Credits</span>
          </div>

          <div className="grid grid-cols-3 p-3 text-neutral-800">
            <span>Deep Research Synthesis</span>
            <span className="text-neutral-500 font-mono">DeepSeek R1 Reasoning</span>
            <span className="text-right font-mono font-bold text-neutral-900">10 Credits</span>
          </div>
        </div>
      </section>

    </div>
  );
};
