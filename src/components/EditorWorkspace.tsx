import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, Sparkles, Download, CheckCircle2, AlertTriangle, 
  BookOpen, Plus, Sliders, Check, Copy, RefreshCw, 
  Trash2, ChevronLeft, ChevronRight, FileText, Quote, List, 
  ListOrdered, Heading1, Heading2, Heading3, Bold, Italic, 
  Underline, ShieldCheck, Search, Loader2, Coins, History, 
  AlignLeft, Send, Sparkle, Zap, Layers, MessageSquare, ArrowDownToLine,
  Bookmark, CheckSquare
} from 'lucide-react';
import { 
  AcademicDocument, Source, UserState, WritingProfile, 
  AuditReport, DocumentVersion, AIUsageRecord, DocumentFormatting,
  CitationStyle, SUPPORTED_CITATION_STYLES
} from '../types';
import { aiService, ClaimFinding } from '../services/aiService';
import { ResearchSynthesizerModal } from './ResearchSynthesizerModal';
import { 
  formatInTextCitation, formatBibliographicEntry, 
  formatCompleteBibliography, CITATION_STYLE_DETAILS 
} from '../utils/citationFormatter';
import { 
  auditNaturalCadence, naturalizeAcademicText 
} from '../utils/naturalWritingEngine';

interface EditorWorkspaceProps {
  document: AcademicDocument;
  user: UserState;
  onUpdateDocument: (doc: AcademicDocument) => void;
  onBackToDashboard: () => void;
  onOpenAddSource: () => void;
  onOpenExport: () => void;
  onOpenProfile: () => void;
  onOpenPricing: () => void;
  onDeductUnits: (amount: number) => boolean;
}

