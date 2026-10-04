import React from 'react';
import { 
  ArrowRight, ShieldCheck, Bookmark, Compass, Sparkles, FileText, 
  CheckCircle2, Award, BookOpen, GraduationCap, Cpu, Layers, Check, 
  ChevronRight, RefreshCw, Upload, Download 
} from 'lucide-react';
import { DocumentType } from '../types';

interface LandingViewProps {
  onStartWriting: (type?: DocumentType) => void;
  onOpenDashboard: () => void;
  onOpenProfile: () => void;
  onNavigate: (view: any) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartWriting,
  onOpenDashboard,
  onOpenProfile,
  onNavigate,
}) => {
  const documentTypes: { type: DocumentType; label: string; desc: string; icon: string }[] = [
    { type: 'research-paper', label: 'Research Paper', desc: 'Hypothesis, literature, empirical analysis, and references', icon: '🔬' },
    { type: 'motivation-letter', label: 'Motivation Letter', desc: 'University programs, scholarships, and graduate school applications', icon: '🏛️' },
    { type: 'sop', label: 'Statement of Purpose', desc: 'Academic background, research trajectory, and faculty synergy', icon: '📜' },
    { type: 'essay', label: 'Academic Essay', desc: 'Argumentative structure, thesis development, and source synthesis', icon: '✍️' },
    { type: 'proposal', label: 'Research Proposal', desc: 'Methodology, research questions, literature gap, and timeline', icon: '📐' },
    { type: 'literature-review', label: 'Literature Review', desc: 'Thematic grouping, synthesis matrix, and critical appraisal', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Anti-slop zero pill metadata */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-500 mb-6 tracking-wide">
          <span>Student Writing Workspace</span>
          <span aria-hidden="true">·</span>
          <span>OpenAI + Claude + Gemini + DeepSeek</span>
          <span aria-hidden="true">·</span>
          <span>Authentic Voice Preservation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-neutral-900 max-w-3xl mx-auto leading-tight mb-6">
          Write better. Research smarter. <br />
          <span className="italic font-normal text-neutral-700">Sound like yourself.</span>
        </h1>

        <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Create research papers, SOPs, motivation letters, essays, proposals, and other academic documents with an intelligent writing workspace powered by multiple leading AI models.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={() => onStartWriting('motivation-letter')}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Writing Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <button
            onClick={() => onNavigate('features')}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors shadow-2xs"
          >
            Explore Features
          </button>
        </div>

        {/* Hero Application Preview Mockup (Master Spec #2) */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-neutral-300 shadow-xl overflow-hidden text-left text-xs font-sans">
          
          {/* Mockup Header */}
          <div className="bg-neutral-100 px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 font-bold font-serif text-neutral-800">ScholarFlow</span>
            </div>
            <div className="font-mono text-neutral-600 font-semibold font-mono-numbers">
              1,472 Credits Available
            </div>
          </div>

          {/* Mockup 3-Pane Body */}
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200 bg-white min-h-[260px]">
            
            {/* Left Nav */}
            <div className="p-3 bg-neutral-50/60 space-y-1.5 text-neutral-600 hidden md:block">
              <div className="font-semibold text-neutral-900 pb-1 border-b border-neutral-200">Documents</div>
              <div className="text-neutral-900 font-medium">Motivation Letter (ETH Zurich)</div>
              <div>Research Paper on Bias</div>
              <div>Master's Thesis Prospectus</div>
              <div className="pt-2 font-semibold text-neutral-900">Sources (3 attached)</div>
              <div className="italic text-[11px] text-neutral-500">Rajpurkar et al. (2023)</div>
            </div>

            {/* Center Content */}
            <div className="md:col-span-2 p-5 font-serif text-neutral-800 space-y-3 leading-relaxed">
              <div className="font-bold text-sm font-sans text-neutral-900">
                Motivation Letter: MSc Computer Science
              </div>
              <p className="text-xs">
                Having cultivated a rigorous foundation in systems engineering, I have come to recognize that the paramount bottleneck facing next-generation autonomous computing is the architectural throughput of distributed consensus.
              </p>
              <div className="p-2 rounded bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 italic">
                "Make it sound like me" applied · Matched student's balanced authorial voice and active first-person conviction.
              </div>
            </div>

            {/* Right AI Assistant */}
            <div className="p-3 bg-neutral-50/60 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-neutral-900 border-b border-neutral-200 pb-1">
                <span>AI Gateway</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 rounded font-mono">Claude 3.5</span>
              </div>
              <div className="space-y-1 text-neutral-700">
                <div className="p-1.5 rounded bg-white border border-neutral-200 flex items-center justify-between">
                  <span>Sound Like Me</span>
                  <Sparkles className="w-3 h-3 text-amber-600" />
                </div>
                <div className="p-1.5 rounded bg-white border border-neutral-200 flex items-center justify-between">
                  <span>Check Citations</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="p-1.5 rounded bg-white border border-neutral-200 flex items-center justify-between">
                  <span>Verify Claims</span>
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Three Selling Points */}
      <section className="py-12 border-y border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 font-serif">
                01. Personalized
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Writing based on your factual background and preferred style. Our system extracts your sentence cadence and tone to keep your authentic voice intact.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center mb-4">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 font-serif">
                02. Research-Grounded
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Organize PDFs, DOIs, and citations into active evidence. The AI flags statements that need attribution and cites your literature seamlessly.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 font-serif">
                03. Student-Controlled
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                You approve every outline section, review diff suggestions, and decide what stays in the final manuscript.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5-Step "How It Works" Section (Master Spec #5) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
            How It Works
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            From Blank Page to Submission-Ready Document
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="p-5 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center mx-auto">
              1
            </div>
            <div className="font-semibold text-sm text-neutral-900">Choose Document</div>
            <p className="text-xs text-neutral-500">Pick from SOP, Motivation Letter, Research Paper, or Essay.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center mx-auto">
              2
            </div>
            <div className="font-semibold text-sm text-neutral-900">Tell Us About It</div>
            <p className="text-xs text-neutral-500">Answer guided questions about your target program or research questions.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center mx-auto">
              3
            </div>
            <div className="font-semibold text-sm text-neutral-900">Add Your Sources</div>
            <p className="text-xs text-neutral-500">Upload PDFs, enter DOIs, or paste BibTeX references.</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center mx-auto">
              4
            </div>
            <div className="font-semibold text-sm text-neutral-900">Write & Calibrate</div>
            <p className="text-xs text-neutral-500">Draft with AI, refine in your authentic voice with "Make it sound like me".</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center mx-auto">
              5
            </div>
            <div className="font-semibold text-sm text-neutral-900">Review & Export</div>
            <p className="text-xs text-neutral-500">Run 9-point submission review, then export to DOCX or PDF.</p>
          </div>
        </div>
      </section>

      {/* Guided Workflows Selection */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mb-2">
            What would you like to write today?
          </h2>
          <p className="text-xs text-neutral-600">
            Select a document type to begin an intuitive guided questionnaire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {documentTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => onStartWriting(item.type)}
              className="text-left p-5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h4 className="text-base font-semibold text-neutral-900 group-hover:text-amber-900 transition-colors mb-1 font-serif">
                  {item.label}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>Start Guided Workflow</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-neutral-700" />
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
