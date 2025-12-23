import type { PropsWithChildren } from 'react'
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react'
import { builtInSecretOptions } from '../data/secrets'
import type {
  BuiltInTopic,
  GameSettings,
  GameStage,
  GameState,
  GameTopic,
  Player,
  RoundState,
  SecretChoice,
} from '../types'

type GameStoreValue = GameState & {
  setStage: (stage: GameStage) => void
  setPlayers: (names: string[]) => void
  usePreviousList: (names: string[]) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  startWithSettings: (settings: GameSettings) => void
  setCustomSecrets: (values: string[]) => void
  nextPlayerReveal: () => void
  proceedToQuestions: () => void
  proceedToDiscussion: () => void
  proceedToVoting: () => void
  resolveVote: (playerId: string) => void
  resetGame: () => void
}

const initialState: GameState = {
  players: [],
  previousPlayerLists: [],
  settings: {
    topic: 'any',
    timerMinutes: 5,
    newSecretEachRound: true,
  },
  stage: 'home',
  round: null,
  usedSecrets: {
    singers: [],
    countriesAndCities: [],
    places: [],
    academics: [],
    custom: [],
  },
  customSecrets: [],
  lastWinner: null,
}

const GameContext = createContext<GameStoreValue | null>(null)

const shuffle = (ids: string[]) => {
  const result = [...ids]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const buildSecretPool = (
  topic: GameTopic,
  customSecrets: string[],
): SecretChoice[] => {
  if (topic === 'any') {
    const builtInPool = Object.entries(builtInSecretOptions).flatMap(
      ([key, values]) =>
        values.map((value) => ({
          topic: key as BuiltInTopic,
          value,
        })),
    )
    const customPool = customSecrets.map((value) => ({
      topic: 'custom' as const,
      value,
    }))
    return [...builtInPool, ...customPool]
  }

  if (topic === 'custom') {
    return customSecrets.map((value) => ({ topic: 'custom' as const, value }))
  }

  const values = builtInSecretOptions[topic as BuiltInTopic] ?? []
  return values.map((value) => ({ topic, value }))
}

const pickSecret = (
  topic: GameTopic,
  usedSecrets: GameState['usedSecrets'],
  customSecrets: string[],
): { choice: SecretChoice; updatedUsed: GameState['usedSecrets'] } => {
  const pool = buildSecretPool(topic, customSecrets)
  if (pool.length === 0) {
    throw new Error('No secrets available for the selected topic.')
  }
  const usedSet =
    topic === 'any'
      ? new Set(Object.values(usedSecrets).flat())
      : new Set(usedSecrets[topic])

  const available = pool.filter(({ value }) => !usedSet.has(value))
  const source = available.length > 0 ? available : pool
  const choice = source[Math.floor(Math.random() * source.length)]

  const updatedUsed: GameState['usedSecrets'] = {
    ...usedSecrets,
    [choice.topic]: Array.from(
      new Set([...(usedSecrets[choice.topic] ?? []), choice.value]),
    ),
  }

  return { choice, updatedUsed }
}

const createRound = ({
  players,
  settings,
  usedSecrets,
  priorRound,
  customSecrets,
}: {
  players: Player[]
  settings: GameSettings
  usedSecrets: GameState['usedSecrets']
  priorRound: RoundState | null
  customSecrets: string[]
}): { round: RoundState; updatedUsed: GameState['usedSecrets'] } => {
  const alive = players.filter((p) => !p.eliminated)
  const traitorId =
    priorRound?.traitorId ??
    alive[Math.floor(Math.random() * alive.length)]?.id ??
    ''

  const needsNewSecret = !priorRound || settings.newSecretEachRound
  const { choice, updatedUsed } = needsNewSecret
    ? pickSecret(settings.topic, usedSecrets, customSecrets)
    : { choice: priorRound!.secret, updatedUsed: usedSecrets }

  const playerOrder = shuffle(alive.map((p) => p.id))

  const round: RoundState = {
    roundNumber: priorRound ? priorRound.roundNumber + 1 : 1,
    traitorId,
    secret: choice,
    playerOrder,
    currentPlayerIndex: 0,
  }

  return { round, updatedUsed }
}

const useGameStoreInternal = (): GameStoreValue => {
  const [state, setState] = useState<GameState>(initialState)

  const setStage = useCallback((stage: GameStage) => {
    setState((prev) => ({ ...prev, stage }))
  }, [])

  const setPlayers = useCallback((names: string[]) => {
    const trimmed = names
      .map((n) => n.trim())
      .filter(Boolean)
      .filter((n, idx, arr) => arr.indexOf(n) === idx)

    const players: Player[] = trimmed.map((name) => ({
      id: crypto.randomUUID(),
      name,
      eliminated: false,
    }))

    setState((prev) => ({
      ...prev,
      players,
      previousPlayerLists:
        trimmed.length > 0
          ? [trimmed, ...prev.previousPlayerLists].slice(0, 5)
          : prev.previousPlayerLists,
      round: null,
      lastWinner: null,
    }))
  }, [])

  const usePreviousList = useCallback((names: string[]) => {
    setPlayers(names)
  }, [setPlayers])

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }))
  }, [])

  const setCustomSecrets = useCallback((values: string[]) => {
    const normalized = Array.from(
      new Set(values.map((value) => value.trim()).filter(Boolean)),
    )

    setState((prev) => ({
      ...prev,
      customSecrets: normalized,
      usedSecrets: { ...prev.usedSecrets, custom: [] },
    }))
  }, [])

  const startWithSettings = useCallback((settings: GameSettings) => {
    setState((prev) => {
      const { round, updatedUsed } = createRound({
        players: prev.players,
        settings,
        usedSecrets: prev.usedSecrets,
        priorRound: null,
        customSecrets: prev.customSecrets,
      })

      return {
        ...prev,
        settings,
        round,
        usedSecrets: updatedUsed,
        stage: 'instructions',
        lastWinner: null,
      }
    })
  }, [])

  const nextPlayerReveal = useCallback(() => {
    setState((prev) => {
      if (!prev.round) return prev
      const nextIndex = Math.min(
        prev.round.currentPlayerIndex + 1,
        prev.round.playerOrder.length - 1,
      )

      return {
        ...prev,
        round: { ...prev.round, currentPlayerIndex: nextIndex },
      }
    })
  }, [])

  const proceedToQuestions = useCallback(() => {
    setStage('questions')
  }, [setStage])

  const proceedToDiscussion = useCallback(() => {
    setStage('discussion')
  }, [setStage])

  const proceedToVoting = useCallback(() => {
    setStage('voting')
  }, [setStage])

  const resolveVote = useCallback((playerId: string) => {
    setState((prev) => {
      if (!prev.round) return prev
      const votingPlayer = prev.players.find((p) => p.id === playerId)
      if (!votingPlayer) return prev

      const isTraitor = playerId === prev.round.traitorId

      if (isTraitor) {
        return {
          ...prev,
          lastWinner: 'faithful',
          stage: 'end',
          round: prev.round,
        }
      }

      const updatedPlayers = prev.players.map((p) =>
        p.id === playerId ? { ...p, eliminated: true } : p,
      )
      const alive = updatedPlayers.filter((p) => !p.eliminated)
      const traitorAlive = alive.some((p) => p.id === prev.round!.traitorId)

      if (!traitorAlive) {
        return {
          ...prev,
          players: updatedPlayers,
          lastWinner: 'faithful',
          stage: 'end',
          round: prev.round,
        }
      }

      if (alive.length < 3) {
        return {
          ...prev,
          players: updatedPlayers,
          lastWinner: 'traitor',
          stage: 'end',
          round: prev.round,
        }
      }

      const { round, updatedUsed } = createRound({
        players: updatedPlayers,
        settings: prev.settings,
        usedSecrets: prev.usedSecrets,
        priorRound: prev.settings.newSecretEachRound ? prev.round : prev.round,
        customSecrets: prev.customSecrets,
      })

      return {
        ...prev,
        players: updatedPlayers,
        usedSecrets: updatedUsed,
        round,
        stage: 'reveal',
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...initialState,
      previousPlayerLists: prev.previousPlayerLists,
      customSecrets: prev.customSecrets,
    }))
  }, [])

  return useMemo(
    () => ({
      ...state,
      setStage,
      setPlayers,
      usePreviousList,
      updateSettings,
      setCustomSecrets,
      startWithSettings,
      nextPlayerReveal,
      proceedToQuestions,
      proceedToDiscussion,
      proceedToVoting,
      resolveVote,
      resetGame,
    }),
    [
      state,
      setStage,
      setPlayers,
      usePreviousList,
      updateSettings,
      setCustomSecrets,
      startWithSettings,
      nextPlayerReveal,
      proceedToQuestions,
      proceedToDiscussion,
      proceedToVoting,
      resolveVote,
      resetGame,
    ],
  )
}

export const GameProvider = ({ children }: PropsWithChildren) => {
  const value = useGameStoreInternal()
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGameStore = () => {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameStore must be used inside GameProvider')
  return ctx
}
