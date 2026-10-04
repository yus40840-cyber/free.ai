export type DocumentType = 
  | 'research-paper'
  | 'sop'
  | 'motivation-letter'
  | 'essay'
  | 'proposal'
  | 'personal-statement'
  | 'literature-review'
  | 'abstract'
  | 'scholarship-essay'
  | 'cover-letter'
  | 'assignment'
  | 'report';

export type CitationStyle = 'APA 7' | 'MLA 9' | 'Chicago' | 'Harvard' | 'IEEE' | 'Vancouver';

export const SUPPORTED_CITATION_STYLES: CitationStyle[] = [
  'APA 7',
  'MLA 9',
  'Chicago',
  'Harvard',
  'IEEE',
  'Vancouver'
];

export interface AuthenticityMetrics {
  humanCadence: number; // 0-100%
  burstinessScore: number; // sentence length variation
  voiceConsistency: number; // alignment with student profile
  clicheIndex: 'Zero Clichés' | 'Minimal' | 'Detected';
  overallGrade: '100% Natural Human' | 'Highly Authentic' | 'Needs Natural Polish';
}

export type AIModelType = 
  | 'auto'
  | 'gemini-3.8-flash'
  | 'claude-3.5-sonnet'
  | 'gpt-4o'
  | 'deepseek-r1';

export type UserRole = 'STUDENT' | 'EDITOR' | 'ORG_ADMIN' | 'ADMIN' | 'SUPER_ADMIN';

export type PlanType = 'Free' | 'Student' | 'Pro' | 'Researcher' | 'University';

export interface Source {
  id: string;
  title: string;
  author: string;
  year: number;
  publication?: string;
  doi?: string;
  url?: string;
  sourceType?: 'pdf' | 'doi' | 'url' | 'bibtex' | 'manual';
  fileSize?: string;
  excerpt: string;
  isCited: boolean;
  citationKey?: string;
  tags?: string[];
  extractedChunks?: string[];
}

export interface WritingProfile {
  tone: string;
  formality: 'Low' | 'Medium' | 'Medium-High' | 'High';
  vocabulary: 'Accessible' | 'Moderate' | 'Sophisticated' | 'Specialized';
  sentenceLength: 'Compact' | 'Medium' | 'Complex';
  personalVoice: 'Subtle' | 'Balanced' | 'Strong';
  complexity: 'Undergraduate' | "Master's" | 'Doctoral';
  firstPerson: string;
  keyPhrases: string[];
  summary: string;
  rawSamples: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  targetWords: number;
  currentWords: number;
  completed: boolean;
  notes?: string;
}

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  timestamp: string;
  label: string;
  description: string;
  content: string;
  wordCount: number;
}

export interface AuditWarning {
  severity: 'high' | 'medium' | 'low';
  category: 'Citations' | 'Grammar' | 'Structure' | 'Word Count' | 'Claims' | 'References';
  message: string;
  snippet?: string;
}

export interface AuditReport {
  scores: {
    grammar: number;
    structure: number;
    citations: number;
    voiceAuthenticity: number;
    academicRigor: number;
  };
  overallReadiness: string;
  warnings: AuditWarning[];
  recommendations: string[];
  lastChecked: string;
}

export interface DocumentFormatting {
  fontFamily: 'serif' | 'sans' | 'times';
  fontSize: number; // 11, 12, 14
  lineSpacing: number; // 1.5, 2.0
  margins: 'normal' | 'wide' | 'compact';
}

export interface AcademicDocument {
  id: string;
  title: string;
  type: DocumentType;
  content: string;
  targetWordLimit: number;
  citationStyle?: CitationStyle;
  sources: Source[];
  sections: DocumentSection[];
  versions?: DocumentVersion[];
  formatting?: DocumentFormatting;
  createdAt: string;
  updatedAt: string;
  details?: Record<string, any>;
  auditReport?: AuditReport;
  authenticityMetrics?: AuthenticityMetrics;
}

export interface AIUsageRecord {
  id: string;
  timestamp: string;
  operation: string;
  provider: 'ScholarFlow Engine' | 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek';
  model: string;
  inputTokens: number;
  outputTokens: number;
  credits: number;
  latencyMs: number;
  estimatedCost: string;
  status: 'success' | 'fallback' | 'error';
}

export interface BillingInvoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Processing' | 'Refunded';
  plan: PlanType;
  invoiceUrl: string;
}

export interface UserState {
  id: string;
  name: string;
  email: string;
  institution: string;
  fieldOfStudy: string;
  academicLevel: 'Undergraduate' | "Master's" | 'PhD' | 'Faculty / Researcher';
  role: UserRole;
  aiUnits: number;
  plan: PlanType;
  planBillingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
  writingProfile: WritingProfile;
  aiHistory?: AIUsageRecord[];
  invoices?: BillingInvoice[];
}

export interface AIProviderHealth {
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek';
  model: string;
  status: 'Online' | 'Degraded' | 'Offline';
  latencyMs: number;
  uptimePercent: number;
  costPer1kTokens: string;
  assignedTasks: string;
}
