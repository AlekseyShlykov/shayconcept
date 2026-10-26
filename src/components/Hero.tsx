import { useLayoutEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const context = gsap.context(() => {
      gsap.from('[data-reveal]', {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power4.out',
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <header ref={root} className="hero section-pad" aria-labelledby="hero-title">
      <div className="hero-mark" aria-hidden="true">S / 01</div>
      <div className="hero-copy">
        <div className="overflow-hidden">
          <h1 id="hero-title" data-reveal>Hi, I&apos;m Shay.</h1>
        </div>
        <div className="hero-statement">
          <div className="overflow-hidden">
            <p data-reveal>I diagnose how people, tools, and information interact.</p>
          </div>
          <div className="overflow-hidden">
            <p data-reveal className="muted">And then design systems that reduce cognitive overload and turn inputs into action.</p>
          </div>
        </div>
      </div>
      <a href="#transformation" className="scroll-cue" aria-label="Scroll to the transformation">
        <span>Scroll to organize</span>
        <ArrowDown aria-hidden="true" size={16} strokeWidth={1.5} />
      </a>
    </header>
  );
}
