import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Check, BookOpen, FileText, Loader2, Layers } from 'lucide-react';
import { AcademicDocument, CitationStyle, DocumentType, UserState } from '../types';
import { aiService } from '../services/aiService';

interface CreateDocumentModalProps {
  isOpen: boolean;
  initialType?: DocumentType;
  onClose: () => void;
  onCreate: (doc: Partial<AcademicDocument>) => void;
  user: UserState;
}

export const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({
  isOpen,
  initialType = 'motivation-letter',
  onClose,
  onCreate,
  user
}) => {
  const [docType, setDocType] = useState<DocumentType>(initialType);
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [wordLimit, setWordLimit] = useState<number>(850);

  // Motivation Letter / SOP Fields
  const [university, setUniversity] = useState('');
  const [program, setProgram] = useState('');
  const [degree, setDegree] = useState("Master's");
  const [country, setCountry] = useState('');
  const [previousEducation, setPreviousEducation] = useState('');
  const [academicProjects, setAcademicProjects] = useState('');
  const [whyThisField, setWhyThisField] = useState('');
  const [whyThisUniversity, setWhyThisUniversity] = useState('');
  const [careerGoals, setCareerGoals] = useState('');

  // Research Paper Fields
  const [researchTopic, setResearchTopic] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [methodology, setMethodology] = useState('');
  const [keyObjectives, setKeyObjectives] = useState('');

  if (!isOpen) return null;

  const totalSteps = docType === 'motivation-letter' || docType === 'sop' ? 5 : 4;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Step reached final: Generate outline
      await handleGenerateOutline();
    }
  };

  const handleGenerateOutline = async () => {
    setIsGenerating(true);
    try {
      const docTitle = title || (
        docType === 'motivation-letter' 
          ? `Motivation Letter: ${program || 'Graduate Study'} (${university || 'University'})`
          : docType === 'research-paper'
            ? researchTopic || 'Empirical Investigation'
            : `${docType.replace('-', ' ')} Project`
      );

      const details = {
        university,
        program,
        degree,
        country,
        previousEducation,
        academicProjects,
        whyThisField,
        whyThisUniversity,
        careerGoals,
        researchTopic,
        researchQuestion,
        methodology,
        keyObjectives
      };

      const result = await aiService.generateOutline({
        documentType: docType,
        title: docTitle,
        topic: researchTopic || program,
        targetAudience: university || 'Academic Committee',
        wordLimit,
        details
      });

      setGeneratedOutline(result.outline);
      setStep(totalSteps + 1); // Outline review step
    } catch (err: any) {
      console.error(err);
      // Fallback outline if error
      setGeneratedOutline(`# ${title || 'Project Outline'}\n\n### 1. Introduction\n- Background & scope\n\n### 2. Core Body\n- Evidence & methodology\n\n### 3. Conclusion\n- Summary & trajectory`);
      setStep(totalSteps + 1);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalCreate = () => {
    const finalTitle = title || (
      docType === 'motivation-letter' 
        ? `Motivation Letter: ${program || 'Graduate Studies'} (${university || 'University'})`
        : docType === 'research-paper'
          ? researchTopic || 'New Research Paper'
          : `New ${docType.replace('-', ' ')}`
    );

    // Parse sections from outline if possible
    const lines = generatedOutline.split('\n');
    const sections: any[] = [];
    let currentSecTitle = '';

    for (const line of lines) {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        currentSecTitle = line.replace(/^#+\s*/, '').trim();
        sections.push({
          id: `sec-${Date.now()}-${sections.length + 1}`,
          title: currentSecTitle,
          targetWords: Math.round(wordLimit / 4),
          currentWords: 0,
          completed: false
        });
      }
    }

    if (sections.length === 0) {
      sections.push(
        { id: `sec-1`, title: '1. Introduction & Context', targetWords: Math.round(wordLimit * 0.2), currentWords: 0, completed: false },
        { id: `sec-2`, title: '2. Core Background & Literature', targetWords: Math.round(wordLimit * 0.3), currentWords: 0, completed: false },
        { id: `sec-3`, title: '3. Analysis & Discussion', targetWords: Math.round(wordLimit * 0.35), currentWords: 0, completed: false },
        { id: `sec-4`, title: '4. Conclusion & Trajectory', targetWords: Math.round(wordLimit * 0.15), currentWords: 0, completed: false }
      );
    }

    const initialContent = generatedOutline 
      ? `# ${finalTitle}\n\n${generatedOutline}\n\n---\n*[Drafting will replace outline notes]*`
      : `# ${finalTitle}\n\nStart typing your document...`;

    onCreate({
      title: finalTitle,
      type: docType,
      targetWordLimit: wordLimit,
      content: initialContent,
      sections,
      sources: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Guided Document Wizard</div>
            <h2 className="text-lg font-serif font-bold text-neutral-900">
              Create {docType.replace('-', ' ').toUpperCase()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 h-1">
          <div 
            className="bg-neutral-900 h-1 transition-all duration-300"
            style={{ width: `${(step / (totalSteps + 1)) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Step 1: Document Basics & Scope */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => {
                    setDocType(e.target.value as DocumentType);
                    if (e.target.value === 'research-paper') setWordLimit(3000);
                    else if (e.target.value === 'motivation-letter') setWordLimit(850);
                    else if (e.target.value === 'sop') setWordLimit(1000);
                  }}
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                >
                  <option value="motivation-letter">Motivation Letter</option>
                  <option value="research-paper">Research Paper</option>
                  <option value="sop">Statement of Purpose (SOP)</option>
                  <option value="essay">Academic Essay</option>
                  <option value="proposal">Research Proposal</option>
                  <option value="literature-review">Literature Review</option>
                  <option value="personal-statement">Personal Statement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Document Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MSc Advanced Computing Application"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Target Word Limit
                  </label>
                  <input
                    type="number"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(parseInt(e.target.value, 10) || 500)}
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Writing Cadence
                  </label>
                  <select
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                  >
                    <option value="natural">Natural Human Cadence (Varied Burstiness)</option>
                    <option value="analytical">Analytical & Measured</option>
                    <option value="reflective">Personal & Reflective</option>
                    <option value="rigorous">Doctoral Rigor</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Motivation Letter / SOP Specific Steps */}
          {(docType === 'motivation-letter' || docType === 'sop') && (
            <>
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 2: Program & Institution</h3>
                  
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">University / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Oxford, Stanford, TU Munich"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Target Program / Degree</label>
                      <input
                        type="text"
                        placeholder="e.g. MSc in Data Science"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">Country</label>
                      <input
                        type="text"
                        placeholder="e.g. United Kingdom, Germany"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 3: Education & Achievements</h3>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Previous Qualifications & Major</label>
                    <input
                      type="text"
                      placeholder="e.g. BSc in Computer Engineering, GPA 3.85 / 4.0"
                      value={previousEducation}
                      onChange={(e) => setPreviousEducation(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Key Projects / Honors / Thesis</label>
                    <textarea
                      rows={3}
                      placeholder="Summarize 1-2 major technical or research achievements (e.g. undergraduate capstone on distributed consensus)."
                      value={academicProjects}
                      onChange={(e) => setAcademicProjects(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 4: Personal Motivation & Faculty Synergies</h3>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Why did you choose this field?</label>
                    <textarea
                      rows={2}
                      placeholder="What problem or experience first ignited your intellectual dedication?"
                      value={whyThisField}
                      onChange={(e) => setWhyThisField(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Why this university and program specifically?</label>
                    <textarea
                      rows={2}
                      placeholder="Mention specific labs, professors, curriculum modules, or research facilities."
                      value={whyThisUniversity}
                      onChange={(e) => setWhyThisUniversity(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 5: Career Trajectory & Long-Term Vision</h3>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Short-term & Long-term Goals</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. In the short term, work on large-scale distributed systems research. Long-term, direct engineering initiatives in open infrastructure."
                      value={careerGoals}
                      onChange={(e) => setCareerGoals(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Research Paper Specific Steps */}
          {docType === 'research-paper' && (
            <>
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 2: Topic & Research Question</h3>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Core Topic / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Bias Propagation in Multimodal Medical Embeddings"
                      value={researchTopic}
                      onChange={(e) => setResearchTopic(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Primary Research Question (RQ)</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. How does cross-attention between clinical text and imaging exacerbate latent demographic bias in triage classification?"
                      value={researchQuestion}
                      onChange={(e) => setResearchQuestion(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 3: Methodology & Empirical Framework</h3>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Methodology / Dataset / Experimental Setup</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Retrospective cohort analysis across MIMIC-IV triage logs; transformer embedding evaluations."
                      value={methodology}
                      onChange={(e) => setMethodology(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 4: Objectives & Literature Gap</h3>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Key Objectives & Hypothesized Contributions</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. 1. Isolate demographic drift across attention layers. 2. Propose counterfactual perturbation framework."
                      value={keyObjectives}
                      onChange={(e) => setKeyObjectives(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Essay / Proposal / Other Steps */}
          {docType !== 'motivation-letter' && docType !== 'sop' && docType !== 'research-paper' && (
            <>
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 2: Core Topic & Central Thesis</h3>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Topic</label>
                    <input
                      type="text"
                      placeholder="Subject or essay prompt"
                      value={researchTopic}
                      onChange={(e) => setResearchTopic(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Working Thesis / Main Claim</label>
                    <textarea
                      rows={3}
                      placeholder="What is the central argument or proposition you intend to defend?"
                      value={researchQuestion}
                      onChange={(e) => setResearchQuestion(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 3: Supporting Arguments & Evidence</h3>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Key Evidence or Examples</label>
                    <textarea
                      rows={4}
                      placeholder="List primary texts, empirical studies, or historical case studies to ground your analysis."
                      value={academicProjects}
                      onChange={(e) => setAcademicProjects(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Step 4: Scope & Audience</h3>
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Target Audience / Evaluation Criteria</label>
                    <input
                      type="text"
                      placeholder="e.g. Graduate Seminar Faculty, Peer Reviewers"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Outline Review Step (Step > totalSteps) */}
          {step > totalSteps && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Review Generated Outline
                  </h3>
                  <p className="text-xs text-neutral-500">
                    You can edit or refine section titles before entering the writing workspace.
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">
                  Voice Calibrated
                </span>
              </div>

              <textarea
                rows={12}
                value={generatedOutline}
                onChange={(e) => setGeneratedOutline(e.target.value)}
                className="w-full text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-lg p-3 text-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none leading-relaxed"
              />
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 bg-white border border-neutral-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step <= totalSteps ? (
            <button
              onClick={handleNext}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Outline...</span>
                </>
              ) : step === totalSteps ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Outline</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleFinalCreate}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Launch Workspace & Start Writing</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
