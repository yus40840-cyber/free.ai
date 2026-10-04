import React, { useState } from 'react';
import { X, Download, FileText, Check, Copy, Printer, Bookmark } from 'lucide-react';
import { AcademicDocument } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: AcademicDocument;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadDocx = () => {
    // Generate clean Microsoft Word compatible HTML-document Blob
    const bibliographyHtml = document.sources.length > 0
      ? `<h2>References</h2><ul>${document.sources.map(s => `<li>${s.author} (${s.year}). ${s.title}. <i>${s.publication || 'Journal'}</i>. ${s.doi ? `https://doi.org/${s.doi}` : ''}</li>`).join('')}</ul>`
      : '';

    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${document.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 2.0; margin: 1in; }
          h1 { font-size: 18pt; text-align: center; margin-bottom: 24pt; font-weight: bold; }
          h2 { font-size: 14pt; margin-top: 18pt; font-weight: bold; }
          h3 { font-size: 12pt; margin-top: 12pt; font-weight: bold; }
          p { text-indent: 0.5in; margin-bottom: 0pt; }
        </style>
      </head>
      <body>
        <h1>${document.title}</h1>
        <div>${document.content.replace(/\n\n/g, '</p><p>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>')}</div>
        <br/><br/>
        ${bibliographyHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const bib = document.sources.length > 0 
      ? `\n\n## References\n\n` + document.sources.map((s, idx) => `[${idx + 1}] ${s.author} (${s.year}). *${s.title}*. ${s.publication || ''}.`).join('\n')
      : '';
    const fullText = document.content + bib;

    const blob = new Blob([fullText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Export Document</div>
            <h2 className="text-base font-serif font-bold text-neutral-900">
              Download Academic Output
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formats list */}
        <div className="p-6 space-y-3">
          
          <button
            onClick={handleDownloadDocx}
            className="w-full p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/60 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                DOCX
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-900 group-hover:text-blue-900">
                  Microsoft Word (.doc / .docx)
                </div>
                <div className="text-xs text-neutral-500">
                  Double-spaced academic layout, running header, and references
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
          </button>

          <button
            onClick={handlePrintPDF}
            className="w-full p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/60 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold text-xs">
                PDF
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-900 group-hover:text-red-900">
                  Print-Ready Academic PDF
                </div>
                <div className="text-xs text-neutral-500">
                  Clean typographic layout ready for university submission
                </div>
              </div>
            </div>
            <Printer className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="w-full p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/60 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs">
                MD
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-900">
                  Markdown (.md)
                </div>
                <div className="text-xs text-neutral-500">
                  Standard format with headings, citations, and footnotes
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
          </button>

          <button
            onClick={handleCopyClipboard}
            className="w-full p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/60 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs">
                TXT
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-900">
                  {copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}
                </div>
                <div className="text-xs text-neutral-500">
                  Direct paste into email, application portal, or Google Docs
                </div>
              </div>
            </div>
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />}
          </button>

        </div>

      </div>
    </div>
  );
};
