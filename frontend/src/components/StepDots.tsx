import { useGameStore } from '../state/gameStore'

const setupSteps = ['playerEntry', 'topicSelect', 'topicOptions'] as const

const StepDots = () => {
  const { stage, round } = useGameStore()

  // Setup flow dots
  if (
    stage === 'playerEntry' ||
    stage === 'topicSelect' ||
    stage === 'customSecrets' ||
    stage === 'topicOptions'
  ) {
    const currentIdx = (() => {
      if (stage === 'playerEntry') return 0
      if (stage === 'topicSelect' || stage === 'customSecrets') return 1
      return 2
    })()

    return (
      <div className="flex items-center gap-2 py-3">
        {setupSteps.map((step, idx) => {
          const isDone = currentIdx > idx
          const isActive = currentIdx === idx
          return (
            <span
              key={step}
              className={`h-3 w-3 rounded-full border border-border transition ${
                isActive ? 'bg-accent border-accent' : isDone ? 'bg-foreground/60' : 'bg-transparent'
              }`}
            />
          )
        })}
      </div>
    )
  }

  // Reveal flow dots
  if ((stage === 'instructions' || stage === 'reveal') && round) {
    const total = round.playerOrder.length
    const currentIdx = round.currentPlayerIndex

    return (
      <div className="flex flex-wrap items-center gap-2 py-3">
        {Array.from({ length: total }).map((_, idx) => {
          const isDone = currentIdx > idx
          const isActive = currentIdx === idx
          return (
            <span
              key={idx}
              className={`h-3 w-3 rounded-full border border-border transition ${
                isActive ? 'bg-accent border-accent' : isDone ? 'bg-foreground/60' : 'bg-transparent'
              }`}
            />
          )
        })}
      </div>
    )
  }

  return null
}

export default StepDots
