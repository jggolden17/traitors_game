import { useMemo } from 'react'
import { useGameStore } from '../state/gameStore'

const EndScreen = () => {
  const { lastWinner, resetGame, previousPlayerLists, setPlayers, setStage } =
    useGameStore()

  const lastList = useMemo(
    () => previousPlayerLists[0] ?? [],
    [previousPlayerLists],
  )

  const handleReuse = () => {
    if (lastList.length === 0) {
      resetGame()
      return
    }
    setPlayers(lastList)
    setStage('topicSelect')
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm uppercase tracking-wide text-muted">Game over</p>
      <h2 className="text-3xl font-bold">
        {lastWinner === 'faithful'
          ? 'Faithful win'
          : lastWinner === 'traitor'
            ? 'Traitor survives'
            : 'Round done'}
      </h2>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={resetGame}
          className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition active:translate-y-[1px]"
        >
          Home
        </button>
        <button
          type="button"
          onClick={handleReuse}
          className="w-full rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground/80 transition active:translate-y-[1px]"
        >
          Reuse last players
        </button>
      </div>
    </div>
  )
}

export default EndScreen
