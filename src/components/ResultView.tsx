import { ArrowLeft, Globe2, Instagram, Linkedin, Mail, RotateCcw } from 'lucide-react';
import type { Result } from '../data/results';

type Props = {
  result: Result;
  submission: 'idle' | 'sending' | 'sent' | 'error' | 'preview';
  submissionError: string;
  onRetry: () => void;
  onBack: () => void;
  onRestart: () => void;
};

export function ResultView({ result, submission, submissionError, onRetry, onBack, onRestart }: Props) {
  return (
    <div className="result-wrap">
      <div className="result-alignment" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
      </div>
      <div className="result-grid">
        <p className="question-label">A possible starting point / {result.label}</p>
        <div>
          <h2>{result.headline}</h2>
          <div className="result-body">{result.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </div>

      <div className={`submission-note ${submission}`} role="status">
        {submission === 'sending' && <p>Sending your answers securely…</p>}
        {submission === 'sent' && <p>Your answers were received. Thank you.</p>}
        {submission === 'preview' && <p><strong>Preview mode:</strong> your answers were not sent. Connect a form endpoint before publishing.</p>}
        {submission === 'error' && (
          <div><p>We couldn&apos;t send your answers. {submissionError}</p><button type="button" className="text-button" onClick={onRetry}>Try again</button></div>
        )}
      </div>

      <div className="closing">
        <h2>Thank you. I already have a few ideas.</h2>
        {submission === 'sent' ? (
          <p>Your answers have given me a useful starting point.<br />I&apos;ll take a closer look and get in touch soon so we can discuss what might work best for you.</p>
        ) : (
          <p>Your answers have created a useful preliminary picture. This is a starting point, not a definitive diagnosis.</p>
        )}
        <hr />
        <div className="social-row">
          <p>In the meantime, you can get to know me a little better.</p>
          <div className="social-links" aria-label="Social links">
            <a href="https://www.linkedin.com/" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="mailto:hello@example.com" aria-label="Email"><Mail size={20} /></a>
            <a href="https://example.com/" aria-label="Personal website"><Globe2 size={20} /></a>
          </div>
        </div>
        <div className="result-actions">
          <button type="button" className="text-button" onClick={onBack}><ArrowLeft size={16} /> Change last answer</button>
          <button type="button" className="text-button" onClick={onRestart}><RotateCcw size={16} /> Start again</button>
        </div>
      </div>
    </div>
  );
}
