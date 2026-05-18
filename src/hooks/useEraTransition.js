import { useMemo } from 'react'
import { getInterpolatedEra } from '../utils/eraConfig'
import { useScrollProgress } from './useScrollProgress'

export function useEraTransition() {
  const progress = useScrollProgress()
  const era = useMemo(() => getInterpolatedEra(progress), [progress])
  return { ...era, progress }
}
