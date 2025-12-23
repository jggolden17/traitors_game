import { useEffect, useState } from 'react'
import { topicChoices } from '../data/secrets'
import type { GameTopic } from '../types'
import { useGameStore } from '../state/gameStore'
import StepDots from './StepDots'

const TopicSelection = () => {
  const { settings, updateSettings, setStage, players, customSecrets } = useGameStore()
  const [topic, setTopic] = useState<GameTopic>(settings.topic)

  useEffect(() => {
    if (players.length < 2) {
      setStage('playerEntry')
    }
  }, [players, setStage])

  const handleNext = () => {
    updateSettings({ topic })
    if (topic === 'custom') {
      setStage('customSecrets')
    } else {
      setStage('topicOptions')
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <StepDots />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Choose a topic</h2>
        <button
          type="button"
          onClick={() => setStage('playerEntry')}
          className="text-sm text-muted underline"
        >
          Back
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {topicChoices.map((choice) => {
          const isCustom = choice.key === 'custom'
          const customHelper = isCustom
            ? customSecrets.length > 0
              ? `${customSecrets.length} uploaded`
              : ''
            : null

          return (
            <label
              key={choice.key}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition ${
                topic === choice.key
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-surface text-foreground'
              }`}
            >
              <span className="text-base font-semibold">{choice.label}</span>
              <div className="flex flex-col items-end">
                {customHelper && (
                  <span className="text-xs text-muted">{customHelper}</span>
                )}
                <input
                  type="radio"
                  name="topic"
                  value={choice.key}
                  checked={topic === choice.key}
                  onChange={() => setTopic(choice.key)}
                  className="hidden"
                />
              </div>
            </label>
          )
        })}
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 bg-background/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
        <button
          type="button"
          onClick={() => setStage('playerEntry')}
          className="rounded-full px-4 py-3 text-sm font-semibold text-foreground/80"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px]"
        >
          Game options
        </button>
      </div>
    </div>
  )
}

export default TopicSelection
