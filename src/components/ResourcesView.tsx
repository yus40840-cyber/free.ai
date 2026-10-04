import React from 'react';
import { BookOpen, FileText, CheckCircle2, Bookmark, ShieldCheck, ArrowRight } from 'lucide-react';
import { DocumentType } from '../types';

interface ResourcesViewProps {
  onStartWriting: (type?: DocumentType) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onStartWriting }) => {
  const guides = [
    {
      title: 'The Architecture of an Ivy League & ETH Statement of Purpose',
      category: 'Graduate Applications',
      readTime: '6 min read',
      summary: 'Why admissions committees prioritize empirical preparation over vague enthusiasm, and how to structure your faculty alignment sections.',
      actionType: 'sop' as DocumentType
    },
    {
      title: 'APA 7 vs IEEE vs Harvard: Complete Citation Guide',
      category: 'Academic Tools',
      readTime: '8 min read',
      summary: 'Rules for parenthetical citations, multiple authors, electronic DOIs, and constructing an audit-proof bibliography.',
      actionType: 'research-paper' as DocumentType
    },
    {
      title: 'Preserving Student Voice While Working With AI',
      category: 'Writing Profile',
      readTime: '5 min read',
      summary: 'How to avoid formulaic robotic sentence patterns (delve, tapestry, testament) by calibrating sentence length and authorial conviction.',
      actionType: 'motivation-letter' as DocumentType
    },
    {
      title: 'Formulating Empirical Research Questions & Literature Gaps',
      category: 'Research Methodology',
      readTime: '7 min read',
      summary: 'Delineating bounded empirical variables from theoretical abstractions for research proposals and theses.',
      actionType: 'proposal' as DocumentType
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      
      {/* Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 mb-3">
          Academic Writing Guides & Standards
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
          Practical handbooks on academic voice, graduate school admissions, peer-reviewed methodology, and citation rigor.
        </p>
      </section>

      {/* Guides Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((g, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-2 font-mono">
                  <span>{g.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{g.readTime}</span>
                </div>

                <h3 className="text-base font-serif font-bold text-neutral-900 group-hover:text-amber-900 transition-colors mb-2">
                  {g.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  {g.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => onStartWriting(g.actionType)}
                  className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5 hover:underline"
                >
                  <span>Open in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Integrity & Privacy Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Academic Integrity & Privacy Constitution (Master Spec #60, #61)</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            ScholarFlow is designed as a student workspace for planning, drafting, and organizing evidence in your authentic voice. We enforce strict data protection: your documents and research sources are encrypted and never used for general public model training. You retain 100% intellectual copyright over all exported papers.
          </p>
        </div>
      </section>

    </div>
  );
};
