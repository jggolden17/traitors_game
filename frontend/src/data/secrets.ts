import type { BuiltInTopic, GameTopic } from '../types'

import { singers } from './singers'
import { countriesAndCities } from './countriesAndCities'
import { academics } from './academics'
import { places } from './places'

export const builtInSecretOptions: Record<BuiltInTopic, string[]> = {
  singers,
  countriesAndCities,
  academics,
  places,
}

export const topicChoices: { key: GameTopic; label: string }[] = [
  { key: 'singers', label: 'Singers' },
  { key: 'countriesAndCities', label: 'Countries and Cities' },
  { key: 'academics', label: 'Academic subjects' },
  { key: 'places', label: 'Everyday places' },
  { key: 'custom', label: 'Custom' },
  { key: 'any', label: 'Any (mix of all)' },
]
