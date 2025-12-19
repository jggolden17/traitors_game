import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../state/gameStore'
import StepDots from './StepDots'

const RevealCycle = () => {
  const { round, players, nextPlayerReveal, proceedToQuestions, setStage } =
    useGameStore()

  const [isHolding, setIsHolding] = useState(false)
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    setIsHolding(false)
    setHasRevealed(false)
  }, [round?.currentPlayerIndex])

  const currentPlayer = useMemo(() => {
    if (!round) return null
    const currentId = round.playerOrder[round.currentPlayerIndex]
    return players.find((p) => p.id === currentId) ?? null
  }, [round, players])

  if (!round || !currentPlayer) {
    return (
      <div className="rounded-2xl bg-surface p-6 text-foreground">
        <p className="text-muted">Round data missing. Returning home.</p>
        <button
          type="button"
          className="mt-4 rounded-full bg-accent px-4 py-2 text-accent-foreground"
          onClick={() => setStage('home')}
        >
          Home
        </button>
      </div>
    )
  }

  const isTraitor = currentPlayer.id === round.traitorId
  const isLast = round.currentPlayerIndex === round.playerOrder.length - 1
  const remaining =
    round.playerOrder.length - (round.currentPlayerIndex + 1)

  return (
    <div className="flex flex-1 flex-col gap-4">
      <StepDots />

      <div className="flex items-center justify-between text-sm text-muted">
        <span>Round {round.roundNumber}</span>
        <span>{remaining} left</span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4">
        <p className="text-center text-lg font-semibold">
          {currentPlayer.name}, press & hold to reveal
        </p>
        <div
          className={`flex flex-1 items-center justify-center rounded-3xl border-2 border-dashed border-border bg-surface text-center text-foreground transition ${
            isHolding ? 'border-accent bg-accent text-accent-foreground' : ''
          }`}
          onMouseDown={() => {
            setIsHolding(true)
            setHasRevealed(true)
          }}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => {
            setIsHolding(true)
            setHasRevealed(true)
          }}
          onTouchEnd={() => setIsHolding(false)}
        >
          {isHolding ? (
            <div className="space-y-3 px-6">
              <p className="text-3xl font-bold">
                {isTraitor ? 'You are the Traitor' : 'You are Faithful'}
              </p>
              {!isTraitor && (
                <p className="text-lg font-medium">
                  Secret: <span className="italic">{round.secret.value}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1 text-center">
              <p className="text-xl font-semibold text-foreground/80">
                {currentPlayer.name}, hold to reveal your status
              </p>
              <p className="text-sm text-muted">
                Shield from others while you reveal
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end bg-background/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">

        {isLast ? (
          <button
            type="button"
            onClick={proceedToQuestions}
            disabled={!hasRevealed}
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px] disabled:opacity-40"
          >
            Everyone revealed
          </button>
        ) : (
          <button
            type="button"
            onClick={nextPlayerReveal}
            disabled={!hasRevealed}
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px] disabled:opacity-40"
          >
            Pass to next
          </button>
        )}
      </div>
    </div>
  )
}

export default RevealCycle
