import React, { useState } from 'react';
import { BookOpen, Sparkles, ArrowRight, Check, Search, Filter } from 'lucide-react';
import { DocumentType } from '../types';

interface TemplatesViewProps {
  onUseTemplate: (type: DocumentType) => void;
}

interface TemplateCard {
  type: DocumentType;
  category: 'applications' | 'research' | 'academic';
  title: string;
  description: string;
  wordCount: string;
  structure: string[];
  badge?: string;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onUseTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'applications' | 'research' | 'academic'>('all');
  const [search, setSearch] = useState('');

  const templates: TemplateCard[] = [
    // Applications
    {
      type: 'motivation-letter',
      category: 'applications',
      title: 'Graduate Motivation Letter',
      description: 'Structured motivation letter for European and North American MSc/PhD programs and fellowships.',
      wordCount: '650 – 900 words',
      structure: ['Program Alignment', 'Academic Milestones', 'Faculty Synergies', 'Long-term Trajectory'],
      badge: 'Most Popular'
    },
    {
      type: 'sop',
      category: 'applications',
      title: 'Statement of Purpose (SOP)',
      description: 'Rigorous statement of academic trajectory, lab experiences, research objectives, and faculty fit.',
      wordCount: '800 – 1,200 words',
      structure: ['Research Focus', 'Academic Preparation', 'Lab Initiatives', 'Programmatic Synergy', 'Career Vision'],
      badge: 'Graduate Standard'
    },
    {
      type: 'personal-statement',
      category: 'applications',
      title: 'Personal Statement',
      description: 'Reflective personal narrative highlighting formative challenges, intellectual growth, and core motivation.',
      wordCount: '500 – 750 words',
      structure: ['Formative Catalysts', 'Academic Dedication', 'Resilience & Insight', 'Future Intent']
    },
    {
      type: 'scholarship-essay',
      category: 'applications',
      title: 'Scholarship Application Essay',
      description: 'Compelling demonstration of academic merit, societal impact, and financial justification for scholarships.',
      wordCount: '500 – 800 words',
      structure: ['Academic Merit', 'Leadership & Community', 'Financial Context', 'Post-Degree Commitment']
    },

    // Research
    {
      type: 'research-paper',
      category: 'research',
      title: 'Peer-Reviewed Research Paper',
      description: 'Complete academic publication template with empirical methodology, evidence tables, and references.',
      wordCount: '2,500 – 5,000 words',
      structure: ['Abstract & Intro', 'Literature Review', 'Empirical Methodology', 'Results & Findings', 'Discussion', 'References'],
      badge: 'Empirical Rigor'
    },
    {
      type: 'proposal',
      category: 'research',
      title: 'Research Proposal / Thesis Prospectus',
      description: 'Formal proposal delineating research questions, theoretical gaps, data methodology, and milestone timeline.',
      wordCount: '1,500 – 3,000 words',
      structure: ['Problem Statement', 'Literature Gap', 'Research Questions', 'Proposed Methods', 'Timeline & Budget']
    },
    {
      type: 'literature-review',
      category: 'research',
      title: 'Systematic Literature Review',
      description: 'Comprehensive thematic synthesis and critical appraisal of current scholarship in your discipline.',
      wordCount: '2,000 – 4,000 words',
      structure: ['Search Methodology', 'Thematic Frameworks', 'Methodological Comparison', 'Identified Gaps', 'Future Directions']
    },
    {
      type: 'abstract',
      category: 'research',
      title: 'Academic Journal Abstract',
      description: 'High-impact 250-word synthesis of problem, methodology, key quantitative results, and significance.',
      wordCount: '200 – 300 words',
      structure: ['Context', 'Objective', 'Methods', 'Results', 'Significance']
    },

    // Academic
    {
      type: 'essay',
      category: 'academic',
      title: 'Argumentative Academic Essay',
      description: 'Coherent defense of a central thesis backed by peer-reviewed counter-arguments and source synthesis.',
      wordCount: '1,200 – 2,500 words',
      structure: ['Introduction & Thesis', 'Contextual Evidence', 'Counter-Arguments', 'Synthesis', 'Conclusion']
    },
    {
      type: 'assignment',
      category: 'academic',
      title: 'University Term Paper / Assignment',
      description: 'Disciplined modular assignment template conforming to standard departmental rubrics.',
      wordCount: '1,000 – 2,000 words',
      structure: ['Overview', 'Analytical Sections', 'Discussion', 'Applied Conclusions']
    },
    {
      type: 'report',
      category: 'academic',
      title: 'Technical Academic Report',
      description: 'Systematic technical evaluation with numbered subsections, data summaries, and recommendations.',
      wordCount: '1,500 – 3,500 words',
      structure: ['Executive Summary', 'System Architecture', 'Evaluation Metrics', 'Findings', 'Recommendations']
    }
  ];

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      
      {/* Header */}
      <section className="pt-16 pb-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-900 mb-3">
          Academic Writing Templates
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto mb-8">
          Pre-structured academic frameworks designed with university admissions rubrics and peer-reviewed journal standards.
        </p>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto bg-white p-2 rounded-xl border border-neutral-200 shadow-2xs">
          
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'applications', 'research', 'academic'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {cat === 'all' ? 'All Templates' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>

        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    {t.category}
                  </span>
                  {t.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {t.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-serif font-bold text-neutral-900 group-hover:text-amber-900 transition-colors mb-2">
                  {t.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {t.description}
                </p>

                <div className="mb-4 pt-3 border-t border-neutral-100">
                  <div className="text-[11px] font-semibold text-neutral-500 mb-1.5">
                    Structure:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {t.structure.map((item, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-mono-numbers text-neutral-500">
                  {t.wordCount}
                </span>

                <button
                  onClick={() => onUseTemplate(t.type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-2xs group-hover:bg-neutral-800"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
