import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, LoaderCircle, RotateCcw } from 'lucide-react';
import { questions } from '../data/questions';
import { calculateResult, type Responses } from '../data/scoring';
import { results } from '../data/results';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ResultView } from './ResultView';

type Step = 0 | 1 | 2 | 3;
type SubmissionState = 'idle' | 'sending' | 'sent' | 'error' | 'preview';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Diagnostic() {
  const [step, setStep] = useState<Step>(0);
  const [responses, setResponses] = useState<Responses>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [submission, setSubmission] = useState<SubmissionState>('idle');
  const [submissionError, setSubmissionError] = useState('');
  const root = useRef<HTMLElement>(null);
  const lastPayload = useRef<Responses | null>(null);
  const lastSuccessfulKey = useRef('');
  const reducedMotion = useReducedMotion();

  const scrollToStep = () => {
    window.requestAnimationFrame(() => root.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }));
  };

  const submitDiagnostic = async (nextResponses: Responses) => {
    const calculation = calculateResult(nextResponses);
    const payloadKey = JSON.stringify({ email, nextResponses });
    lastPayload.current = nextResponses;
    if (payloadKey === lastSuccessfulKey.current) return;

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
    if (!endpoint) {
      setSubmission('preview');
      return;
    }

    setSubmission('sending');
    setSubmissionError('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          answers: nextResponses,
          result: calculation.profile,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error(`The form service returned ${response.status}.`);
      lastSuccessfulKey.current = payloadKey;
      setSubmission('sent');
    } catch (error) {
      setSubmission('error');
      setSubmissionError(error instanceof Error ? error.message : 'The response could not be sent.');
    }
  };

  const chooseAnswer = (answerId: string) => {
    if (isTransitioning) return;
    const questionIndex = step === 3 ? 2 : step;
    const question = questions[questionIndex];
    const nextResponses = { ...responses, [question.id]: answerId };
    setResponses(nextResponses);
    setSelected(answerId);
    setIsTransitioning(true);

    window.setTimeout(() => {
      setSelected(null);
      setIsTransitioning(false);
      if (step === 0) setStep(1);
      if (step === 1) setStep(2);
      if (step === 3) {
        setShowResult(true);
        void submitDiagnostic(nextResponses);
      }
      scrollToStep();
    }, reducedMotion ? 0 : 260);
  };

  const continueWithEmail = (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmail(email.trim());
    setEmailError('');
    setStep(3);
    scrollToStep();
  };

  const goBack = () => {
    if (showResult) {
      setShowResult(false);
      setStep(3);
    } else if (step === 3) {
      setStep(2);
    } else if (step > 0) {
      setStep((step - 1) as Step);
    }
    scrollToStep();
  };

  const restart = () => {
    setResponses({});
    setEmail('');
    setStep(0);
    setShowResult(false);
    setSubmission('idle');
    scrollToStep();
  };

  const retry = () => {
    if (lastPayload.current) void submitDiagnostic(lastPayload.current);
  };

  if (showResult) {
    const calculation = calculateResult(responses);
    return (
      <section ref={root} id="diagnostic" className="diagnostic result-section">
        <ResultView
          result={results[calculation.profile]}
          submission={submission}
          submissionError={submissionError}
          onRetry={retry}
          onBack={goBack}
          onRestart={restart}
        />
      </section>
    );
  }

  const isEmailStep = step === 2;
  const question = step === 3 ? questions[2] : questions[step];
  const progress = step === 0 ? 1 : step === 1 ? 2 : step === 2 ? 2.5 : 3;
  const visibleStep = step === 0 ? '01' : step === 3 ? '03' : '02';

  return (
    <section ref={root} id="diagnostic" className="diagnostic" aria-live="polite">
      <div className="diagnostic-topbar">
        <span>Diagnostic</span>
        <div className="progress-track" aria-label={isEmailStep ? 'Email checkpoint after step 2 of 3' : `Step ${visibleStep} of 3`}>
          <span style={{ width: `${(progress / 3) * 100}%` }} />
        </div>
        <span>{visibleStep} / 03</span>
      </div>

      <div className={`question-stage ${isTransitioning ? 'is-leaving' : ''}`}>
        {isEmailStep ? (
          <div className="email-step">
            <p className="question-label">Almost there</p>
            <h2>Curious about the third question?</h2>
            <p className="email-support">Leave your email so I can follow up with you personally. Just one more question, and we&apos;ll have a clearer picture of where to start.</p>
            <form onSubmit={continueWithEmail} noValidate>
              <label className="sr-only" htmlFor="email">Your email address</label>
              <div className="email-row">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); setEmailError(''); }}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby="email-note email-error"
                  required
                />
                <button className="button button-solid" type="submit">Reveal the final question <ArrowRight size={17} aria-hidden="true" /></button>
              </div>
              <p id="email-note" className="consent">Your email will only be used to follow up on your answers.</p>
              {emailError && <p id="email-error" className="field-error" role="alert">{emailError}</p>}
            </form>
          </div>
        ) : (
          <div className="question-layout">
            <div>
              <p className="question-label">{question.number} — {question.eyebrow}</p>
              <h2>{question.question}</h2>
            </div>
            <fieldset className="answer-list" disabled={isTransitioning}>
              <legend className="sr-only">Choose one answer</legend>
              {question.answers.map((answer) => (
                <button
                  key={answer.id}
                  type="button"
                  className={`answer-card ${selected === answer.id ? 'is-selected' : ''} ${responses[question.id] === answer.id ? 'was-selected' : ''}`}
                  onClick={() => chooseAnswer(answer.id)}
                  aria-pressed={responses[question.id] === answer.id}
                >
                  <span>{answer.id}</span>
                  <span>{answer.text}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              ))}
            </fieldset>
          </div>
        )}
      </div>

      <div className="diagnostic-controls">
        {step > 0 ? <button type="button" className="text-button" onClick={goBack}><ArrowLeft size={16} /> Back</button> : <span />}
        <span>Select one answer to continue</span>
      </div>

      {submission === 'sending' && <div className="sr-only" role="status"><LoaderCircle /> Sending response</div>}
      <button type="button" className="sr-only" onClick={restart}><RotateCcw /> Restart diagnostic</button>
    </section>
  );
}
