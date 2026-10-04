import { Source, CitationStyle } from '../types';

export const SUPPORTED_CITATION_STYLES: CitationStyle[] = [
  'APA 7',
  'MLA 9',
  'Chicago',
  'Harvard',
  'IEEE',
  'Vancouver'
];

export interface CitationStyleInfo {
  id: CitationStyle;
  name: string;
  description: string;
  category: string;
  inTextExample: string;
  bibExample: string;
}

export const CITATION_STYLE_DETAILS: Record<CitationStyle, CitationStyleInfo> = {
  'APA 7': {
    id: 'APA 7',
    name: 'APA 7th Edition',
    description: 'American Psychological Association author-date format for psychology, education, and social sciences.',
    category: 'Social & Behavioral Sciences',
    inTextExample: '(Rajpurkar et al., 2023)',
    bibExample: 'Rajpurkar, P., Chen, E., & Banerjee, O. (2023). Multimodal representations in clinical decision support. Nature Digital Medicine, 6(1), 12-24. https://doi.org/10.1038/s41746-023-00812-z'
  },
  'MLA 9': {
    id: 'MLA 9',
    name: 'MLA 9th Edition',
    description: 'Modern Language Association author-page format for humanities, literature, and cultural studies.',
    category: 'Humanities & Arts',
    inTextExample: '(Rajpurkar et al. 18)',
    bibExample: 'Rajpurkar, Pranav, et al. "Multimodal Representations in Clinical Decision Support." Nature Digital Medicine, vol. 6, no. 1, 2023, pp. 12-24. https://doi.org/10.1038/s41746-023-00812-z.'
  },
  'Chicago': {
    id: 'Chicago',
    name: 'Chicago 17th Edition (Author-Date / Notes)',
    description: 'University of Chicago press standard for history, publishing, economics, and interdisciplinary research.',
    category: 'History & Publishing',
    inTextExample: '(Rajpurkar, Chen, and Banerjee 2023, 18)',
    bibExample: 'Rajpurkar, Pranav, Emily Chen, and Oliver Banerjee. 2023. "Multimodal Representations in Clinical Decision Support." Nature Digital Medicine 6 (1): 12–24. https://doi.org/10.1038/s41746-023-00812-z.'
  },
  'Harvard': {
    id: 'Harvard',
    name: 'Harvard Referencing',
    description: 'Parenthetical author-date system common across UK, European, Australian, and Commonwealth universities.',
    category: 'Interdisciplinary & European/UK',
    inTextExample: '(Rajpurkar et al., 2023)',
    bibExample: 'Rajpurkar, P., Chen, E. and Banerjee, O. (2023) \'Multimodal representations in clinical decision support\', Nature Digital Medicine, 6(1), pp. 12-24. doi: 10.1038/s41746-023-00812-z.'
  },
  'IEEE': {
    id: 'IEEE',
    name: 'IEEE Style',
    description: 'Institute of Electrical and Electronics Engineers numbered bracketed format for computer science, AI, and engineering.',
    category: 'Computer Science & Engineering',
    inTextExample: '[1]',
    bibExample: '[1] P. Rajpurkar, E. Chen, and O. Banerjee, "Multimodal representations in clinical decision support," Nat. Digit. Med., vol. 6, no. 1, pp. 12-24, 2023, doi: 10.1038/s41746-023-00812-z.'
  },
  'Vancouver': {
    id: 'Vancouver',
    name: 'Vancouver Biomedical Style',
    description: 'Uniform Requirements / ICMJE numeric sequential format for medicine, nursing, clinical research, and life sciences.',
    category: 'Biomedical & Health Sciences',
    inTextExample: '(1) or [1]',
    bibExample: '1. Rajpurkar P, Chen E, Banerjee O. Multimodal representations in clinical decision support. Nat Digit Med. 2023;6(1):12-24.'
  }
};

/**
 * Clean and parse author names into components
 */
function parseAuthors(authorString: string): string[] {
  if (!authorString) return ['Unknown Author'];
  // Handle "Author, A. & Author, B." or "Author, A., Author, B." or "Author A, Author B"
  const rawAuthors = authorString
    .replace(/\bet al\.?/i, '')
    .split(/\s*(&|and|;|, and)\s*|\s*,\s*(?=[A-Z][a-z]+)/i)
    .map(a => a?.trim())
    .filter(a => a && a !== '&' && a !== 'and');
  
  return rawAuthors.length > 0 ? rawAuthors : [authorString];
}

function getPrimaryLastName(authorStr: string): string {
  const authors = parseAuthors(authorStr);
  const first = authors[0] || 'Unknown';
  if (first.includes(',')) {
    return first.split(',')[0].trim();
  }
  const parts = first.trim().split(/\s+/);
  return parts[parts.length - 1] || first;
}

/**
 * Formats in-text citation for a source according to specified style
 */
