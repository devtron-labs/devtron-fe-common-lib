import { ComponentSizeType } from '@Shared/constants'
import { IconBaseColorType } from '@Shared/types'

import { SwitchProps } from './types'

export const SWITCH_VARIANTS: Readonly<Record<SwitchProps['variant'], null>> = {
    theme: null,
    positive: null,
}

export const SWITCH_SHAPES: Readonly<Record<SwitchProps['shape'], null>> = {
    rounded: null,
    square: null,
}

export const ROUNDED_SWITCH_SIZE_MAP: Readonly<Record<SwitchProps['size'], string>> = {
    [ComponentSizeType.medium]: 'w-32',
    [ComponentSizeType.small]: 'w-24',
}

export const SQUARE_SWITCH_SIZE_MAP: typeof ROUNDED_SWITCH_SIZE_MAP = {
    [ComponentSizeType.medium]: 'w-28',
    [ComponentSizeType.small]: 'w-24',
}

export const SWITCH_HEIGHT_MAP: Readonly<Record<SwitchProps['size'], string>> = {
    [ComponentSizeType.medium]: 'h-24',
    [ComponentSizeType.small]: 'h-20',
}

export const LOADING_COLOR_MAP: Record<SwitchProps['variant'], IconBaseColorType> = {
    theme: 'B500',
    positive: 'G500',
}

export const ROUNDED_SWITCH_TRACK_COLOR_MAP: Record<SwitchProps['variant'], `var(--${IconBaseColorType})`> = {
    theme: 'var(--B500)',
    positive: 'var(--G500)',
}

export const SQUARE_SWITCH_TRACK_COLOR_MAP: typeof ROUNDED_SWITCH_TRACK_COLOR_MAP = {
    theme: 'var(--B300)',
    positive: 'var(--G300)',
}

export const ROUNDED_SWITCH_THUMB_SIZE_MAP: Record<SwitchProps['size'], string> = {
    [ComponentSizeType.medium]: 'icon-dim-16',
    [ComponentSizeType.small]: 'icon-dim-12',
}

export const INDETERMINATE_ICON_WIDTH_MAP: Record<SwitchProps['size'], string> = {
    [ComponentSizeType.medium]: 'w-12',
    [ComponentSizeType.small]: 'w-10',
}

export const SQUARE_ICON_DIMENSION_MAP: Record<SwitchProps['size'], string> = {
    [ComponentSizeType.medium]: 'icon-dim-12',
    [ComponentSizeType.small]: 'icon-dim-8',
}
