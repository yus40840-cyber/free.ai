import { WritingProfile, Source, AuditReport, CitationStyle } from '../types';

export interface OutlineResponse {
  outline: string;
  targetWords?: number;
}

export interface DraftResponse {
  draft: string;
  actualWordCount: number;
  targetWords: number;
}

export interface RewriteResponse {
  revised: string;
  explanation: string;
  actualWordCount?: number;
  targetWordCount?: number;
}

export interface ClaimFinding {
  claim: string;
  status: 'supported' | 'needs-citation' | 'overbroad';
  recommendation: string;
  suggestedSource?: string;
}

export interface SynthesizeResponse {
  content: string;
  actualWordCount: number;
  targetWordCount: number;
  sectionsCount: number;
  accuracy: string;
  latencyMs: number;
  validation: {
    wordCountVerified: boolean;
    naturalToneVerified: boolean;
    claimsChecked: boolean;
  };
}

export const aiService = {
  // Master Synthesizer with strict word count orchestration and background multi-model execution
  async synthesize(params: {
    prompt: string;
    targetWordCount: number;
    documentType?: string;
    citationStyle?: CitationStyle;
    writingProfile?: WritingProfile;
    sources?: Source[];
    documentContext?: string;
  }): Promise<SynthesizeResponse> {
    const response = await fetch('/api/ai/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to synthesize content');
    }

    return response.json();
  },

  async generateOutline(params: {
    documentType: string;
    title: string;
    topic: string;
    targetAudience: string;
    wordLimit: number;
    details: Record<string, any>;
  }): Promise<OutlineResponse> {
    const response = await fetch('/api/ai/outline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate outline');
    }

    return response.json();
  },

  async draftSection(params: {
    documentType: string;
    sectionTitle: string;
    targetWords?: number;
    sectionNotes?: string;
    writingProfile: WritingProfile;
    sources: Source[];
    currentDocumentContext: string;
  }): Promise<DraftResponse> {
    const response = await fetch('/api/ai/draft-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to draft section');
    }

    return response.json();
  },

  async rewriteText(params: {
    selectedText: string;
    mode: 'sound-like-me' | 'clarify' | 'shorten' | 'expand' | 'academic-tone' | 'grammar' | 'check-claim' | 'custom';
    writingProfile: WritingProfile;
    documentContext?: string;
    customInstructions?: string;
    targetWordCount?: number;
  }): Promise<RewriteResponse> {
    const response = await fetch('/api/ai/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to rewrite text');
    }

    return response.json();
  },

  async analyzeWritingStyle(writingSamples: string): Promise<{ profile: WritingProfile }> {
    const response = await fetch('/api/ai/analyze-style', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writingSamples }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze style');
    }

    return response.json();
  },

  async checkClaims(documentText: string, sources: Source[]): Promise<{ findings: ClaimFinding[] }> {
    const response = await fetch('/api/ai/check-claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentText, sources }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to check claims');
    }

    return response.json();
  },

  async humanize(text: string, writingProfile?: WritingProfile): Promise<{ humanized: string; metrics: any }> {
    const response = await fetch('/api/ai/humanize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, writingProfile }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to humanize text');
    }

    return response.json();
  },

  async runAudit(params: {
    documentType: string;
    title: string;
    content: string;
    sources: Source[];
    wordLimit: number;
  }): Promise<{ audit: AuditReport }> {
    const response = await fetch('/api/ai/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to audit document');
    }

    return response.json();
  }
};