export function formatInTextCitation(
  source: Source, 
  style: CitationStyle = 'APA 7', 
  options?: { page?: string | number; index?: number }
): string {
  const index = options?.index !== undefined ? options.index + 1 : 1;
  const page = options?.page ? ` ${options.page}` : '';
  const pageComma = options?.page ? `, p. ${options.page}` : '';
  const authors = parseAuthors(source.author);
  const primaryLast = getPrimaryLastName(source.author);

  switch (style) {
    case 'APA 7': {
      if (authors.length === 1) {
        return `(${primaryLast}, ${source.year}${pageComma})`;
      } else if (authors.length === 2) {
        const secondLast = getPrimaryLastName(authors[1]);
        return `(${primaryLast} & ${secondLast}, ${source.year}${pageComma})`;
      } else {
        return `(${primaryLast} et al., ${source.year}${pageComma})`;
      }
    }

    case 'MLA 9': {
      if (authors.length === 1) {
        return `(${primaryLast}${page})`;
      } else if (authors.length === 2) {
        const secondLast = getPrimaryLastName(authors[1]);
        return `(${primaryLast} and ${secondLast}${page})`;
      } else {
        return `(${primaryLast} et al.${page})`;
      }
    }

    case 'Chicago': {
      if (authors.length === 1) {
        return `(${primaryLast} ${source.year}${options?.page ? `, ${options.page}` : ''})`;
      } else if (authors.length === 2) {
        const secondLast = getPrimaryLastName(authors[1]);
        return `(${primaryLast} and ${secondLast} ${source.year}${options?.page ? `, ${options.page}` : ''})`;
      } else {
        return `(${primaryLast} et al. ${source.year}${options?.page ? `, ${options.page}` : ''})`;
      }
    }

    case 'Harvard': {
      if (authors.length === 1) {
        return `(${primaryLast}, ${source.year}${pageComma})`;
      } else if (authors.length === 2) {
        const secondLast = getPrimaryLastName(authors[1]);
        return `(${primaryLast} and ${secondLast}, ${source.year}${pageComma})`;
      } else {
        return `(${primaryLast} et al., ${source.year}${pageComma})`;
      }
    }

    case 'IEEE': {
      return `[${index}]`;
    }

    case 'Vancouver': {
      return `(${index})`;
    }

    default:
      return `(${primaryLast}, ${source.year})`;
  }
}

/**
 * Formats a single bibliographic reference entry according to specified style
 */
export function formatBibliographicEntry(
  source: Source, 
  style: CitationStyle = 'APA 7', 
  index: number = 0
): string {
  const author = source.author || 'Anonymous';
  const year = source.year || 2024;
  const title = source.title || 'Untitled Work';
  const pub = source.publication || 'Academic Press';
  const doi = source.doi ? `https://doi.org/${source.doi.replace(/^https?:\/\/doi\.org\//, '')}` : '';
  const url = source.url || '';
  const link = doi || url;

  switch (style) {
    case 'APA 7': {
      // Author, A. A. (Year). Title. Publication. URL/DOI
      return `${author} (${year}). ${title}. ${pub}.${link ? ` ${link}` : ''}`;
    }

    case 'MLA 9': {
      // Author. "Title." Publication, Year. Link.
      return `${author}. "${title}." ${pub}, ${year}.${link ? ` ${link}.` : ''}`;
    }

    case 'Chicago': {
      // Author. Year. "Title." Publication. Link.
      return `${author}. ${year}. "${title}." ${pub}.${link ? ` ${link}` : ''}`;
    }

    case 'Harvard': {
      // Author (Year) 'Title', Publication. Available at: Link.
      return `${author} (${year}) '${title}', ${pub}.${link ? ` Available at: ${link}.` : ''}`;
    }

    case 'IEEE': {
      // [1] Author, "Title," Publication, Year, doi: ...
      const num = index + 1;
      return `[${num}] ${author}, "${title}," ${pub}, ${year}${doi ? `, doi: ${source.doi}` : link ? `, ${link}` : ''}.`;
    }

    case 'Vancouver': {
      // 1. Author. Title. Publication. Year; Link.
      const num = index + 1;
      // Clean initials format for Vancouver
      const cleanAuthor = author.replace(/\./g, '').replace(/,/g, '');
      return `${num}. ${cleanAuthor}. ${title}. ${pub}. ${year}.${link ? ` Available from: ${link}` : ''}`;
    }

    default:
      return `${author} (${year}). ${title}. ${pub}.`;
  }
}

/**
 * Generates formatted full bibliography section for all document sources
 */
export function formatCompleteBibliography(
  sources: Source[], 
  style: CitationStyle = 'APA 7'
): string {
  if (!sources || sources.length === 0) {
    return 'No sources cited in this manuscript.';
  }

  // IEEE and Vancouver maintain citation order; APA, MLA, Chicago, Harvard sort alphabetically by first author
  let orderedSources = [...sources];
  if (style !== 'IEEE' && style !== 'Vancouver') {
    orderedSources.sort((a, b) => {
      const authorA = getPrimaryLastName(a.author).toLowerCase();
      const authorB = getPrimaryLastName(b.author).toLowerCase();
      return authorA.localeCompare(authorB);
    });
  }

  let heading = 'References';
  if (style === 'MLA 9') heading = 'Works Cited';
  else if (style === 'Chicago') heading = 'Bibliography';
  else if (style === 'Vancouver') heading = 'Reference List';

  const entries = orderedSources.map((s, idx) => formatBibliographicEntry(s, style, idx));
  
  return `## ${heading}\n\n` + entries.join('\n\n');
}

/**
 * Automatically maps a citation index or reference back to a source
 */
export function findSourceForCitation(
  citationText: string, 
  sources: Source[]
): Source | undefined {
  if (!sources || sources.length === 0) return undefined;
  
  // Check numeric IEEE / Vancouver format [1] or (1)
  const numMatch = citationText.match(/[\[\(](\d+)[\]\)]/);
  if (numMatch) {
    const idx = parseInt(numMatch[1], 10) - 1;
    if (sources[idx]) return sources[idx];
  }

  // Check author name match
  const clean = citationText.replace(/[()\[\]]/g, '').toLowerCase();
  return sources.find(s => {
    const last = getPrimaryLastName(s.author).toLowerCase();
    return clean.includes(last);
  });
}
