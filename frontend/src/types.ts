export type GameTopic =
  | 'singers'
  | 'countriesAndCities'
  | 'academics'
  | 'places'
  | 'custom'
  | 'any'

export type BuiltInTopic = Exclude<GameTopic, 'any' | 'custom'>

export type GameStage =
  | 'home'
  | 'playerEntry'
  | 'topicSelect'
  | 'customSecrets'
  | 'topicOptions'
  | 'instructions'
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
  customSecrets: string[]
  lastWinner: 'traitor' | 'faithful' | null
}