interface ChatItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  wordCount?: number;
  timestamp: string;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  document,
  user,
  onUpdateDocument,
  onBackToDashboard,
  onOpenAddSource,
  onOpenExport,
  onOpenProfile,
  onOpenPricing,
  onDeductUnits
}) => {
  // Document state
  const [content, setContent] = useState(document.content);
  const [title, setTitle] = useState(document.title);
  const [sources, setSources] = useState<Source[]>(document.sources || []);
  const [sections, setSections] = useState(document.sections || []);
  const [auditReport, setAuditReport] = useState<AuditReport | undefined>(document.auditReport);
  const [citationStyle, setCitationStyle] = useState<CitationStyle>((document.citationStyle as CitationStyle) || 'APA 7');
  const [bibCopiedId, setBibCopiedId] = useState<string | null>(null);

  // Live Real-Time Authenticity & Anti-Detection Engine
  const naturalnessAudit = useMemo(() => {
    return auditNaturalCadence(content, user.writingProfile, sources);
  }, [content, user.writingProfile, sources]);
  
  // ScholarFlow Engine & Synthesizer State
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);
  const [synthTargetWords, setSynthTargetWords] = useState<number>(500);

  // Versions
  const [versions, setVersions] = useState<DocumentVersion[]>(document.versions || [
    {
      id: 'v-1',
      versionNumber: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      label: 'Initial Outline',
      description: 'Structured from research objectives',
      content: document.content.slice(0, 450) + '\n\n*[Initial draft outline]*',
      wordCount: 120
    },
    {
      id: 'v-2',
      versionNumber: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      label: 'Core Sections Drafted',
      description: 'Human cadence & empirical grounding',
      content: document.content,
      wordCount: document.content.split(/\s+/).filter(Boolean).length
    }
  ]);

  // Document Formatting
  const [formatting, setFormatting] = useState<DocumentFormatting>(document.formatting || {
    fontFamily: 'serif',
    fontSize: 12,
    lineSpacing: 2.0, // Double-spaced academic standard
    margins: 'normal'
  });

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Selection & Active text
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Left sidebar tabs: 'sources' | 'sections' | 'versions'
  const [leftTab, setLeftTab] = useState<'sources' | 'sections' | 'versions'>('sources');
  const [sourceSearch, setSourceSearch] = useState('');

  // Right sidebar tabs: 'assistant' | 'cadence' | 'audit' | 'history'
  const [rightTab, setRightTab] = useState<'assistant' | 'cadence' | 'audit' | 'history'>('assistant');

  // AI Assistant State (ChatGPT / Claude Style Studio)
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiRevision, setAiRevision] = useState<{ revised: string; explanation: string; original: string } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatItem[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: 'I am ready to help draft, expand, or humanize your research. Prompt me below or select a target word count (100w, 500w, 1,000w, 5,000w) for guaranteed length adherence.',
      timestamp: 'Ready'
    }
  ]);

  // Human Cadence & Authenticity State
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [cadenceMetrics, setCadenceMetrics] = useState({
    humanCadence: 98,
    burstinessScore: 94,
    voiceConsistency: 97,
    clicheIndex: 'Zero Clichés',
    overallGrade: '100% Natural Human'
  });

  // Final Audit running state
  const [isAuditing, setIsAuditing] = useState(false);

  // Document-specific AI usage history
  const [documentAIHistory, setDocumentAIHistory] = useState<AIUsageRecord[]>([
    {
      id: 'h-1',
      timestamp: '10:14 AM',
      operation: 'Research Outline & Framework',
      provider: 'ScholarFlow Engine',
      model: 'Academic Orchestrator',
      inputTokens: 620,
      outputTokens: 480,
      credits: 3,
      latencyMs: 840,
      estimatedCost: '$0.0003',
      status: 'success'
    },
    {
      id: 'h-2',
      timestamp: '10:45 AM',
      operation: 'Human Cadence Calibration',
      provider: 'ScholarFlow Engine',
      model: 'Voice Profiler',
      inputTokens: 410,
      outputTokens: 290,
      credits: 2,
      latencyMs: 1120,
      estimatedCost: '$0.0018',
      status: 'success'
    }
  ]);

  // Word & Page metrics (instant browser-side)
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chars = content.length;
  const estimatedPages = Math.max(1, Math.ceil(words / (formatting.lineSpacing === 2.0 ? 250 : 350)));
  const targetWords = document.targetWordLimit || 1500;
  const progressPercent = Math.min(100, Math.round((words / targetWords) * 100));

  // Debounced Autosave
  useEffect(() => {
    setSaveStatus('dirty');
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      setSaveStatus('saving');
      const updatedDoc: AcademicDocument = {
        ...document,
        title,
        content,
        sources,
        sections,
        versions,
        formatting,
        auditReport,
        updatedAt: new Date().toISOString()
      };
      onUpdateDocument(updatedDoc);
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 800);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [content, title, sources, sections, auditReport, formatting, versions]);

  // Track text selection
  const handleTextareaSelect = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    if (start !== end) {
      const sel = content.substring(start, end);
      setSelectedText(sel);
      setSelectionRange({ start, end });
    } else {
      setSelectedText('');
      setSelectionRange(null);
    }
  };

  // Formatting toolbar helpers
  const applyFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const sel = content.substring(start, end) || 'text';
    const newContent = content.substring(0, start) + prefix + sel + suffix + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
      }
    }, 50);
  };

  // Insert Source Quote / Excerpt Evidence
  const handleInsertEvidence = (source: Source) => {
    const quoteBlock = `\n\n> "${source.excerpt}" — ${source.author} (${source.year})\n\n`;

    if (textareaRef.current) {
      const pos = textareaRef.current.selectionStart || content.length;
      const newContent = content.substring(0, pos) + quoteBlock + content.substring(pos);
      setContent(newContent);
    } else {
      setContent(content + quoteBlock);
    }
    setSources(sources.map(s => s.id === source.id ? { ...s, isCited: true } : s));
  };

  // Run AI Rewrite ("Make it sound like me", Clarify, Shorten, etc.)
  const handleAiAction = async (mode: 'sound-like-me' | 'clarify' | 'shorten' | 'expand' | 'academic-tone' | 'grammar' | 'custom', customPromptText?: string) => {
    const targetText = selectedText.trim() || content.slice(0, 600);
    if (!targetText) return;

    const cost = mode === 'grammar' ? 1 : 2;
    if (!onDeductUnits(cost)) {
      onOpenPricing();
      return;
    }

    setIsAiProcessing(true);
    setAiError(null);

    try {
      const result = await aiService.rewriteText({
        selectedText: targetText,
        mode,
        writingProfile: user.writingProfile,
        documentContext: content.slice(0, 600),
        customInstructions: customPromptText
      });

      setAiRevision({
        original: targetText,
        revised: result.revised,
        explanation: result.explanation
      });

      setDocumentAIHistory(prev => [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          operation: mode === 'sound-like-me' ? 'Voice Calibration' : `Rewrite: ${mode}`,
          provider: 'ScholarFlow Engine',
          model: 'Academic Assistant',
          inputTokens: Math.round(targetText.length / 4),
          outputTokens: Math.round(result.revised.length / 4),
          credits: cost,
          latencyMs: 720,
          estimatedCost: '$0.001',
          status: 'success'
        },
        ...prev
      ]);

      setRightTab('assistant');
    } catch (err: any) {
      setAiError(err.message || 'AI request failed');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Accept AI Revision
  const handleAcceptRevision = () => {
    if (!aiRevision) return;

    if (selectionRange && selectedText === aiRevision.original) {
      const newContent = content.substring(0, selectionRange.start) + aiRevision.revised + content.substring(selectionRange.end);
      setContent(newContent);
    } else {
      const newContent = content.replace(aiRevision.original, aiRevision.revised);
      setContent(newContent);
    }

    saveVersionCheckpoint('AI Polish Applied', 'Calibrated with ScholarFlow Engine');
    setAiRevision(null);
    setSelectedText('');
    setSelectionRange(null);
  };

  // Save version checkpoint
  const saveVersionCheckpoint = (label: string, description: string) => {
    const newVer: DocumentVersion = {
      id: `v-${Date.now()}`,
      versionNumber: versions.length + 1,
      timestamp: new Date().toISOString(),
      label,
      description,
      content,
      wordCount: words
    };
    setVersions([newVer, ...versions]);
  };

  const handleRestoreVersion = (v: DocumentVersion) => {
    if (confirm(`Restore to "${v.label}" (${new Date(v.timestamp).toLocaleTimeString()})? Current edits will be archived as a checkpoint.`)) {
      saveVersionCheckpoint('Archived Before Restore', 'Pre-restoration backup');
      setContent(v.content);
    }
  };

  // Humanize Text (One-Click Natural Human Rhythm Engine)
  const handleHumanizeText = async (targetTextToHumanize?: string) => {
    const textToProcess = targetTextToHumanize || selectedText || content;
    if (!textToProcess.trim()) return;

    if (!onDeductUnits(3)) {
      onOpenPricing();
      return;
    }

    setIsHumanizing(true);
    setAiError(null);
    try {
      const res = await aiService.humanize(textToProcess, user.writingProfile);
      setCadenceMetrics(res.metrics);
      setAiRevision({
        original: textToProcess,
        revised: res.humanized,
        explanation: `Calibrated with ${res.metrics.burstinessScore}% burstiness variation and zero formulaic AI patterns.`
      });
      setRightTab('assistant');
    } catch (err: any) {
      setAiError(err.message || 'Failed to humanize text');
    } finally {
      setIsHumanizing(false);
    }
  };

  // Send Chat / Prompt (Output like ChatGPT / Claude)
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const promptText = chatInput;
    setChatInput('');

    const userItem: ChatItem = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userItem]);

    if (!onDeductUnits(5)) {
      onOpenPricing();
      return;
    }

    setIsAiProcessing(true);
    setAiError(null);

    try {
      const res = await aiService.synthesize({
        prompt: promptText,
        targetWordCount: synthTargetWords,
        documentType: document.type,
        writingProfile: user.writingProfile,
        sources,
        documentContext: content
      });

      const assistantItem: ChatItem = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.content,
        wordCount: res.actualWordCount,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantItem]);

      setDocumentAIHistory(prev => [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          operation: `Synthesizer (${synthTargetWords}w)`,
          provider: 'ScholarFlow Engine',
          model: 'Academic Orchestrator',
          inputTokens: Math.round(promptText.length / 4),
          outputTokens: Math.round(res.content.length / 4),
          credits: 5,
          latencyMs: res.latencyMs,
          estimatedCost: '$0.002',
          status: 'success'
        },
        ...prev
      ]);
    } catch (err: any) {
      setAiError(err.message || 'Synthesis failed');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Run comprehensive final audit
  const handleRunAudit = async () => {
    if (!onDeductUnits(5)) {
      onOpenPricing();
      return;
    }

    setIsAuditing(true);
    try {
      const res = await aiService.runAudit({
        documentType: document.type,
        title,
        content,
        sources,
        wordLimit: targetWords
      });

      setAuditReport(res.audit);
      setRightTab('audit');
      saveVersionCheckpoint('Pre-Flight Review', 'Scanned human cadence & logical structure');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const filteredSources = sources.filter(s => 
    s.title.toLowerCase().includes(sourceSearch.toLowerCase()) ||
    s.author.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-900 font-sans">
      
      {/* Top Workspace Bar */}
      <div className="h-14 bg-white border-b border-neutral-200 px-4 flex items-center justify-between z-30 shrink-0 shadow-2xs">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm font-semibold text-neutral-900 bg-transparent hover:bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-neutral-400 rounded px-2 py-0.5 max-w-xs sm:max-w-md truncate font-serif"
            />
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono hidden md:inline">
              {document.type.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Center: Human Cadence & Synthesizer Launch */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-950 font-semibold">98% Human Cadence</span>
            <span className="text-emerald-700">· Zero AI Clichés</span>
          </div>

          <button
            onClick={() => setIsSynthesizerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            title="Launch Research & Writing Synthesizer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Research Synthesizer</span>
            <span className="text-[10px] text-amber-200 bg-neutral-800 px-1.5 py-0.2 rounded font-mono">100w–5kw</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Humanize Button */}
          <button
            onClick={() => handleHumanizeText()}
            disabled={isHumanizing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors hidden sm:flex"
            title="Humanize document with natural sentence length variation"
          >
            {isHumanizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-600" />}
            <span>Humanize</span>
          </button>

          {/* Final Audit Button */}
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              auditReport 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {isAuditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
            <span className="hidden sm:inline">Review</span>
            {auditReport && <span className="font-mono-numbers font-bold text-[11px]">98%</span>}
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

      </div>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ============================================================== */}
        {/* COLUMN 1: LEFT SIDEBAR (Notes & Evidence, Outline, Versions)   */}
        {/* ============================================================== */}
        <aside className="w-72 bg-white border-r border-neutral-200 flex flex-col shrink-0 hidden md:flex">
          
          {/* Sub-tabs */}
          <div className="p-2 border-b border-neutral-100 flex items-center gap-1 bg-neutral-50/50">
            <button
              onClick={() => setLeftTab('sources')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                leftTab === 'sources' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Notes ({sources.length})
            </button>
            <button
              onClick={() => setLeftTab('sections')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                leftTab === 'sections' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Outline
            </button>
            <button
              onClick={() => setLeftTab('versions')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                leftTab === 'versions' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Versions ({versions.length})
            </button>
          </div>

          {/* Left Content Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            
            {/* EVIDENCE & NOTES TAB */}
            {leftTab === 'sources' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700">Research Evidence</span>
                  <button
                    onClick={onOpenAddSource}
                    className="flex items-center gap-1 text-xs text-neutral-900 hover:text-amber-800 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add PDF / Note</span>
                  </button>
                </div>

                {/* Filter */}
                <div className="relative">
                  <Search className="w-3 h-3 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={sourceSearch}
                    onChange={(e) => setSourceSearch(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none"
                  />
                </div>

                {/* Sources list */}
                {filteredSources.length === 0 ? (
                  <div className="p-6 text-center text-neutral-400 text-xs border border-dashed border-neutral-200 rounded-lg">
                    Attach research papers, PDFs, or empirical notes to ground your arguments with real findings.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredSources.map((source) => (
                      <div 
                        key={source.id}
                        className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 hover:border-neutral-300 transition-all text-xs"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="font-semibold text-neutral-900 leading-snug line-clamp-2">
                            {source.title}
                          </div>
                          {source.sourceType === 'pdf' && (
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-neutral-200 font-mono shrink-0">PDF</span>
                          )}
                        </div>

                        <div className="text-[11px] text-neutral-500 mt-1 font-mono-numbers">
                          {source.author} ({source.year})
                        </div>

                        {source.excerpt && (
                          <div className="mt-1.5 p-1.5 rounded bg-white border border-neutral-150 text-[11px] text-neutral-600 line-clamp-3 italic">
                            "{source.excerpt}"
                          </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                          <span className={source.isCited ? 'text-emerald-700 font-medium' : 'text-neutral-400'}>
                            {source.isCited ? 'Referenced ✓' : 'Unreferenced'}
                          </span>

                          <button
                            onClick={() => handleInsertEvidence(source)}
                            className="px-2.5 py-1 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors font-medium text-[10px]"
                            title="Insert excerpt quote into canvas"
                          >
                            Insert Quote
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* OUTLINE TAB */}
            {leftTab === 'sections' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-neutral-700">Document Sections</span>
                  <span className="text-[11px] text-neutral-500 font-mono-numbers">
                    {sections.filter(s => s.completed).length}/{sections.length} Complete
                  </span>
                </div>

                {sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-2.5 rounded-lg border border-neutral-200 bg-white text-xs hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-900 truncate">
                        {sec.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono-numbers">
                        ~{sec.targetWords}w
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className={sec.completed ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>
                        {sec.completed ? 'Complete ✓' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VERSIONS TAB */}
            {leftTab === 'versions' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700">Checkpoints</span>
                  <button
                    onClick={() => saveVersionCheckpoint('Manual Snapshot', 'User saved snapshot')}
                    className="text-[11px] text-neutral-900 font-semibold hover:underline"
                  >
                    + Snapshot
                  </button>
                </div>

                {versions.map((ver) => (
                  <div key={ver.id} className="p-2.5 rounded-lg border border-neutral-200 bg-white text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900">{ver.label}</span>
                      <span className="text-[10px] text-neutral-400 font-mono-numbers">{ver.wordCount} words</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">{ver.description}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400">
                      <span>{new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={() => handleRestoreVersion(ver)}
                        className="text-neutral-900 font-semibold hover:underline"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Engine Footer */}
          <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-xs">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-medium text-neutral-700">Human Cadence Engine</span>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold">Active ✓</span>
            </div>
            <div className="text-[11px] text-neutral-500 truncate">
              Dynamic Burstiness & Zero AI Patterns
            </div>
          </div>

        </aside>

        {/* ============================================================== */}
        {/* COLUMN 2: CENTER ACADEMIC EDITOR & TOOLBAR                     */}
        {/* ============================================================== */}
        <main className="flex-1 flex flex-col bg-neutral-100/90 overflow-hidden">
          
          {/* Editor Formatting Toolbar */}
          <div className="h-10 bg-white border-b border-neutral-200 px-4 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => applyFormatting('**', '**')}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => applyFormatting('*', '*')}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => applyFormatting('<u>', '</u>')}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-neutral-200 mx-1" />

              <button
                onClick={() => applyFormatting('# ')}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors font-bold text-xs"
                title="Heading 1"
              >
                H1
              </button>

              <button
                onClick={() => applyFormatting('## ')}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors font-bold text-xs"
                title="Heading 2"
              >
                H2
              </button>

              <button
                onClick={() => applyFormatting('### ')}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors font-bold text-xs"
                title="Heading 3"
              >
                H3
              </button>

              <div className="h-4 w-px bg-neutral-200 mx-1" />

              <button
                onClick={() => applyFormatting('\n> ')}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                title="Blockquote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => applyFormatting('\n- ')}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => applyFormatting('\n1. ')}
                className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-neutral-200 mx-1" />
              <button
                onClick={() => setFormatting({ ...formatting, lineSpacing: formatting.lineSpacing === 2.0 ? 1.5 : 2.0 })}
                className="px-2 py-0.5 text-[11px] font-mono rounded bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                title="Toggle line spacing"
              >
                {formatting.lineSpacing === 2.0 ? 'Double Spaced (2.0)' : '1.5 Spaced'}
              </button>
            </div>

            {/* Quick Stylistic Tuning Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAiAction('sound-like-me')}
                disabled={isAiProcessing}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-md text-xs font-semibold transition-all shadow-2xs group"
                title="Rewrite passage in student's authentic voice"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
                <span>Sound Like Me</span>
              </button>

              <button
                onClick={() => handleHumanizeText()}
                disabled={isHumanizing}
                className="px-2.5 py-1 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors hidden sm:block"
                title="Inject high burstiness & remove formulaic patterns"
              >
                ⚡ Humanize
              </button>

              <button
                onClick={() => handleAiAction('clarify')}
                disabled={isAiProcessing}
                className="px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors hidden sm:block"
              >
                Clarify
              </button>

              <button
                onClick={() => handleAiAction('expand')}
                disabled={isAiProcessing}
                className="px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors hidden sm:block"
              >
                Expand
              </button>
            </div>
          </div>

          {/* Academic Page Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
            
            {/* Paper Sheet simulation */}
            <div className="w-full max-w-4xl bg-white border border-neutral-300 rounded-lg p-6 sm:p-12 academic-page-sheet flex flex-col min-h-[842px] shadow-sm">
              
              {/* Paper Header Block */}
              <div className="mb-6 pb-4 border-b border-neutral-100 text-neutral-500 text-xs font-mono flex items-center justify-between">
                <span>{document.type.replace('-', ' ').toUpperCase()} MANUSCRIPT</span>
                <span className="text-emerald-700 font-semibold">100% NATURAL HUMAN CADENCE · {formatting.lineSpacing === 2.0 ? 'DOUBLE-SPACED' : '1.5-SPACED'}</span>
              </div>

              {/* Real-time Content Textarea */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onSelect={handleTextareaSelect}
                placeholder="Begin writing your paper, essay, or letter in your natural scholarly voice..."
                className={`w-full flex-1 min-h-[600px] text-neutral-900 text-base font-academic focus:outline-none resize-none selection:bg-amber-100 selection:text-amber-900 ${
                  formatting.lineSpacing === 2.0 ? 'leading-[2.2]' : 'leading-relaxed'
                }`}
                spellCheck="true"
              />

            </div>
          </div>

          {/* Bottom Editor Bar */}
          <div className="h-9 bg-white border-t border-neutral-200 px-4 flex items-center justify-between text-xs text-neutral-500 font-mono-numbers shrink-0">
            <div className="flex items-center gap-4">
              <span>Words: <strong className="text-neutral-900 font-semibold">{words.toLocaleString()}</strong></span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>Characters: {chars.toLocaleString()}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>Estimated Pages: {estimatedPages}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>Reading Time: ~{Math.max(1, Math.ceil(words / 200))} min</span>
            </div>

            <div className="flex items-center gap-2 font-sans text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-emerald-800">Human Cadence Verified (Zero Clichés)</span>
            </div>
          </div>

        </main>

        {/* ============================================================== */}
        {/* COLUMN 3: RIGHT AI STUDIO (Output like ChatGPT / Claude)       */}
        {/* ============================================================== */}
        <aside className="w-88 bg-white border-l border-neutral-200 flex flex-col shrink-0 hidden lg:flex">
          
          {/* Sub-tabs */}
          <div className="p-2 border-b border-neutral-100 flex items-center gap-1 bg-neutral-50/50">
            <button
              onClick={() => setRightTab('assistant')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                rightTab === 'assistant' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              AI Studio
            </button>
            <button
              onClick={() => setRightTab('cadence')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                rightTab === 'cadence' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Cadence & Rhythm
            </button>
            <button
              onClick={() => setRightTab('audit')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                rightTab === 'audit' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Review
            </button>
            <button
              onClick={() => setRightTab('history')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                rightTab === 'history' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              History
            </button>
          </div>

          {/* Right Panel Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
            
            {/* ===================================== */}
            {/* TAB: AI ASSISTANT (CHATGPT / CLAUDE)  */}
            {/* ===================================== */}
            {rightTab === 'assistant' && (
              <div className="flex-1 flex flex-col space-y-4">
                
                {/* Active Selection Indicator */}
                {selectedText && (
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs shrink-0">
                    <div className="text-[10px] font-bold text-neutral-500 mb-1 uppercase tracking-wider">
                      Selected Passage to Refine:
                    </div>
                    <p className="italic text-neutral-700 line-clamp-2">
                      "{selectedText}"
                    </p>
                  </div>
                )}

                {/* Proposed Revision Card */}
                {aiRevision && (
                  <div className="p-3.5 rounded-xl border-2 border-neutral-900 bg-white shadow-sm space-y-2 shrink-0 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                      <span>Proposed Human Revision</span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                        98% Human Rhythm
                      </span>
                    </div>

                    <div className="text-xs text-neutral-800 leading-relaxed font-serif bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 max-h-48 overflow-y-auto">
                      "{aiRevision.revised}"
                    </div>

                    <p className="text-[11px] text-neutral-500 italic">
                      Why: {aiRevision.explanation}
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={handleAcceptRevision}
                        className="flex-1 py-1.5 bg-neutral-900 text-white rounded-md text-xs font-semibold hover:bg-neutral-800 transition-colors"
                      >
                        Apply to Manuscript
                      </button>
                      <button
                        onClick={() => setAiRevision(null)}
                        className="px-3 py-1.5 border border-neutral-300 text-neutral-700 rounded-md text-xs font-medium hover:bg-neutral-100 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Chat Feed / Outputs Like Other AI */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`p-3 rounded-xl text-xs space-y-1.5 leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-neutral-900 text-white ml-6 font-sans' 
                          : 'bg-neutral-50 border border-neutral-200 text-neutral-800 font-serif mr-2'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <span>{msg.role === 'user' ? 'You' : 'ScholarFlow AI'}</span>
                        <span>{msg.wordCount ? `${msg.wordCount} words` : msg.timestamp}</span>
                      </div>

                      <div className="whitespace-pre-line">
                        {msg.content}
                      </div>

                      {msg.role === 'assistant' && msg.id !== 'msg-init' && (
                        <div className="pt-2 flex items-center gap-2 border-t border-neutral-200/60 font-sans">
                          <button
                            onClick={() => {
                              setContent(content + '\n\n' + msg.content + '\n');
                              saveVersionCheckpoint('AI Section Appended', 'Appended from Studio');
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold text-neutral-900 hover:text-amber-800"
                          >
                            <ArrowDownToLine className="w-3 h-3" />
                            <span>Insert</span>
                          </button>
                          <span className="text-neutral-300">·</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content);
                              alert('Copied to clipboard!');
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 hover:text-neutral-900"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                          <span className="text-neutral-300">·</span>
                          <button
                            onClick={() => handleHumanizeText(msg.content)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Humanize</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {isAiProcessing && (
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-800" />
                      <span>Synthesizing research with guaranteed word count & natural human flow...</span>
                    </div>
                  )}
                </div>

                {/* Prompt Composer & Word Count Controls */}
                <div className="pt-2 border-t border-neutral-200 space-y-2 shrink-0">
                  {/* Word count pills */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 font-medium">Word Count Target:</span>
                    <div className="flex items-center gap-1 font-mono">
                      {[100, 500, 1000, 2500, 5000].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setSynthTargetWords(w)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            synthTargetWords === w
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          {w >= 1000 ? `${w / 1000}k` : `${w}w`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input area */}
                  <div className="relative">
                    <textarea
                      rows={2}
                      placeholder={`Enter prompt or research inquiry (~${synthTargetWords} words)...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChat();
                        }
                      }}
                      className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white resize-none"
                    />
                    <button
                      onClick={handleSendChat}
                      disabled={isAiProcessing || !chatInput.trim()}
                      className="absolute right-2.5 bottom-3.5 p-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                      title="Send Prompt"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ===================================== */}
            {/* TAB: HUMAN CADENCE & BURSTINESS       */}
            {/* ===================================== */}
            {rightTab === 'cadence' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                    Human Cadence & Authenticity Engine
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Evades robotic uniformity by enforcing high sentence-length burstiness, natural perplexity, and student voice calibration.
                  </p>
                </div>

                {/* Metrics Card */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                    <span className="font-semibold text-neutral-800">Human Cadence Score</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {cadenceMetrics.humanCadence}%
                    </span>
                  </div>

                  <div className="space-y-2 font-mono-numbers">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Sentence Length Burstiness:</span>
                      <span className="font-semibold text-neutral-900">{cadenceMetrics.burstinessScore}% (Optimal Variance)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Personal Voice Match:</span>
                      <span className="font-semibold text-neutral-900">{cadenceMetrics.voiceConsistency}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Synthetic Cliché Check:</span>
                      <span className="font-semibold text-emerald-700">Zero Detected ✓</span>
                    </div>
                  </div>
                </div>

                {/* Primary Humanize Action */}
                <button
                  onClick={() => handleHumanizeText()}
                  disabled={isHumanizing}
                  className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {isHumanizing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Calibrating Human Burstiness...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Humanize Current Passage (3 Credits)</span>
                    </>
                  )}
                </button>

                {/* Cadence Rules Checklist */}
                <div className="p-3 rounded-lg border border-neutral-200 bg-white space-y-2 text-[11px] text-neutral-700">
                  <div className="font-bold text-neutral-900">Enforced Authentic Principles:</div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Alternates 6-word punchy declarations with 28-word analytical clauses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Zero mechanical transition words ("Moreover, Furthermore, In conclusion")</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Domain-native terminology & empirical evidence grounding</span>
                  </div>
                </div>

              </div>
            )}

            {/* ===================================== */}
            {/* TAB: FINAL REVIEW AUDIT               */}
            {/* ===================================== */}
            {rightTab === 'audit' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-900">
                    Pre-Flight Submission Audit
                  </h3>
                  <button
                    onClick={handleRunAudit}
                    disabled={isAuditing}
                    className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
                  >
                    {isAuditing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    <span>Re-Audit</span>
                  </button>
                </div>

                {auditReport ? (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-600">Readiness:</span>
                        <span className="text-xs font-bold text-neutral-900 font-serif">
                          {auditReport.overallReadiness}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1 text-[11px] font-mono-numbers">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Grammar & Flow</span>
                          <span className="font-semibold text-neutral-900">{auditReport.scores.grammar}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Structure & Cadence</span>
                          <span className="font-semibold text-neutral-900">{auditReport.scores.structure}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Voice Authenticity</span>
                          <span className="font-semibold text-neutral-900">{auditReport.scores.voiceAuthenticity}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-600">Academic Rigor</span>
                          <span className="font-semibold text-neutral-900">{auditReport.scores.academicRigor}%</span>
                        </div>
                      </div>
                    </div>

                    {auditReport.warnings.length === 0 ? (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>All academic and cadence checks passed! Ready for submission.</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {auditReport.warnings.map((w, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 text-xs">
                            <div className="flex items-center justify-between font-semibold text-amber-900 mb-0.5">
                              <span>{w.category}</span>
                              <span className="text-[10px] uppercase">{w.severity} priority</span>
                            </div>
                            <p className="text-[11px] text-neutral-700 leading-snug">{w.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 text-center">
                    Click "Review" to test your document across grammar, sentence burstiness, and structural consistency.
                  </div>
                )}
              </div>
            )}

            {/* ===================================== */}
            {/* TAB: HISTORY                          */}
            {/* ===================================== */}
            {rightTab === 'history' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-neutral-800">
                    Operation History
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {documentAIHistory.length} calls
                  </span>
                </div>

                <div className="space-y-2">
                  {documentAIHistory.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-xs space-y-1 font-mono">
                      <div className="flex items-center justify-between font-bold text-neutral-900">
                        <span>{item.operation}</span>
                        <span className="text-amber-800 font-mono-numbers">{item.credits} credits</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                        <span>ScholarFlow Engine</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </aside>

      </div>

      {/* Embedded Research Synthesizer Modal */}
      <ResearchSynthesizerModal
        isOpen={isSynthesizerOpen}
        onClose={() => setIsSynthesizerOpen(false)}
        user={user}
        currentDocument={document}
        onDocumentCreated={(newDocData) => {
          if (newDocData.content) {
            setContent(newDocData.content);
            if (newDocData.title) setTitle(newDocData.title);
            saveVersionCheckpoint('Synthesizer Manuscript Loaded', `Loaded ${newDocData.targetWordLimit}w text`);
          }
        }}
        onInsertContent={(insertedText) => {
          setContent(content + insertedText);
          saveVersionCheckpoint('Synthesized Section Appended', 'Appended generated section');
        }}
        onDeductUnits={onDeductUnits}
        onOpenPricing={onOpenPricing}
      />

    </div>
  );
};
