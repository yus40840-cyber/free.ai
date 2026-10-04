import React, { useState } from 'react';
import { 
  Plus, Search, FileText, BookOpen, Clock, Trash2, Copy, Download, 
  Sparkles, CheckCircle2, ChevronRight, Sliders, ExternalLink, Filter, 
  Bookmark, Award
} from 'lucide-react';
import { AcademicDocument, DocumentType, UserState } from '../types';

interface DashboardViewProps {
  user: UserState;
  documents: AcademicDocument[];
  onOpenDocument: (id: string) => void;
  onNewDocument: (type?: DocumentType) => void;
  onDuplicateDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onOpenProfile: () => void;
  onOpenPricing: () => void;
  onOpenSynthesizer?: (initialPrompt?: string, words?: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  documents,
  onOpenDocument,
  onNewDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onOpenProfile,
  onOpenPricing,
  onOpenSynthesizer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [dashboardPrompt, setDashboardPrompt] = useState('');
  const [dashboardWords, setDashboardWords] = useState<number>(500);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalWords = documents.reduce((acc, doc) => {
    const words = doc.content.trim().split(/\s+/).filter(Boolean).length;
    return acc + words;
  }, 0);

  const totalSources = documents.reduce((acc, doc) => acc + doc.sources.length, 0);

  const quickTypes: { type: DocumentType; label: string; icon: string; desc: string }[] = [
    { type: 'research-paper', label: 'Research Paper', icon: '🔬', desc: 'Hypothesis, method, literature & empirical citations' },
    { type: 'motivation-letter', label: 'Motivation Letter', icon: '🏛️', desc: 'Graduate programs, scholarships, universities' },
    { type: 'sop', label: 'Statement of Purpose', icon: '📜', desc: 'Academic path, career trajectory & faculty fit' },
    { type: 'essay', label: 'Academic Essay', icon: '✍️', desc: 'Rigorous argumentative prose with source synthesis' },
    { type: 'proposal', label: 'Research Proposal', icon: '📐', desc: 'Methodological framework, gap analysis & timeline' },
    { type: 'literature-review', label: 'Literature Review', icon: '📚', desc: 'Thematic analysis and peer-reviewed synthesis' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium mb-1">
            <span>{user.institution}</span>
            <span aria-hidden="true">·</span>
            <span>{user.fieldOfStudy}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Good morning, {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-neutral-600 mt-0.5">
            Your writing workspace is synchronized. What would you like to advance today?
          </p>
        </div>

        {/* Quick Voice & Unit Indicators */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 transition-colors shadow-2xs text-left"
          >
            <Sliders className="w-3.5 h-3.5 text-neutral-500" />
            <div>
              <div className="text-[11px] text-neutral-400">Writing Voice</div>
              <div className="font-semibold text-neutral-900">{user.writingProfile.complexity} · {user.writingProfile.formality}</div>
            </div>
          </button>

          <button
            onClick={() => onNewDocument()}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Document</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="text-xs text-neutral-500 font-medium">Active Documents</div>
          <div className="text-2xl font-bold font-mono-numbers text-neutral-900 mt-1">{documents.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Stored securely in workspace</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="text-xs text-neutral-500 font-medium">Words Authored</div>
          <div className="text-2xl font-bold font-mono-numbers text-neutral-900 mt-1">{totalWords.toLocaleString()}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Calibrated to student voice</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="text-xs text-neutral-500 font-medium">Grounded Sources</div>
          <div className="text-2xl font-bold font-mono-numbers text-neutral-900 mt-1">{totalSources}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Peer-reviewed & attached</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <div className="text-xs text-neutral-500 font-medium">Available AI Units</div>
          <div className="text-2xl font-bold font-mono-numbers text-neutral-900 mt-1">{user.aiUnits}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Plan: {user.plan}</div>
        </div>
      </div>

      {/* Primary Research & Manuscript Synthesizer Bar */}
      <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-850 text-white shadow-md border border-neutral-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SCHOLARFLOW RESEARCH SYNTHESIZER</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-300">Word-Count Guaranteed</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Transform Research Inquiries into Rigorous Manuscripts
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl">
              Enter any research prompt. Our backend orchestrator decomposes complex topics into structured sections, executes multi-stage evaluation, and validates exact word volume (100w, 500w, 1,000w, 5,000w+).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-neutral-400">Target:</span>
            <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-lg border border-neutral-700">
              {[100, 500, 1000, 2500, 5000].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setDashboardWords(w)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                    dashboardWords === w
                      ? 'bg-amber-400 text-neutral-950 shadow-xs'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  {w >= 1000 ? `${w / 1000}k` : `${w}w`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input & Action */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={2}
              value={dashboardPrompt}
              onChange={(e) => setDashboardPrompt(e.target.value)}
              placeholder="e.g. Synthesize an empirical analysis of algorithmic bias in healthcare diagnostic models, evaluating cross-attention layers, demographic underrepresentation, and proposed audit frameworks..."
              className="w-full text-xs sm:text-sm bg-neutral-800/90 border border-neutral-700 focus:border-amber-400 focus:bg-neutral-800 rounded-xl p-3.5 text-white placeholder:text-neutral-400 leading-relaxed focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-neutral-400">
              <span>Suggestions:</span>
              <button
                type="button"
                onClick={() => {
                  setDashboardPrompt('Investigate ethical implications of algorithmic bias in clinical deep learning, proposing multi-tiered audit protocols.');
                  setDashboardWords(1000);
                }}
                className="hover:text-amber-300 underline decoration-neutral-600 transition-colors"
              >
                Clinical AI Bias (1,000w)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setDashboardPrompt('Motivation letter for Oxford MSc in Advanced Computer Science highlighting distributed systems research.');
                  setDashboardWords(500);
                }}
                className="hover:text-amber-300 underline decoration-neutral-600 transition-colors"
              >
                Oxford MSc Motivation (500w)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setDashboardPrompt('Exhaustive literature review evaluating carbon taxation impacts across emerging market supply chains.');
                  setDashboardWords(5000);
                }}
                className="hover:text-amber-300 underline decoration-neutral-600 transition-colors"
              >
                Carbon Tax Review (5,000w)
              </button>
            </div>

            {/* Launch Button */}
            <button
              onClick={() => {
                if (onOpenSynthesizer) {
                  onOpenSynthesizer(dashboardPrompt, dashboardWords);
                }
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg text-xs transition-colors shadow-sm whitespace-nowrap self-end sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-neutral-900" />
              <span>Launch Synthesizer ({dashboardWords.toLocaleString()} Words)</span>
            </button>
          </div>
        </div>
      </div>

      {/* "What are you writing today?" Quick launcher */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-bold text-neutral-900">
            What are you writing today?
          </h2>
          <span className="text-xs text-neutral-500">Guided outline & structure questionnaire</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => onNewDocument(item.type)}
              className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-xs transition-all text-left group flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-semibold text-sm text-neutral-900 font-serif group-hover:text-amber-900">
                    {item.label}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 leading-snug">
                  {item.desc}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-transform mt-1 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Documents Table & Search */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-neutral-900">
              Recent Documents
            </h2>
            <p className="text-xs text-neutral-500">Click to open directly in the full research workspace</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400 w-48 sm:w-56"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            >
              <option value="all">All Types</option>
              <option value="research-paper">Research Paper</option>
              <option value="motivation-letter">Motivation Letter</option>
              <option value="sop">Statement of Purpose</option>
              <option value="essay">Academic Essay</option>
            </select>
          </div>
        </div>

        {/* Document List */}
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-200 rounded-xl bg-white">
            <BookOpen className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">No documents found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
              {searchQuery ? `No files match "${searchQuery}".` : 'Get started by creating your first research paper or motivation letter.'}
            </p>
            <button
              onClick={() => onNewDocument()}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Create New Document
            </button>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-neutral-100">
            {filteredDocs.map((doc) => {
              const wordCount = doc.content.trim().split(/\s+/).filter(Boolean).length;
              const formattedDate = new Date(doc.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={doc.id}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors group cursor-pointer"
                  onClick={() => onOpenDocument(doc.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 text-xs text-neutral-500">
                      <span className="capitalize font-medium text-neutral-700">
                        {doc.type.replace('-', ' ')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Target: {doc.targetWordLimit} words</span>
                      <span aria-hidden="true">·</span>
                      <span>{doc.citationStyle}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-neutral-900 truncate group-hover:text-amber-900 transition-colors font-serif">
                      {doc.title}
                    </h3>

                    {/* Metadata line without pills */}
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1 font-mono-numbers">
                      <span>{wordCount} words</span>
                      <span aria-hidden="true">·</span>
                      <span>{doc.sources.length} sources</span>
                      <span aria-hidden="true">·</span>
                      <span>{doc.sections.filter(s => s.completed).length}/{doc.sections.length} sections</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-400 font-sans">Edited {formattedDate}</span>
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {doc.auditReport && (
                      <span className={`text-[11px] px-2 py-0.5 rounded text-xs font-medium ${
                        doc.auditReport.overallReadiness.includes('Ready') 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {doc.auditReport.overallReadiness}
                      </span>
                    )}

                    <button
                      onClick={() => onOpenDocument(doc.id)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/70 rounded-lg transition-colors"
                      title="Open in Workspace"
                    >
                      Open
                    </button>

                    <button
                      onClick={() => onDuplicateDocument(doc.id)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-md hover:bg-neutral-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
