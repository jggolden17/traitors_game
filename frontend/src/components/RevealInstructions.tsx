import { useGameStore } from '../state/gameStore'
import StepDots from './StepDots'

const RevealInstructions = () => {
  const { setStage } = useGameStore()

  return (
    <div className="flex flex-1 flex-col gap-6">
      <StepDots />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Game Beginning</h2>
        <p className="text-sm text-muted">
          Quick reminders before everyone starts revealing their status.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-5 text-foreground">
        <p className="text-base font-semibold">Statuses will be revealed 1-by-1.</p>
        <p className="text-sm text-foreground/80">
          When a player&apos;s name is shown, pass them the phone. In private, they should reveal their status.
          If they are faithful, the secret will also privately be revealed to them.
        </p>
        <p className="text-sm text-foreground/80">
          <strong>Players should ensure they remember the secret, as this will be the only time it is revealed to them.</strong>
        </p>        
        <p className="text-sm text-foreground/80">
          Once all players have privately revealed their status, the game will proceed to the public questions stage. 
          Every player will have the opportunity to publicly ask one other player a question.
        </p>
      </div>

      <div className="sticky bottom-0 -mx-4 flex justify-end bg-background/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
        <button
          type="button"
          onClick={() => setStage('reveal')}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px]"
        >
          Start revealing
        </button>
      </div>
    </div>
  )
}

export default RevealInstructions
