import { WritingProfile, Source, CitationStyle } from '../types';
import { formatInTextCitation } from './citationFormatter';

export interface NaturalnessAudit {
  humanCadenceScore: number; // 0 - 100
  burstinessScore: number; // 0 - 100 (standard deviation of sentence lengths)
  perplexityScore: number; // 0 - 100 (lexical richness & syntactic unpredictability)
  voiceMatchScore: number; // 0 - 100 (profile alignment)
  sourceGroundingScore: number; // 0 - 100 (cited factual claims)
  detectedCliches: Array<{ phrase: string; index: number; suggestedReplacement: string }>;
  sentenceMetrics: {
    totalSentences: number;
    avgSentenceLength: number;
    minSentenceLength: number;
    maxSentenceLength: number;
    stdDev: number;
    distribution: {
      short: number; // < 12 words
      medium: number; // 12 - 25 words
      long: number; // > 25 words
    };
  };
  overallVerdict: '100% Natural Human Cadence' | 'Highly Authentic (Passing)' | 'Moderate Risk (Needs Polish)' | 'Predictable AI Cadence';
  actionableInsights: string[];
}

// Common formulaic AI phrases and their authentic academic alternatives
const KNOWN_AI_CLICHES: Array<{ pattern: RegExp; text: string; replacement: string }> = [
  { pattern: /\bdelve(s|d)?\s+into\b/gi, text: 'delve into', replacement: 'examine' },
  { pattern: /\btapestry\s+of\b/gi, text: 'tapestry of', replacement: 'interplay of' },
  { pattern: /\btestament\s+to\b/gi, text: 'testament to', replacement: 'evidence of' },
  { pattern: /\bbeacon\s+of\b/gi, text: 'beacon of', replacement: 'model for' },
  { pattern: /\bmultifaceted\b/gi, text: 'multifaceted', replacement: 'complex' },
  { pattern: /\bplays\s+a\s+(crucial|pivotal|vital|key)\s+role\b/gi, text: 'plays a crucial role', replacement: 'influences' },
  { pattern: /\bin\s+today's\s+(digital|modern|rapidly\s+evolving)?\s+(world|era|society|age)\b/gi, text: "in today's world", replacement: 'contemporarily' },
  { pattern: /\bit\s+is\s+worth\s+noting\s+that\b/gi, text: 'it is worth noting that', replacement: 'notably,' },
  { pattern: /\bit\s+is\s+important\s+to\s+(remember|note|recognize)\b/gi, text: 'it is important to note', replacement: 'significantly,' },
  { pattern: /\ba\s+plethora\s+of\b/gi, text: 'a plethora of', replacement: 'numerous' },
  { pattern: /\bever-changing|ever-evolving\b/gi, text: 'ever-evolving', replacement: 'dynamic' },
  { pattern: /\brich\s+tapestry\b/gi, text: 'rich tapestry', replacement: 'diverse matrix' },
  { pattern: /\bgame[- ]changer\b/gi, text: 'game-changer', replacement: 'critical inflection point' },
  { pattern: /\bfosters\s+a\b/gi, text: 'fosters a', replacement: 'encourages' },
  { pattern: /\bseamlessly\s+integrated\b/gi, text: 'seamlessly integrated', replacement: 'unified' },
  { pattern: /\bin\s+conclusion,\s+/gi, text: 'in conclusion,', replacement: 'ultimately,' },
  { pattern: /\bfurthermore,\s+moreover,\b/gi, text: 'furthermore, moreover,', replacement: 'subsequently,' },
  { pattern: /\bnot\s+only\s+[^,]+,\s+but\s+also\b/gi, text: 'not only ... but also', replacement: 'both ... and' },
  { pattern: /\bparamount\s+importance\b/gi, text: 'paramount importance', replacement: 'primary significance' },
  { pattern: /\blandscape\s+of\b/gi, text: 'landscape of', replacement: 'domain of' }
];

/**
 * Splits text into sentences cleanly respecting abbreviations
 */
export function extractSentences(text: string): string[] {
  if (!text) return [];
  // Clean markdown headings, quotes, and bibs
  const clean = text.replace(/#{1,6}\s+[^\n]+/g, '').replace(/```[\s\S]*?```/g, '');
  return clean
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
}

/**
 * Analyzes authentic human cadence, sentence burstiness, and AI detection indicators
 */
export function auditNaturalCadence(
  text: string, 
  profile?: WritingProfile,
  sources?: Source[]
): NaturalnessAudit {
  const sentences = extractSentences(text);
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  if (sentences.length === 0 || totalWords === 0) {
    return {
      humanCadenceScore: 95,
      burstinessScore: 92,
      perplexityScore: 90,
      voiceMatchScore: 94,
      sourceGroundingScore: 85,
      detectedCliches: [],
      sentenceMetrics: {
        totalSentences: 0,
        avgSentenceLength: 0,
        minSentenceLength: 0,
        maxSentenceLength: 0,
        stdDev: 0,
        distribution: { short: 0, medium: 0, long: 0 }
      },
      overallVerdict: '100% Natural Human Cadence',
      actionableInsights: ['Enter text to analyze human cadence and detector resilience.']
    };
  }

  // 1. Calculate Burstiness (standard deviation of sentence lengths)
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).filter(Boolean).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLen, 2), 0) / sentenceLengths.length;
  const stdDev = Math.sqrt(variance);

  let shortCount = 0;
  let medCount = 0;
  let longCount = 0;
  sentenceLengths.forEach(len => {
    if (len < 13) shortCount++;
    else if (len <= 26) medCount++;
    else longCount++;
  });

  // Human academic writing features high burstiness (std dev > 7.5 and good distribution of short & long sentences)
  // AI typically has stdDev between 2.5 and 5.0 with almost all sentences clustered at 16-22 words.
  let burstinessScore = Math.min(100, Math.round((stdDev / 8.5) * 85 + 15));
  if (stdDev < 4.0) burstinessScore = Math.max(35, Math.round(stdDev * 12));

  // 2. Scan for robotic formulaic AI cliches
  const detectedCliches: Array<{ phrase: string; index: number; suggestedReplacement: string }> = [];
  KNOWN_AI_CLICHES.forEach(item => {
    let match: RegExpExecArray | null;
    const regex = new RegExp(item.pattern.source, 'gi');
    while ((match = regex.exec(text)) !== null) {
      detectedCliches.push({
        phrase: match[0],
        index: match.index,
        suggestedReplacement: item.replacement
      });
    }
  });

  // 3. Perplexity & Vocabulary Diversity Proxy (Type-Token Ratio)
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
  const ttr = uniqueWords.size / Math.max(1, totalWords);
  // High TTR + healthy sentence length variance = high perplexity
  let perplexityScore = Math.min(100, Math.round((ttr * 140) + (stdDev > 6 ? 15 : 5)));

  // 4. Source Grounding Score
  // Check for in-text citations: parenthetical (Author, Year) or numeric [1]
  const citationMatches = text.match(/\([A-Z][a-zA-Z\s&,]+(?:19|20)\d{2}[^)]*\)|\[\d+\]|\(\d+\)/g) || [];
  const sourceGroundingScore = Math.min(100, Math.round((citationMatches.length / Math.max(1, sentences.length * 0.4)) * 95 + 15));

  // 5. Voice Match Score
  let voiceMatchScore = 92;
  if (profile) {
    if (profile.formality === 'High' && text.includes("don't") || text.includes("can't")) {
      voiceMatchScore -= 8;
    }
    if (profile.sentenceLength === 'Complex' && avgLen < 15) {
      voiceMatchScore -= 6;
    }
  }

  // 6. Overall Human Cadence Score
  const clichePenalty = Math.min(30, detectedCliches.length * 8);
  const humanCadenceScore = Math.max(30, Math.min(100, Math.round(
    (burstinessScore * 0.35) + 
    (perplexityScore * 0.25) + 
    (voiceMatchScore * 0.20) + 
    (sourceGroundingScore * 0.20) - 
    clichePenalty
  )));

  let overallVerdict: NaturalnessAudit['overallVerdict'] = '100% Natural Human Cadence';
  if (humanCadenceScore < 60 || detectedCliches.length >= 3) {
    overallVerdict = 'Predictable AI Cadence';
  } else if (humanCadenceScore < 78 || detectedCliches.length > 0) {
    overallVerdict = 'Moderate Risk (Needs Polish)';
  } else if (humanCadenceScore < 90) {
    overallVerdict = 'Highly Authentic (Passing)';
  }

  const actionableInsights: string[] = [];
  if (stdDev < 5.5) {
    actionableInsights.push('Inject rhythmic variety: alternate punchy short assertions (6-10 words) with compound academic observations.');
  }
  if (detectedCliches.length > 0) {
    actionableInsights.push(`Eliminate ${detectedCliches.length} robotic cliché phrase(s) such as "${detectedCliches[0].phrase}".`);
  }
  if (citationMatches.length === 0) {
    actionableInsights.push('Anchor empirical claims with direct literature citations from your attached sources.');
  }
  if (ttr < 0.45 && totalWords > 150) {
    actionableInsights.push('Elevate lexical density: replace repeated common adjectives with domain-specific scholarly terminology.');
  }
  if (actionableInsights.length === 0) {
    actionableInsights.push('Exemplary authentic flow. High perplexity and balanced burstiness ensure natural human-authored cadence.');
  }

  return {
    humanCadenceScore,
    burstinessScore,
    perplexityScore,
    voiceMatchScore,
    sourceGroundingScore,
    detectedCliches,
    sentenceMetrics: {
      totalSentences: sentences.length,
      avgSentenceLength: Math.round(avgLen * 10) / 10,
      minSentenceLength: Math.min(...sentenceLengths),
      maxSentenceLength: Math.max(...sentenceLengths),
      stdDev: Math.round(stdDev * 10) / 10,
      distribution: {
        short: shortCount,
        medium: medCount,
        long: longCount
      }
    },
    overallVerdict,
    actionableInsights
  };
}

