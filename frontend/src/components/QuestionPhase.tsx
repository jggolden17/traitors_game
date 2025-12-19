import { useGameStore } from '../state/gameStore'

const QuestionPhase = () => {
  const { proceedToDiscussion } = useGameStore()

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Ask quick questions</h2>
        <p className="text-sm text-muted">
          One question each. Keep it subtle so the traitor stays unsure.
        </p>
      </div>

      <div className="flex-1 rounded-2xl border border-dashed border-border bg-surface px-4 py-6 text-center text-foreground/80">
        <p>When everyone has asked, move on.</p>
      </div>

      <div className="sticky bottom-0 -mx-4 flex justify-end bg-background/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
        <button
          type="button"
          onClick={proceedToDiscussion}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px]"
        >
          Start discussion timer
        </button>
      </div>
    </div>
  )
}

export default QuestionPhase
