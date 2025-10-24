import { CardProps } from './types'

export const DEFAULT_BORDER_RADIUS = 8

export const DEFAULT_FLEX_GAP = 0

export const VARIANT_TO_BORDER_CLASS_MAP: Record<CardProps['variant'], string> = {
    'primary--outlined': 'border__primary',
    'secondary--outlined': 'border__secondary',
}
