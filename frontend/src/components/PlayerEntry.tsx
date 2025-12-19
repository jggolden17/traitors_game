import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../state/gameStore'
import StepDots from './StepDots'

const PlayerEntry = () => {
  const { setPlayers, players, setStage, previousPlayerLists } = useGameStore()
  const [names, setNames] = useState<string[]>([])
  const [nameInput, setNameInput] = useState('')
  const [bulkInput, setBulkInput] = useState('')
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  useEffect(() => {
    if (players.length > 0) {
      setNames(players.map((p) => p.name))
    }
  }, [players])

  const parsedBulk = useMemo(
    () =>
      bulkInput
        .split(/[\n,]/)
        .map((n) => n.trim())
        .filter(Boolean),
    [bulkInput],
  )

  const addName = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    if (names.includes(trimmed)) {
      setNameInput('')
      return
    }
    setNames((prev) => [...prev, trimmed])
    setNameInput('')
  }

  const addBulk = () => {
    if (parsedBulk.length === 0) return
    setNames((prev) => {
      const merged = [...prev, ...parsedBulk]
      return Array.from(new Set(merged))
    })
    setBulkInput('')
  }

  const removeName = (name: string) => {
    setNames((prev) => prev.filter((n) => n !== name))
  }

  const handleAddClick = () => {
    addName()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (names.length < 3) return
    setPlayers(names)
    setStage('topicSelect')
  }

  const reuseList = (list: string[]) => {
    setNames(list)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <StepDots />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Add players</h2>
        <button
          type="button"
          onClick={() => setStage('home')}
          className="text-sm text-muted underline"
        >
          Home
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {!showQuickAdd && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={nameInput}
              placeholder="Type a name"
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              onChange={(e) => setNameInput(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddClick}
              className="rounded-full bg-accent px-4 py-3 text-foreground text-sm font-semibold text-accent-foreground transition active:translate-y-[1px] disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}

        <div className="rounded-xl border border-dashed border-border bg-surface/40">
          <button
            type="button"
            onClick={() => setShowQuickAdd((prev) => !prev)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground"
          >
            <span>Paste names</span>
            <span className="text-xs text-muted">{showQuickAdd ? 'Hide' : 'Show'}</span>
          </button>
          {showQuickAdd && (
            <div className="border-t border-dashed border-border px-4 pb-3">
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Alice, Bob, Charlie"
                rows={3}
                className="mt-3 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-base text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <p>Parsed: {parsedBulk.length}</p>
                <button
                  type="button"
                  onClick={addBulk}
                  className="rounded-full bg-accent px-3 py-1.5 text-[13px] font-semibold text-accent-foreground transition active:translate-y-[1px]"
                >
                  Add parsed
                </button>
              </div>
            </div>
          )}
        </div>

        {previousPlayerLists.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previousPlayerLists.map((list, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => reuseList(list)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
              >
                {list.join(', ')}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {names.map((n) => (
            <span
              key={n}
              className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm text-foreground"
            >
              {n}
              <button
                type="button"
                onClick={() => removeName(n)}
                className="text-xs text-muted"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 bg-background/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
          <p className="text-sm text-muted">
            {names.length} player{names.length === 1 ? '' : 's'}
          </p>
          <button
            type="submit"
            disabled={names.length < 3}
            className="w-40 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px] disabled:opacity-40"
          >
            Choose topic
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlayerEntry
