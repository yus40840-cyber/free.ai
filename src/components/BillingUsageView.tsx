import React from 'react';
import { 
  CreditCard, DollarSign, Download, ArrowRight, ShieldCheck, 
  Coins, Check, RefreshCw, AlertCircle, Clock 
} from 'lucide-react';
import { BillingInvoice, UserState } from '../types';

interface BillingUsageViewProps {
  user: UserState;
  onOpenPricing: () => void;
  onBuyCredits: (amount: number, price: string) => void;
  onBackToDashboard: () => void;
}

export const BillingUsageView: React.FC<BillingUsageViewProps> = ({
  user,
  onOpenPricing,
  onBuyCredits,
  onBackToDashboard
}) => {
  const invoices: BillingInvoice[] = [
    {
      id: 'INV-2026-0914',
      date: 'Oct 01, 2026',
      amount: user.plan === 'Student' ? '$9.99' : user.plan === 'Pro' ? '$19.99' : '$0.00',
      status: 'Paid',
      plan: user.plan,
      invoiceUrl: '#'
    },
    {
      id: 'INV-2026-0812',
      date: 'Sep 01, 2026',
      amount: '$9.99',
      status: 'Paid',
      plan: 'Student',
      invoiceUrl: '#'
    },
    {
      id: 'INV-2026-0701',
      date: 'Aug 01, 2026',
      amount: '$9.99',
      status: 'Paid',
      plan: 'Student',
      invoiceUrl: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      
      {/* Header */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Account & Subscriptions</div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
              Subscription & Usage Management
            </h1>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            Back to Dashboard
          </button>
        </div>
      </section>

      {/* Main Billing Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Active Plan Card (Spec #46) */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Current Plan</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Subscription
              </span>
            </div>

            <div className="text-2xl font-serif font-bold text-neutral-900 mt-1">
              {user.plan} Plan
            </div>

            <p className="text-xs text-neutral-500 mt-1">
              Next scheduled billing cycle on <strong className="text-neutral-800">{user.nextBillingDate}</strong> ({user.planBillingCycle})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPricing}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm"
            >
              Change / Upgrade Plan
            </button>
            <button
              onClick={() => alert('Billing portal session would open via Stripe/Paddle securely.')}
              className="px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg"
            >
              Manage Payment Method
            </button>
          </div>
        </div>

        {/* Credit Balance & Top-Up */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-700">AI Credits Available</span>
              <Coins className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-bold font-mono-numbers text-neutral-900">
              {user.aiUnits.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Credits roll over and never expire while your plan is active.
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-600">Need more credits?</span>
              <button
                onClick={() => onBuyCredits(1000, '$5')}
                className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
              >
                <span>Add 1,000 Credits ($5)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div className="text-xs font-semibold text-neutral-700 mb-3">
              Monthly Usage Breakdown (Spec #46)
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">AI Model Requests</span>
                <span className="font-mono-numbers font-semibold text-neutral-900">312 requests</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Active Documents</span>
                <span className="font-mono-numbers font-semibold text-neutral-900">17 created</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Research & Evidence Extractions</span>
                <span className="font-mono-numbers font-semibold text-neutral-900">28 sources</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Document Exports (DOCX / PDF)</span>
                <span className="font-mono-numbers font-semibold text-neutral-900">9 exports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History (Spec #47) */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <h2 className="text-base font-serif font-bold text-neutral-900 mb-4">
            Billing & Invoices History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-2.5">Invoice #</th>
                  <th className="py-2.5">Billing Date</th>
                  <th className="py-2.5">Plan</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-800">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-3 font-semibold text-neutral-900">{inv.id}</td>
                    <td className="py-3 text-neutral-600">{inv.date}</td>
                    <td className="py-3 capitalize">{inv.plan}</td>
                    <td className="py-3 font-bold font-mono-numbers">{inv.amount}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => alert(`Downloading PDF invoice for ${inv.id}...`)}
                        className="text-xs text-neutral-700 hover:text-neutral-950 font-medium inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

    </div>
  );
};
