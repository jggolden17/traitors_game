import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../state/gameStore'
import StepDots from './StepDots'

const parseCustomSecrets = (text: string): string[] => {
  const normalized = text.trim()
  if (!normalized) return []

  return Array.from(
    new Set(
      normalized
        .split(/[\n,]/)
        .map((value) => value.trim().replace(/^"|"$/g, ''))
        .filter(Boolean),
    ),
  )
}

const CustomSecrets = () => {
  const { settings, setStage, customSecrets, setCustomSecrets } = useGameStore()
  const [input, setInput] = useState(
    customSecrets.length > 0 ? customSecrets.join('\n') : '',
  )
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (settings.topic !== 'custom') {
      setStage('topicSelect')
    }
  }, [settings.topic, setStage])

  const readyCount = useMemo(() => customSecrets.length, [customSecrets])

  const handleChange = (value: string) => {
    setInput(value)
    const parsed = parseCustomSecrets(value)
    setCustomSecrets(parsed)
    setFormError(null)
  }

  const handleContinue = () => {
    if (customSecrets.length === 0) {
      setFormError('Enter at least one secret to continue.')
      return
    }
    setStage('topicOptions')
  }

  const handleClear = () => {
    setInput('')
    setCustomSecrets([])
    setFormError(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <StepDots />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Custom secrets</h2>
        <button
          type="button"
          onClick={() => setStage('topicSelect')}
          className="text-sm text-muted underline"
        >
          Back
        </button>
      </div>

      <div className="rounded-xl border border-border bg-surface px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">
                {readyCount > 0 ? `${readyCount} ready` : 'Enter secrets to use'}
              </p>
              {readyCount > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground/80"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={6}
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="item 1, item 2, item 3"
              className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <p className="text-xs text-muted">
              Enter a comma- or newline-separated list. Blank entries are ignored; duplicates are removed.
            </p>
            {formError && (
              <p className="mt-2 text-sm font-semibold text-red-500">{formError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 bg-background/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
        <button
          type="button"
          onClick={() => setStage('topicSelect')}
          className="rounded-full px-4 py-3 text-sm font-semibold text-foreground/80"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default CustomSecrets

