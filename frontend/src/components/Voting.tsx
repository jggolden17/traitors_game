import { useMemo, useState } from 'react'
import { useGameStore } from '../state/gameStore'
import StepDots from './StepDots'

const Voting = () => {
  const { players, round, resolveVote, setStage } = useGameStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState<{ playerId: string; isTraitor: boolean } | null>(null)

  const alivePlayers = useMemo(
    () => players.filter((p) => !p.eliminated),
    [players],
  )

  if (!round) {
    return (
      <div className="rounded-2xl bg-surface p-6 text-foreground">
        <p className="text-muted">Voting round missing. Returning home.</p>
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

  const handleReveal = () => {
    if (!selectedId) return
    const isTraitor = selectedId === round.traitorId
    setRevealed({ playerId: selectedId, isTraitor })
  }

  const proceedAfterReveal = () => {
    if (!revealed) return
    resolveVote(revealed.playerId)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <StepDots />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Vote the traitor</h2>
        <p className="text-sm text-muted">Alive: {alivePlayers.length}</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {alivePlayers.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setSelectedId(p.id)
              setRevealed(null)
            }}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              selectedId === p.id
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border bg-surface text-foreground'
            }`}
          >
            <p className="text-lg font-semibold">{p.name}</p>
            <p className="text-sm text-foreground/70">
              {selectedId === p.id ? 'Selected' : 'Tap to choose'}
            </p>
          </button>
        ))}
      </div>

      {revealed && (
        <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-center text-lg font-semibold text-foreground">
          {players.find((p) => p.id === revealed.playerId)?.name} is a{' '}
          {revealed.isTraitor ? 'Traitor' : 'Faithful'}
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 flex items-center justify-between bg-background/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
        <button
          type="button"
          disabled={!selectedId}
          onClick={handleReveal}
          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px] disabled:opacity-40"
        >
          Reveal status
        </button>
        <button
          type="button"
          disabled={!revealed}
          onClick={proceedAfterReveal}
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground/80 transition active:translate-y-[1px] disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default Voting
