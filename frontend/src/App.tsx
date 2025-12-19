import { GameProvider, useGameStore } from './state/gameStore'
import Home from './components/Home'
import PlayerEntry from './components/PlayerEntry'
import TopicSelection from './components/TopicSelection'
import TopicAndOptions from './components/TopicAndOptions'
import RevealCycle from './components/RevealCycle'
import QuestionPhase from './components/QuestionPhase'
import DiscussionTimer from './components/DiscussionTimer'
import Voting from './components/Voting'
import EndScreen from './components/EndScreen'

const StageRouter = () => {
  const { stage } = useGameStore()

  switch (stage) {
    case 'home':
      return <Home />
    case 'playerEntry':
      return <PlayerEntry />
    case 'topicSelect':
      return <TopicSelection />
    case 'topicOptions':
      return <TopicAndOptions />
    case 'reveal':
      return <RevealCycle />
    case 'questions':
      return <QuestionPhase />
    case 'discussion':
      return <DiscussionTimer />
    case 'voting':
      return <Voting />
    case 'end':
      return <EndScreen />
    default:
      return <Home />
  }
}

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-[96px] pt-8">
          <StageRouter />
        </main>
      </div>
    </GameProvider>
  )
}

export default App
