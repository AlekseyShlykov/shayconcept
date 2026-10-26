export type ProfileKey = 'delegation' | 'knowledge' | 'process' | 'nextLevel';

export type Answer = {
  id: string;
  text: string;
  scores: Partial<Record<ProfileKey, number>>;
};

export type Question = {
  id: 'q1' | 'q2' | 'q3';
  number: string;
  eyebrow: string;
  question: string;
  answers: Answer[];
};

export const questions: Question[] = [
  {
    id: 'q1',
    number: '01 / 03',
    eyebrow: 'THE CHALLENGE',
    question: "What's your biggest challenge with the way work gets done?",
    answers: [
      { id: 'A', text: 'I spend too much time micromanaging.', scores: { delegation: 2 } },
      { id: 'B', text: "We don't have a proper knowledge base.", scores: { knowledge: 2 } },
      { id: 'C', text: "People can't find the information they need.", scores: { knowledge: 2 } },
      { id: 'D', text: "I'm not even sure where the problem is. Everything feels complicated.", scores: { process: 2 } },
    ],
  },
  {
    id: 'q2',
    number: '02 / 03',
    eyebrow: 'THE PROCESS',
    question: 'Have you ever audited your internal processes?',
    answers: [
      { id: 'A', text: 'Yes, we follow clear and documented protocols.', scores: { nextLevel: 2 } },
      { id: 'B', text: "Yes, but there's definitely room for improvement.", scores: { process: 1 } },
      { id: 'C', text: 'No, and we could use some help.', scores: { process: 2 } },
      { id: 'D', text: 'No, but everything seems to work just fine!', scores: { nextLevel: 2 } },
    ],
  },
  {
    id: 'q3',
    number: '03 / 03',
    eyebrow: 'YOUR ATTENTION',
    question: 'What tends to demand most of your attention?',
    answers: [
      { id: 'A', text: 'Checking up on employees and making sure things get done.', scores: { delegation: 2 } },
      { id: 'B', text: 'Explaining tasks to people who struggle with complex documentation.', scores: { knowledge: 2 } },
      { id: 'C', text: 'Showing others how to do things instead of letting them figure it out.', scores: { delegation: 2 } },
      { id: 'D', text: 'Nothing in particular. I rarely get distracted.', scores: { nextLevel: 2 } },
    ],
  },
];
