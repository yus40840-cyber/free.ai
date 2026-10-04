import React from 'react';
import { 
  Sparkles, BookOpen, Compass, ShieldCheck, FileText, CheckCircle2, 
  ArrowRight, Layers, Cpu, Search, Check, RefreshCw, Bookmark, Clock
} from 'lucide-react';
import { DocumentType } from '../types';

interface FeaturesViewProps {
  onStartWriting: (type?: DocumentType) => void;
  onOpenPricing: () => void;
}

export const FeaturesView: React.FC<FeaturesViewProps> = ({
  onStartWriting,
  onOpenPricing,
}) => {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      
      {/* Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-500 mb-4 tracking-wide">
          <span>Enterprise Academic Engine</span>
          <span aria-hidden="true">·</span>
          <span>Multi-Model AI Gateway</span>
          <span aria-hidden="true">·</span>
          <span>Voice Preservation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 mb-4">
          Architected for Rigorous Academic Work
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
          ScholarFlow combines multi-model AI routing, deep PDF evidence extraction, and personal stylistic calibration into one seamless workspace.
        </p>
      </section>

      {/* 5 Core Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. Multi-Stage Academic Orchestrator */}
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xs">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
              01. Multi-Stage Academic Orchestration
            </div>
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-3">
              Guaranteed Word Counts & Context-Preserved Synthesis
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Never experience truncated generations or missed word limits. For 100, 500, 1,000, or 5,000+ words, ScholarFlow decomposes complex topics into structured sections, executes contextual multi-model reasoning in the background, and runs automated expansion checks to guarantee your required length.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Multi-section orchestration for 5,000+ word manuscripts</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Automatic word-count validation and precision expansion</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Natural, human-like voice calibration without mechanical cliches</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-neutral-900 text-white font-mono text-xs space-y-3">
            <div className="text-neutral-400">// ScholarFlow Orchestration Matrix</div>
            <div className="flex items-center justify-between p-2 rounded bg-neutral-800">
              <span>Task: Rapid Grammar & Cadence</span>
              <span className="text-emerald-400">High-Speed Engine (~280ms)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-neutral-800">
              <span>Task: Motivation Letter & SOP</span>
              <span className="text-amber-300">Narrative Voice Engine</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-neutral-800">
              <span>Task: Empirical Evidence Synthesis</span>
              <span className="text-cyan-300">Deep Reasoning Engine</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-neutral-800">
              <span>Task: 5,000+ Word Manuscript Chunking</span>
              <span className="text-purple-300">Multi-Section Continuity Pipeline</span>
            </div>
          </div>
        </div>

        {/* 2. Research & Source Library */}
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xs">
          <div className="order-2 lg:order-1 p-6 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3 text-xs">
            <div className="font-semibold text-neutral-800">Extracted Source Evidence [Rajpurkar et al., 2023]</div>
            <div className="p-3 bg-white rounded border border-neutral-200 italic text-neutral-600 leading-relaxed font-serif">
              "Cross-attention layers between clinical text and imaging notes can amplify demographic underrepresentation by up to 18% in emergency triage risk scores."
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">Source-Supported</span>
              <span className="text-neutral-400 text-[11px]">DOI: 10.1038/s41746-023-00812-z</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
              02. Research & Grounded Evidence
            </div>
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-3">
              Work Directly With Your Academic Literature
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Import PDFs, DOIs, BibTeX, or URLs. ScholarFlow extracts empirical findings, quotes, and statistics, allowing you to cite them directly into your draft with one click.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> PDF and text document parsing</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Real-time claim scanning against library sources</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> One-click in-text citation and blockquote insertion</li>
            </ul>
          </div>
        </div>

        {/* 3. Personal Voice */}
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xs">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
              03. Personal Writing Profile
            </div>
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-3">
              "Make It Sound Like Me"
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Your writing profile captures sentence cadence, vocabulary tier, formality, and authorial conviction. When you select a passage and click "Make it sound like me", the AI calibrates the text to preserve your natural academic voice without generic robotic cliches.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Analyzes past papers to map structural tendencies</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Tunable sliders for formality, vocabulary, and sentence length</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Preserves facts, achievements, and empirical citations strictly</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
              <span>Calibrated Writing Fingerprint</span>
              <span className="text-emerald-700">96% Authentic Match</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded border border-neutral-200">
                <div className="text-neutral-400 text-[10px]">Cadence</div>
                <div className="font-semibold text-neutral-800">Balanced compound</div>
              </div>
              <div className="p-2.5 bg-white rounded border border-neutral-200">
                <div className="text-neutral-400 text-[10px]">Formality</div>
                <div className="font-semibold text-neutral-800">Medium-High Academic</div>
              </div>
              <div className="p-2.5 bg-white rounded border border-neutral-200">
                <div className="text-neutral-400 text-[10px]">First-Person</div>
                <div className="font-semibold text-neutral-800">Balanced authorial "I"</div>
              </div>
              <div className="p-2.5 bg-white rounded border border-neutral-200">
                <div className="text-neutral-400 text-[10px]">Target Level</div>
                <div className="font-semibold text-neutral-800">Master's / Graduate</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Academic Citations & Pre-Flight Review */}
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xs">
          <div className="p-6 rounded-xl bg-neutral-900 text-white space-y-3 font-mono text-xs">
            <div className="text-neutral-400">Pre-Flight Review Summary</div>
            <div className="space-y-1.5 text-neutral-300">
              <div>✓ Grammar & Subject-Verb Syntax: 98%</div>
              <div>✓ Citation Consistency (In-Text to Bib): 95%</div>
              <div>✓ Thesis & Argumentative Flow: 94%</div>
              <div>✓ Section Completeness & Word Band: 92%</div>
            </div>
            <div className="p-2 rounded bg-amber-950/80 border border-amber-800 text-amber-200 text-[11px]">
              ⚠ Recommendation: Ground paragraph 4 empirical data with an explicit citation.
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
              04. Citations & Pre-Flight Review
            </div>
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-3">
              Automated 9-Dimension Submission Audit
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Before submitting your research paper, thesis, or application, run the automated Pre-Flight Review. It scans for unsupported claims, missing bibliographic entries, repeated phrases, and word limit compliance.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Automatic formatting in APA 7, MLA 9, Chicago, Harvard, IEEE, Vancouver</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Unused citation detector and missing reference warnings</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> One-click copy or export formatted bibliography</li>
            </ul>
          </div>
        </div>

      </section>

      {/* CTA Bottom Banner */}
      <section className="pt-16 max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
          Ready to experience the student writing workspace?
        </h3>
        <p className="text-sm text-neutral-600 mb-6">
          Start with 100 free AI units. No credit card required.
        </p>
        <button
          onClick={() => onStartWriting('motivation-letter')}
          className="px-8 py-3.5 bg-neutral-900 text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Start Writing Now
        </button>
      </section>

    </div>
  );
};
