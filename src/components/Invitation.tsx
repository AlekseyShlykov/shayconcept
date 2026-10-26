import { ArrowRight } from 'lucide-react';

export function Invitation() {
  const methodologyHref = `${import.meta.env.BASE_URL}methodology/`;

  return (
    <section className="invitation section-pad" aria-labelledby="invitation-title">
      <div className="section-index" aria-hidden="true">03 / An invitation</div>
      <div className="invitation-grid">
        <h2 id="invitation-title">I could tell you all about my methodology.</h2>
        <div className="invitation-body">
          <p>Over the years, I&apos;ve accumulated thousands of pages of research, frameworks, notes, and practical experience.</p>
          <p>You could spend hours exploring how I work.</p>
          <p>Or we could make this much simpler.</p>
          <p>Answer three questions about your organization. I&apos;ll get in touch, and we can figure out what would actually make a difference.</p>
          <div className="button-row">
            <a className="button button-outline" href={methodologyHref}>Explore my methodology</a>
            <a className="button button-solid" href="#diagnostic">Answer 3 questions <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
