export type GameTopic = 'singers' | 'places' | 'academics' | 'any'

export type GameStage =
  | 'home'
  | 'playerEntry'
  | 'topicSelect'
  | 'topicOptions'
  | 'reveal'
  | 'questions'
  | 'discussion'
  | 'voting'
  | 'end'

export interface Player {
  id: string
  name: string
  eliminated: boolean
}

export interface GameSettings {
  topic: GameTopic
  timerMinutes: number
  newSecretEachRound: boolean
}

export interface SecretChoice {
  topic: Exclude<GameTopic, 'any'>
  value: string
}

export interface RoundState {
  roundNumber: number
  traitorId: string
  secret: SecretChoice
  playerOrder: string[]
  currentPlayerIndex: number
}

export interface GameState {
  players: Player[]
  previousPlayerLists: string[][]
  settings: GameSettings
  stage: GameStage
  round: RoundState | null
  usedSecrets: Record<Exclude<GameTopic, 'any'>, string[]>
  lastWinner: 'traitor' | 'faithful' | null
}
