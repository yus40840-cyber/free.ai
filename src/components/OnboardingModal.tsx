import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ArrowLeft, BookOpen, ShieldCheck, Loader2 } from 'lucide-react';
import { CitationStyle, UserState, WritingProfile } from '../types';
import { aiService } from '../services/aiService';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserState;
  onComplete: (updatedProfile: WritingProfile, userMeta: Partial<UserState>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  user,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [degree, setDegree] = useState(user.academicLevel || "Master's");
  const [field, setField] = useState(user.fieldOfStudy || 'Computer Science');
  const [primaryWriting, setPrimaryWriting] = useState<'papers' | 'applications' | 'essays'>('applications');
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('APA 7');
  const [samplesText, setSamplesText] = useState(user.writingProfile.rawSamples || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleFinish = async () => {
    setIsAnalyzing(true);
    try {
      let finalProfile = { ...user.writingProfile };
      if (samplesText.trim().length > 50) {
        const res = await aiService.analyzeWritingStyle(samplesText);
        finalProfile = {
          ...finalProfile,
          ...res.profile,
          rawSamples: samplesText
        };
      }

      onComplete(finalProfile, {
        academicLevel: degree,
        fieldOfStudy: field,
      });

      onClose();
    } catch (e) {
      onComplete(user.writingProfile, {
        academicLevel: degree,
        fieldOfStudy: field,
      });
      onClose();
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Personalization Setup (Step {step} of 2)</div>
            <h2 className="text-base font-serif font-bold text-neutral-900">
              Let's Personalize ScholarFlow For You
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Academic Direction */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Current Academic Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Undergraduate', "Master's", 'PhD', 'Faculty / Researcher'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDegree(lvl)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-all ${
                      degree === lvl ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Primary Field of Inquiry
              </label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="e.g. Distributed Computing, Molecular Biology, Economics"
                className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Primary Document Needs
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPrimaryWriting('applications')}
                  className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-all ${
                    primaryWriting === 'applications' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="font-semibold">SOPs & Letters</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Graduate admissions</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPrimaryWriting('papers')}
                  className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-all ${
                    primaryWriting === 'papers' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="font-semibold">Research Papers</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Empirical & journals</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPrimaryWriting('essays')}
                  className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-all ${
                    primaryWriting === 'essays' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="font-semibold">Essays & Theses</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Coursework & caps</div>
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <span>Continue to Voice Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Calibrate Authentic Voice */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div>
              <div className="text-xs font-semibold text-neutral-900 mb-1">
                Upload or Paste 1–3 Past Writing Samples (Optional)
              </div>
              <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
                ScholarFlow analyzes sentence length, vocabulary tier, and cadence so that your writing assistant sounds like yourself—not an arbitrary AI generator.
              </p>

              <textarea
                rows={6}
                value={samplesText}
                onChange={(e) => setSamplesText(e.target.value)}
                placeholder="Paste a paragraph or two from your past academic work or essays..."
                className="w-full text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleFinish}
                disabled={isAnalyzing}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Calibrating Voice Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Launch My Workspace</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
