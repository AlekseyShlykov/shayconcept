import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type Shape =
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { type: 'rect'; x: number; y: number; width: number; height: number };

const pieces: Shape[] = [
  { type: 'line', x1: 230, y1: 300, x2: 500, y2: 115 },
  { type: 'line', x1: 500, y1: 115, x2: 770, y2: 300 },
  { type: 'line', x1: 250, y1: 285, x2: 250, y2: 590 },
  { type: 'line', x1: 750, y1: 285, x2: 750, y2: 590 },
  { type: 'line', x1: 250, y1: 590, x2: 750, y2: 590 },
  { type: 'line', x1: 300, y1: 285, x2: 300, y2: 590 },
  { type: 'line', x1: 700, y1: 285, x2: 700, y2: 590 },
  { type: 'line', x1: 300, y1: 350, x2: 700, y2: 350 },
  { type: 'line', x1: 300, y1: 450, x2: 700, y2: 450 },
  { type: 'line', x1: 500, y1: 350, x2: 500, y2: 590 },
  { type: 'rect', x: 355, y: 385, width: 85, height: 65 },
  { type: 'rect', x: 560, y: 385, width: 85, height: 65 },
  { type: 'rect', x: 445, y: 485, width: 110, height: 105 },
  { type: 'line', x1: 460, y1: 145, x2: 460, y2: 285 },
  { type: 'line', x1: 540, y1: 145, x2: 540, y2: 285 },
  { type: 'line', x1: 460, y1: 190, x2: 540, y2: 190 },
  { type: 'line', x1: 460, y1: 240, x2: 540, y2: 240 },
  { type: 'line', x1: 175, y1: 610, x2: 825, y2: 610 },
  { type: 'line', x1: 190, y1: 630, x2: 810, y2: 630 },
  { type: 'line', x1: 210, y1: 650, x2: 790, y2: 650 },
  { type: 'line', x1: 235, y1: 670, x2: 765, y2: 670 },
  { type: 'line', x1: 270, y1: 690, x2: 730, y2: 690 },
  { type: 'line', x1: 250, y1: 320, x2: 300, y2: 320 },
  { type: 'line', x1: 700, y1: 320, x2: 750, y2: 320 },
  { type: 'line', x1: 335, y1: 285, x2: 335, y2: 350 },
  { type: 'line', x1: 665, y1: 285, x2: 665, y2: 350 },
  { type: 'line', x1: 365, y1: 450, x2: 365, y2: 590 },
  { type: 'line', x1: 635, y1: 450, x2: 635, y2: 590 },
  { type: 'line', x1: 300, y1: 525, x2: 445, y2: 525 },
  { type: 'line', x1: 555, y1: 525, x2: 700, y2: 525 },
  { type: 'line', x1: 405, y1: 285, x2: 405, y2: 350 },
  { type: 'line', x1: 595, y1: 285, x2: 595, y2: 350 },
];

const offsets = pieces.map((_, index) => ({
  x: ((index * 137) % 760) - 380,
  y: ((index * 83) % 500) - 250,
  rotation: ((index * 67) % 240) - 120,
  scale: 0.55 + ((index * 11) % 9) / 10,
}));

export function ChaosToStructure() {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!section.current || reducedMotion) return;
    const context = gsap.context(() => {
      const nodes = gsap.utils.toArray<SVGElement>('[data-piece]');
      nodes.forEach((node, index) => {
        gsap.set(node, { ...offsets[index], transformOrigin: 'center center' });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '+=260%',
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to('[data-chaos-label]', { opacity: 0, y: -12, duration: 0.12 }, 0)
        .to(nodes, { x: 0, y: 0, rotation: 0, scale: 1, stagger: 0.013, duration: 0.78, ease: 'power2.inOut' }, 0.08)
        .to('[data-grid]', { opacity: 0.16, duration: 0.24 }, 0.62)
        .fromTo('[data-clarity]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.18 }, 0.82);
    }, section);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section id="transformation" ref={section} className={`transformation ${reducedMotion ? 'is-reduced' : ''}`} aria-labelledby="transformation-title">
      <div className="transformation-meta" data-chaos-label>
        <span>Disconnected inputs</span>
        <span>Scroll / 02</span>
      </div>
      <h2 id="transformation-title" className="sr-only">Complexity becomes structure</h2>
      <svg className="structure-svg" viewBox="0 0 1000 760" role="img" aria-label="Scattered geometric fragments align into an architectural drawing of a house">
        <g data-grid opacity={reducedMotion ? 0.16 : 0} className="blueprint-grid">
          {Array.from({ length: 11 }, (_, index) => <line key={`v-${index}`} x1={index * 100} y1="0" x2={index * 100} y2="760" />)}
          {Array.from({ length: 9 }, (_, index) => <line key={`h-${index}`} x1="0" y1={index * 95} x2="1000" y2={index * 95} />)}
        </g>
        <g className="house-drawing">
          {pieces.map((piece, index) => piece.type === 'line' ? (
            <line data-piece key={index} x1={piece.x1} y1={piece.y1} x2={piece.x2} y2={piece.y2} />
          ) : (
            <rect data-piece key={index} x={piece.x} y={piece.y} width={piece.width} height={piece.height} />
          ))}
        </g>
      </svg>
      <div className="clarity-copy" data-clarity style={reducedMotion ? { opacity: 1 } : undefined}>
        <span>From complexity to clarity.</span>
        <span>From chaos to structure.</span>
      </div>
    </section>
  );
}
