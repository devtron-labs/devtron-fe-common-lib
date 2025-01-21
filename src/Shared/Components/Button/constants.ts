import { COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP, ComponentSizeType } from '@Shared/constants'
import { ProgressingProps } from '@Common/Types'
import { ButtonProps } from './types'

export const BUTTON_SIZE_TO_CLASS_NAME_MAP: Record<ButtonProps['size'], string> = {
    [ComponentSizeType.xs]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.xs]} px-9 fw-6 dc__gap-6 mw-48`,
    [ComponentSizeType.small]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.small]} px-9 fw-6 dc__gap-8 mw-48`,
    [ComponentSizeType.medium]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.medium]} px-11 fw-6 dc__gap-8 mw-48`,
    [ComponentSizeType.large]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.large]} px-13 fw-6 dc__gap-8 mw-64`,
    [ComponentSizeType.xl]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.xl]} px-15 fw-6 dc__gap-12 mw-64`,
} as const

export const ICON_BUTTON_SIZE_TO_CLASS_NAME_MAP: Record<ButtonProps['size'], string> = {
    [ComponentSizeType.xs]: 'p-3',
    [ComponentSizeType.small]: 'p-5',
    [ComponentSizeType.medium]: 'p-7',
    [ComponentSizeType.large]: 'p-7',
    [ComponentSizeType.xl]: 'p-7',
} as const

export const ICON_BUTTON_SIZE_TO_ICON_SIZE_MAP: Record<ButtonProps['size'], ProgressingProps['size']> = {
    [ComponentSizeType.xs]: 16,
    [ComponentSizeType.small]: 16,
    [ComponentSizeType.medium]: 16,
    [ComponentSizeType.large]: 20,
    [ComponentSizeType.xl]: 24,
} as const
