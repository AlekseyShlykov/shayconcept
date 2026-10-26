import type { ProfileKey } from './questions';

export type Result = {
  label: string;
  headline: string;
  paragraphs: string[];
};

export const results: Record<ProfileKey, Result> = {
  delegation: {
    label: 'The Delegation Bottleneck',
    headline: 'Your organization might be relying on you more than it should.',
    paragraphs: [
      'When too many decisions, explanations, and checks depend on one person, even a great team can struggle to move independently.',
      'The opportunity may not be to work harder, but to create systems that give people more clarity and autonomy.',
      "That's something we can explore together.",
    ],
  },
  knowledge: {
    label: 'The Knowledge Gap',
    headline: 'The knowledge exists. The system to share it might not.',
    paragraphs: [
      "Important information can easily become scattered across documents, conversations, and people's heads.",
      'When knowledge is hard to find or understand, teams lose time, repeat questions, and reinvent solutions.',
      'A better information structure could make everyday work much easier.',
    ],
  },
  process: {
    label: 'The Process Puzzle',
    headline: 'Before improving the system, we need to understand it.',
    paragraphs: [
      "Sometimes the hardest part isn't solving a specific problem. It's understanding how all the moving pieces connect.",
      "Mapping your actual workflows, identifying friction, and clarifying responsibilities can reveal opportunities that aren't immediately obvious.",
      "That's where I'd suggest we begin.",
    ],
  },
  nextLevel: {
    label: 'The Next Level',
    headline: 'Things are working. But could they work even better?',
    paragraphs: [
      'Having established processes is a strong starting point.',
      'Even well-functioning organizations can benefit from simpler information flows, reduced cognitive load, and more scalable ways of working.',
      "The question isn't necessarily what's broken, but what could become easier.",
    ],
  },
};
