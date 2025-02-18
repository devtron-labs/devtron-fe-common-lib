import { ComponentSizeType } from '@Shared/constants'
import { ButtonProps } from '../Button'
import { CustomInputProps } from './types'

export const CUSTOM_INPUT_TO_ICON_BUTTON_SIZE_MAP: Record<CustomInputProps['size'], ButtonProps['size']> = {
    [ComponentSizeType.medium]: ComponentSizeType.xxs,
    [ComponentSizeType.large]: ComponentSizeType.xs,
}
