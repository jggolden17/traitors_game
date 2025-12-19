import type { FormEvent } from 'react'
import { useState } from 'react'
import { topicChoices } from '../data/secrets'
import { useGameStore } from '../state/gameStore'
import StepDots from './StepDots'

const TopicAndOptions = () => {
  const { settings, startWithSettings, setStage, players } = useGameStore()
  const [timerMinutes, setTimerMinutes] = useState<number>(settings.timerMinutes)
  const [newSecretEachRound, setNewSecretEachRound] = useState<boolean>(
    settings.newSecretEachRound,
  )

  const topicLabel =
    topicChoices.find((choice) => choice.key === settings.topic)?.label ?? 'Any topic'

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (players.length < 2) {
      setStage('playerEntry')
      return
    }
    startWithSettings({
      ...settings,
      topic: settings.topic,
      timerMinutes,
      newSecretEachRound,
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <StepDots />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Game options</h2>
        <button
          type="button"
          onClick={() => setStage('topicSelect')}
          className="text-sm text-muted underline"
        >
          Back
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Topic</p>
              <p className="text-lg font-semibold">{topicLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setStage('topicSelect')}
              className="rounded-full px-3 py-2 text-sm font-semibold text-foreground/80"
            >
              Change
            </button>
          </div>
        </div>

        <label className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold">
          <span>Discussion timer</span>
          <input
            type="number"
            min={1}
            max={20}
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(Number(e.target.value))}
            className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-right text-base text-foreground focus:border-accent focus:outline-none"
          />
          <span className="text-xs text-muted">min</span>
        </label>

        <label className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold">
          <div className="flex flex-col">
            <span>New secret each round</span>
            <span className="text-xs text-muted">Avoid repeats this session</span>
          </div>
          <input
            id="newSecret"
            type="checkbox"
            checked={newSecretEachRound}
            onChange={(e) => setNewSecretEachRound(e.target.checked)}
            className="h-5 w-5 rounded border-border bg-background text-accent focus:ring-accent"
          />
        </label>

        <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 bg-background/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setStage('topicSelect')}
            className="rounded-full px-4 py-3 text-sm font-semibold text-foreground/80"
          >
            Back
          </button>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px]"
          >
            Start reveal
          </button>
        </div>
      </form>
    </div>
  )
}

export default TopicAndOptions
