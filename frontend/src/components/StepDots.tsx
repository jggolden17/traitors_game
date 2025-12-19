import { useGameStore } from '../state/gameStore'

const stepOrder = ['playerEntry', 'topicSelect', 'topicOptions', 'reveal', 'voting'] as const

const StepDots = () => {
  const { stage } = useGameStore()
  const currentIdx = stepOrder.findIndex((s) => s === stage)

  return (
    <div className="flex items-center gap-2 py-3">
      {stepOrder.map((step, idx) => {
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

export default StepDots
