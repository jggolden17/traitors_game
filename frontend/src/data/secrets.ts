import type { GameTopic } from '../types'

const singers = [
  'Taylor Swift',
  'Beyoncé',
  'Ed Sheeran',
  'Adele',
  'Billie Eilish',
  'Drake',
  'Dua Lipa',
  'Harry Styles',
  'Rihanna',
  'Bruno Mars',
]

const places = [
  'Paris',
  'Tokyo',
  'New York',
  'Sydney Opera House',
  'Grand Canyon',
  'Sahara Desert',
  'Great Barrier Reef',
  'Machu Picchu',
  'Venice',
  'Iceland',
]

const academics = [
  'Quantum Physics',
  'Neuroscience',
  'Astrophysics',
  'Econometrics',
  'Anthropology',
  'Linguistics',
  'Organic Chemistry',
  'Game Theory',
  'Medieval History',
  'Machine Learning',
]

export const secretOptions: Record<Exclude<GameTopic, 'any'>, string[]> = {
  singers,
  places,
  academics,
}

export const topicChoices: { key: GameTopic; label: string }[] = [
  { key: 'singers', label: 'Singers' },
  { key: 'places', label: 'Places' },
  { key: 'academics', label: 'Academic subjects' },
  { key: 'any', label: 'Any (mix of all)' },
]
