import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../state/gameStore'

const DiscussionTimer = () => {
  const { settings, proceedToVoting } = useGameStore()
  const initialSeconds = useMemo(
    () => Math.max(30, Math.round(settings.timerMinutes * 60)),
    [settings.timerMinutes],
  )

  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setSecondsLeft(initialSeconds)
    setIsRunning(false)
    setFinished(false)
  }, [initialSeconds])

  useEffect(() => {
    if (!isRunning) return
    if (secondsLeft <= 0) {
      setIsRunning(false)
      setFinished(true)
      return
    }

    const tick = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(tick)
  }, [isRunning, secondsLeft])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  const reset = () => {
    setSecondsLeft(initialSeconds)
    setIsRunning(false)
    setFinished(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Discussion timer</h2>
        <p className="text-sm text-muted">
          {settings.timerMinutes} minute{settings.timerMinutes === 1 ? '' : 's'} for debate.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-3xl border border-border bg-surface px-6 py-8 text-center">
        <p className="text-6xl font-mono font-semibold tabular-nums text-foreground">
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </p>
        {finished && <p className="text-sm font-semibold text-accent">Time is up</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px]"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground/80"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex justify-end bg-background/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
        <button
          type="button"
          onClick={proceedToVoting}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px]"
        >
          Move to voting
        </button>
      </div>
    </div>
  )
}

export default DiscussionTimer