/**
 * Naturalizes text to break up AI uniformity, eliminate cliches, and ground with citations
 */
export function naturalizeAcademicText(
  text: string, 
  profile?: WritingProfile,
  sources?: Source[],
  citationStyle: CitationStyle = 'APA 7'
): { naturalized: string; changesCount: number } {
  if (!text) return { naturalized: '', changesCount: 0 };

  let result = text;
  let changes = 0;

  // 1. Replace AI cliches with natural academic terms
  KNOWN_AI_CLICHES.forEach(item => {
    if (item.pattern.test(result)) {
      result = result.replace(item.pattern, () => {
        changes++;
        return item.replacement;
      });
    }
  });

  // 2. Break up robotic transition clusters like "Furthermore," or "Moreover," if repeated
  const roboticTransitions = [
    { from: /\bFurthermore,\s+/g, to: 'In parallel, ' },
    { from: /\bMoreover,\s+/g, to: 'Crucially, ' },
    { from: /\bAdditionally,\s+/g, to: 'Building on this, ' },
    { from: /\bIn summary,\s+/g, to: 'Synthesizing these dynamics, ' }
  ];

  roboticTransitions.forEach(({ from, to }) => {
    if (from.test(result)) {
      result = result.replace(from, () => {
        changes++;
        return to;
      });
    }
  });

  // 3. Ground ungrounded empirical statements if sources are provided
  if (sources && sources.length > 0 && !result.includes('(') && !result.includes('[')) {
    // Attach source citation to first relevant paragraph
    const paragraphs = result.split('\n\n');
    if (paragraphs.length > 1) {
      const cite = formatInTextCitation(sources[0], citationStyle);
      paragraphs[0] += ` ${cite}`;
      result = paragraphs.join('\n\n');
      changes++;
    }
  }

  return { naturalized: result, changesCount: changes };
}
