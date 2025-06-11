import { ComponentSizeType } from '@Shared/constants'
import { IconBaseColorType } from '@Shared/types'

import { DTSwitchProps } from './types'

export const ROUNDED_SWITCH_SIZE_MAP: Readonly<Record<DTSwitchProps['size'], string>> = {
    [ComponentSizeType.medium]: 'w-32',
    [ComponentSizeType.small]: 'w-24',
}

export const SQUARE_SWITCH_SIZE_MAP: typeof ROUNDED_SWITCH_SIZE_MAP = {
    [ComponentSizeType.medium]: 'w-28',
    [ComponentSizeType.small]: 'w-24',
}

export const SWITCH_HEIGHT_MAP: Readonly<Record<DTSwitchProps['size'], string>> = {
    [ComponentSizeType.medium]: 'h-24',
    [ComponentSizeType.small]: 'h-20',
}

export const LOADING_COLOR_MAP: Record<DTSwitchProps['variant'], IconBaseColorType> = {
    theme: 'B500',
    positive: 'G500',
}

export const ROUNDED_SWITCH_TRACK_COLOR_MAP: Record<DTSwitchProps['variant'], string> = {
    theme: 'bcb-5',
    positive: 'bcg-5',
}

export const ROUNDED_SWITCH_TRACK_HOVER_COLOR_MAP: Record<DTSwitchProps['variant'], `var(--${IconBaseColorType})`> = {
    theme: 'var(--B600)',
    positive: 'var(--G600)',
}

export const SQUARE_SWITCH_TRACK_COLOR_MAP: typeof ROUNDED_SWITCH_TRACK_COLOR_MAP = {
    theme: 'bcb-3',
    positive: 'bcg-3',
}

export const SQUARE_SWITCH_TRACK_HOVER_COLOR_MAP: typeof ROUNDED_SWITCH_TRACK_HOVER_COLOR_MAP = {
    theme: 'var(--B400)',
    positive: 'var(--G400)',
}

export const ROUNDED_SWITCH_THUMB_SIZE_MAP: Record<DTSwitchProps['size'], string> = {
    [ComponentSizeType.medium]: 'icon-dim-16',
    [ComponentSizeType.small]: 'icon-dim-12',
}

export const INDETERMINATE_ICON_WIDTH_MAP: Record<DTSwitchProps['size'], string> = {
    [ComponentSizeType.medium]: 'w-12',
    [ComponentSizeType.small]: 'w-10',
}

export const SWITCH_THUMB_PADDING_MAP: Record<DTSwitchProps['size'], string> = {
    [ComponentSizeType.medium]: 'p-3',
    [ComponentSizeType.small]: 'p-1',
}

export const THUMB_OUTER_PADDING_MAP: Record<DTSwitchProps['shape'], string> = {
    rounded: 'p-2',
    square: 'p-1',
}
