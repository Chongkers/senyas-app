import { ArrowLeft, Play } from 'lucide-react'
import { useState } from 'react'
import { AnswerCard, type AnswerState } from '../components/ui/AnswerCard'
import { Button, IconButton } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/Progress'
import { GREETINGS_QUIZ, XP_PER_CORRECT_ANSWER, type LessonResult } from '../data/lessons'

type QuizScreenProps = {
  onExit: () => void
  onComplete: (result: LessonResult) => void
}

export function QuizScreen({ onExit, onComplete }: QuizScreenProps) {
  const { questions } = GREETINGS_QUIZ
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [slow, setSlow] = useState(false)

  const question = questions[index]

  function stateOf(option: number): AnswerState {
    if (!checked) return option === selected ? 'selected' : 'default'
    if (option === question.answer) return 'correct'
    return option === selected ? 'wrong' : 'default'
  }

  function handlePrimary() {
    if (!checked) {
      setChecked(true)
      if (selected === question.answer) setCorrect(correct + 1)
      return
    }
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setSelected(null)
      setChecked(false)
      return
    }
    onComplete({
      lesson: `${GREETINGS_QUIZ.topic} · ${GREETINGS_QUIZ.part}`,
      scoreLabel: `${correct}/${questions.length}`,
      xpEarned: correct * XP_PER_CORRECT_ANSWER,
      signsLabel: `${correct} signs`,
      signsCount: correct,
      retry: 'quiz',
    })
  }

  return (
    <div className="pt-safe pb-safe flex h-full flex-col gap-5 px-5">
      <header className="flex items-center gap-3">
        <IconButton aria-label="Back" onClick={onExit}>
          <ArrowLeft className="size-5" />
        </IconButton>
        <ProgressBar value={(index + (checked ? 1 : 0)) / questions.length} className="flex-1" />
        <span className="font-display text-base font-extrabold">
          {index + 1}/{questions.length}
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        <div>
          <p className="text-base">Question {index + 1}</p>
          <h1 className="text-[1.75rem] font-black leading-tight">{question.prompt}</h1>
        </div>

        {/* Placeholder until recorded FSL clips are added to the bundle. */}
        <div className="relative grid aspect-[16/9] shrink-0 place-items-center rounded-card bg-sky">
          <span className="grid size-16 place-items-center rounded-full bg-white text-periwinkle">
            <Play className="size-7 fill-current" />
          </span>
          <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-sm">
            [{question.clipLabel}]
          </span>
          <button
            type="button"
            aria-pressed={slow}
            onClick={() => setSlow(!slow)}
            className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1.5 text-sm font-extrabold aria-pressed:bg-periwinkle aria-pressed:text-white"
          >
            Slow 0.5×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, i) => (
            <AnswerCard
              key={option.word}
              letter={'ABCD'[i]}
              word={option.word}
              meaning={option.meaning}
              state={stateOf(i)}
              disabled={checked}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>
      </div>

      <Button disabled={selected === null} onClick={handlePrimary}>
        {!checked ? 'Check answer' : index + 1 < questions.length ? 'Next sign' : 'See results'}
      </Button>
    </div>
  )
}
