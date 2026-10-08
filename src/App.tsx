import { Flame, Zap } from 'lucide-react'
import { useState } from 'react'
import { TopicGrid, type TopicId } from './components/TopicGrid'
import { BottomNav, type Tab } from './components/ui/BottomNav'
import { Chip } from './components/ui/Chip'
import { USER_NAME, type LessonResult } from './data/lessons'
import { HomeScreen } from './screens/HomeScreen'
import { PracticeScreen } from './screens/PracticeScreen'
import { QuizScreen } from './screens/QuizScreen'
import { ResultsScreen } from './screens/ResultsScreen'

type Screen = Exclude<Tab, 'practice'> | 'practice' | 'quiz' | 'results'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [xp, setXp] = useState(120)
  const [streak] = useState(4)
  const [signsToday, setSignsToday] = useState(3)
  const [result, setResult] = useState<LessonResult | null>(null)

  function openTopic(topic: TopicId) {
    if (topic === 'alphabet') setScreen('practice')
    if (topic === 'greetings') setScreen('quiz')
  }

  function completeLesson(lessonResult: LessonResult) {
    setXp(xp + lessonResult.xpEarned)
    setSignsToday(signsToday + lessonResult.signsCount)
    setResult(lessonResult)
    setScreen('results')
  }

  if (screen === 'practice') {
    return <PracticeScreen onExit={() => setScreen('home')} onComplete={completeLesson} />
  }
  if (screen === 'quiz') {
    return <QuizScreen onExit={() => setScreen('home')} onComplete={completeLesson} />
  }
  if (screen === 'results' && result) {
    return (
      <ResultsScreen
        result={result}
        xp={xp}
        streak={streak}
        onHome={() => setScreen('home')}
        onNext={() => setScreen(result.retry === 'practice' ? 'quiz' : 'practice')}
        onRetry={() => setScreen(result.retry)}
      />
    )
  }

  return (
    <div className="flex h-full flex-col">
      <main className="min-h-0 flex-1 overflow-y-auto">
        {screen === 'learn' && (
          <div className="pt-safe flex flex-col gap-4 px-5 pb-8">
            <h1 className="text-[1.75rem] font-black">Learn</h1>
            <p className="text-base">Pick a topic to start a lesson.</p>
            <TopicGrid xp={xp} onOpenTopic={openTopic} />
          </div>
        )}
        {screen === 'profile' && (
          <div className="pt-safe flex flex-col gap-4 px-5 pb-8">
            <h1 className="text-[1.75rem] font-black">{USER_NAME}</h1>
            <div className="flex gap-2">
              <Chip tone="blush" icon={<Flame className="size-4" />}>
                {streak} day streak
              </Chip>
              <Chip tone="mint" icon={<Zap className="size-4" />}>
                {xp} XP
              </Chip>
            </div>
          </div>
        )}
        {screen !== 'learn' && screen !== 'profile' && (
          <HomeScreen
            xp={xp}
            streak={streak}
            signsToday={signsToday}
            onOpenTopic={openTopic}
            onSeeAll={() => setScreen('learn')}
          />
        )}
      </main>
      <BottomNav
        active={screen === 'learn' || screen === 'profile' ? screen : 'home'}
        onSelect={setScreen}
      />
    </div>
  )
}

export default App
