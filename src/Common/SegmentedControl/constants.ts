import { ComponentSizeType } from '@Shared/constants'
import { SegmentedControlProps } from './types'

export const COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP: Record<SegmentedControlProps['size'], string> = {
    [ComponentSizeType.xs]: 'py-2 px-6 fs-12 lh-18',
    [ComponentSizeType.small]: 'py-2 px-6 fs-12 lh-20',
    [ComponentSizeType.medium]: 'py-4 px-8 fs-13 lh-20',
} as const

export const COMPONENT_SIZE_TO_ICON_CLASS_MAP: Record<SegmentedControlProps['size'], string> = {
    [ComponentSizeType.xs]: 'py-1',
    [ComponentSizeType.small]: 'py-2',
    [ComponentSizeType.medium]: 'py-2',
} as const
