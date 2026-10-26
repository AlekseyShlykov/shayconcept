import { describe, expect, it } from 'vitest';
import { calculateResult } from './scoring';

describe('diagnostic scoring', () => {
  it.each([
    [{ q1: 'A', q2: 'B', q3: 'A' }, 'delegation'],
    [{ q1: 'B', q2: 'B', q3: 'B' }, 'knowledge'],
    [{ q1: 'D', q2: 'C', q3: 'B' }, 'process'],
    [{ q1: 'C', q2: 'A', q3: 'D' }, 'nextLevel'],
  ] as const)('selects the expected profile for %o', (answers, expected) => {
    expect(calculateResult(answers).profile).toBe(expected);
  });

  it('uses the documented priority when scores tie', () => {
    expect(calculateResult({ q1: 'A', q2: 'A', q3: 'D' }).profile).toBe('nextLevel');
    expect(calculateResult({ q1: 'A', q2: 'A', q3: 'B' }).profile).toBe('delegation');
  });

  it('returns internal scores without exposing them to the result copy', () => {
    expect(calculateResult({ q1: 'D', q2: 'B', q3: 'C' }).scores).toEqual({
      delegation: 2,
      knowledge: 0,
      process: 3,
      nextLevel: 0,
    });
  });

  it('calculates a valid deterministic result for all 64 answer paths', () => {
    const options = ['A', 'B', 'C', 'D'];
    const validProfiles = ['delegation', 'knowledge', 'process', 'nextLevel'];
    let pathCount = 0;

    options.forEach((q1) => options.forEach((q2) => options.forEach((q3) => {
      const first = calculateResult({ q1, q2, q3 });
      const second = calculateResult({ q1, q2, q3 });
      expect(validProfiles).toContain(first.profile);
      expect(first).toEqual(second);
      expect(Object.values(first.scores).every((score) => Number.isFinite(score) && score >= 0)).toBe(true);
      pathCount += 1;
    })));

    expect(pathCount).toBe(64);
  });
});
