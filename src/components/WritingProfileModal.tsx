import React, { useState } from 'react';
import { X, Sparkles, Check, Sliders, RefreshCw, BookOpen, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { WritingProfile } from '../types';
import { aiService } from '../services/aiService';

interface WritingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  writingProfile: WritingProfile;
  onUpdateProfile: (profile: WritingProfile) => void;
}

export const WritingProfileModal: React.FC<WritingProfileModalProps> = ({
  isOpen,
  onClose,
  writingProfile,
  onUpdateProfile,
}) => {
  const [samplesText, setSamplesText] = useState(writingProfile.rawSamples || '');
  const [profile, setProfile] = useState<WritingProfile>({ ...writingProfile });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sandboxInput, setSandboxInput] = useState('In this essay I want to talk about how distributed algorithms are really cool and how edge computing can make things run way faster.');
  const [sandboxOutput, setSandboxOutput] = useState('');
  const [isTestingSandbox, setIsTestingSandbox] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'analyze' | 'sandbox'>('profile');

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!samplesText.trim() || samplesText.trim().length < 40) {
      alert('Please paste at least 1-2 paragraphs of your past academic writing to analyze.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeWritingStyle(samplesText);
      const updated: WritingProfile = {
        ...profile,
        ...result.profile,
        rawSamples: samplesText
      };
      setProfile(updated);
      onUpdateProfile(updated);
      setActiveTab('profile');
    } catch (e: any) {
      alert(e.message || 'Analysis failed. Check your network connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTestSandbox = async () => {
    if (!sandboxInput.trim()) return;
    setIsTestingSandbox(true);
    try {
      const res = await aiService.rewriteText({
        selectedText: sandboxInput,
        mode: 'sound-like-me',
        writingProfile: profile
      });
      setSandboxOutput(res.revised);
    } catch (e: any) {
      setSandboxOutput(sandboxInput);
    } finally {
      setIsTestingSandbox(false);
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span>Authentic Voice Engine</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 font-semibold">Active in All AI Drafting</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-neutral-900">
              Personal Writing Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-6 pt-3 flex items-center gap-1 border-b border-neutral-100 pb-2 bg-white">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'profile' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            My Writing Fingerprint
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'analyze' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Analyze Past Writing Samples
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'sandbox' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Voice Calibration Sandbox
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: Profile Tuning */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Summary banner */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Calibrated Authorial Voice</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {profile.summary || 'Your profile preserves sentence cadence, vocabulary register, and personal perspective across all AI drafts and rewrites.'}
                </p>
              </div>

              {/* Sliders and Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tone */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Tone Register
                  </label>
                  <select
                    value={profile.tone}
                    onChange={(e) => setProfile({ ...profile, tone: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-900 focus:outline-none"
                  >
                    <option value="Analytical, reflective, and professional">Analytical & Reflective</option>
                    <option value="Rigorous, formal academic">Rigorous Formal Academic</option>
                    <option value="Direct, concise, pragmatic">Direct & Pragmatic</option>
                    <option value="Engaging, narrative scholarly">Narrative Scholarly</option>
                  </select>
                  <p className="text-[11px] text-neutral-400 mt-1">Shapes mood and descriptive density</p>
                </div>

                {/* Formality */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Formality
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['Low', 'Medium', 'Medium-High', 'High'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setProfile({ ...profile, formality: level })}
                        className={`py-1.5 text-xs font-medium rounded-md border text-center transition-all ${
                          profile.formality === level 
                            ? 'bg-neutral-900 text-white border-neutral-900' 
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {level.replace('Medium-', 'M-')}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Governs contraction usage and diction</p>
                </div>

                {/* Vocabulary Level */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Vocabulary Register
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['Accessible', 'Moderate', 'Sophisticated', 'Specialized'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setProfile({ ...profile, vocabulary: v })}
                        className={`py-1.5 text-[11px] font-medium rounded-md border text-center transition-all truncate ${
                          profile.vocabulary === v 
                            ? 'bg-neutral-900 text-white border-neutral-900' 
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Lexical richness without artificial jargon</p>
                </div>

                {/* Sentence Length */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Sentence Length & Cadence
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Compact', 'Medium', 'Complex'] as const).map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setProfile({ ...profile, sentenceLength: len })}
                        className={`py-1.5 text-xs font-medium rounded-md border text-center transition-all ${
                          profile.sentenceLength === len 
                            ? 'bg-neutral-900 text-white border-neutral-900' 
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">14-18 words vs compound periodic clauses</p>
                </div>

                {/* Personal Voice */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Personal Voice / First-Person
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Subtle', 'Balanced', 'Strong'] as const).map((voice) => (
                      <button
                        key={voice}
                        type="button"
                        onClick={() => setProfile({ ...profile, personalVoice: voice })}
                        className={`py-1.5 text-xs font-medium rounded-md border text-center transition-all ${
                          profile.personalVoice === voice 
                            ? 'bg-neutral-900 text-white border-neutral-900' 
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {voice}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">"I investigated..." vs "This study investigates..."</p>
                </div>

                {/* Academic Complexity */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Target Academic Level
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Undergraduate', "Master's", 'Doctoral'] as const).map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => setProfile({ ...profile, complexity: comp })}
                        className={`py-1.5 text-xs font-medium rounded-md border text-center transition-all ${
                          profile.complexity === comp 
                            ? 'bg-neutral-900 text-white border-neutral-900' 
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Calibrates expected scholarly rigor</p>
                </div>

              </div>

              {/* Recurring stylistic tendencies */}
              {profile.keyPhrases && profile.keyPhrases.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-neutral-700 mb-2">
                    Observed Stylistic Patterns:
                  </div>
                  <div className="space-y-1.5">
                    {profile.keyPhrases.map((phrase, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-150">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{phrase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Upload / Paste Writing Samples */}
          {activeTab === 'analyze' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                  Upload or Paste Writing Samples
                </h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Paste 2–5 paragraphs from your past assignments, papers, or letters. ScholarFlow will extract your structural sentence length, vocabulary tier, and rhetorical habits.
                </p>
                <textarea
                  rows={8}
                  placeholder="Paste your past writing here (e.g. from an undergraduate paper, essay, or research report)..."
                  value={samplesText}
                  onChange={(e) => setSamplesText(e.target.value)}
                  className="w-full text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Stylistic Fingerprint...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze My Writing Style</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: Sandbox */}
          {activeTab === 'sandbox' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                  "Make It Sound Like Me" Live Sandbox
                </h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Test how your current Writing Profile calibrates conversational or draft prose into your natural academic register.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Raw Draft Input</label>
                    <textarea
                      rows={3}
                      value={sandboxInput}
                      onChange={(e) => setSandboxInput(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTestSandbox}
                    disabled={isTestingSandbox}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 shadow-sm disabled:opacity-50"
                  >
                    {isTestingSandbox ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Translate into My Calibrated Voice</span>
                  </button>

                  {sandboxOutput && (
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                      <div className="text-xs font-semibold text-amber-900 mb-1">Calibrated Result:</div>
                      <p className="text-xs text-neutral-800 leading-relaxed font-serif">
                        "{sandboxOutput}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Voice to All Documents</span>
          </button>
        </div>

      </div>
    </div>
  );
};
