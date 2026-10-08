import type { DetectedLetter } from '../vision/gestureHeuristics'

export type TargetLetter = Exclude<DetectedLetter, 'UNKNOWN'>

export const USER_NAME = 'Lawrence'
export const DAILY_GOAL = 5
export const XP_PER_SIGN = 10
export const XP_PER_CORRECT_ANSWER = 10
export const FAMILY_UNLOCK_XP = 200

// Limited to the letters gestureHeuristics can recognise in the MVP.
export const ALPHABET_LESSON = {
  topic: 'Alphabet',
  part: 'Part 1',
  title: 'Letters A, B, L, Y',
  queue: ['A', 'B', 'L', 'Y'] as TargetLetter[],
}

export type QuizQuestion = {
  prompt: string
  clipLabel: string
  options: { word: string; meaning: string }[]
  answer: number
}

export const GREETINGS_QUIZ = {
  topic: 'Greetings',
  part: 'Part 1',
  questions: [
    {
      prompt: 'What does this sign mean?',
      clipLabel: 'Recorded FSL clip · 3s',
      options: [
        { word: 'Kumusta', meaning: 'Hello, how are you?' },
        { word: 'Salamat', meaning: 'Thank you' },
        { word: 'Paalam', meaning: 'Goodbye' },
        { word: 'Oo', meaning: 'Yes' },
      ],
      answer: 1,
    },
    {
      prompt: 'What does this sign mean?',
      clipLabel: 'Recorded FSL clip · 2s',
      options: [
        { word: 'Hindi', meaning: 'No' },
        { word: 'Paalam', meaning: 'Goodbye' },
        { word: 'Kumusta', meaning: 'Hello, how are you?' },
        { word: 'Pasensya', meaning: 'Sorry' },
      ],
      answer: 2,
    },
    {
      prompt: 'What does this sign mean?',
      clipLabel: 'Recorded FSL clip · 3s',
      options: [
        { word: 'Oo', meaning: 'Yes' },
        { word: 'Salamat', meaning: 'Thank you' },
        { word: 'Magandang umaga', meaning: 'Good morning' },
        { word: 'Paalam', meaning: 'Goodbye' },
      ],
      answer: 3,
    },
    {
      prompt: 'What does this sign mean?',
      clipLabel: 'Recorded FSL clip · 2s',
      options: [
        { word: 'Oo', meaning: 'Yes' },
        { word: 'Hindi', meaning: 'No' },
        { word: 'Salamat', meaning: 'Thank you' },
        { word: 'Pasensya', meaning: 'Sorry' },
      ],
      answer: 0,
    },
    {
      prompt: 'What does this sign mean?',
      clipLabel: 'Recorded FSL clip · 4s',
      options: [
        { word: 'Magandang gabi', meaning: 'Good evening' },
        { word: 'Magandang umaga', meaning: 'Good morning' },
        { word: 'Kumusta', meaning: 'Hello, how are you?' },
        { word: 'Salamat', meaning: 'Thank you' },
      ],
      answer: 1,
    },
  ] as QuizQuestion[],
}

export type LessonResult = {
  lesson: string
  scoreLabel: string
  xpEarned: number
  signsLabel: string
  signsCount: number
  retry: 'practice' | 'quiz'
}
