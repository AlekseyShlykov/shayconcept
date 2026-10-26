import { questions, type ProfileKey } from './questions';

export type Responses = Partial<Record<'q1' | 'q2' | 'q3', string>>;
export type Scores = Record<ProfileKey, number>;

export const resultPriority: ProfileKey[] = ['delegation', 'knowledge', 'process', 'nextLevel'];

export function calculateResult(responses: Responses): { profile: ProfileKey; scores: Scores } {
  const scores: Scores = { delegation: 0, knowledge: 0, process: 0, nextLevel: 0 };

  questions.forEach((question) => {
    const answer = question.answers.find((option) => option.id === responses[question.id]);
    if (!answer) return;
    Object.entries(answer.scores).forEach(([key, points]) => {
      scores[key as ProfileKey] += points ?? 0;
    });
  });

  const profile = resultPriority.reduce((winner, key) =>
    scores[key] > scores[winner] ? key : winner,
  );

  return { profile, scores };
}
