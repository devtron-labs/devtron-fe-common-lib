import { ComponentSizeType } from '@Shared/constants'

import { ChipProps } from './types'

export const getIconSize = (size: ChipProps['size']) => {
    switch (size) {
        case ComponentSizeType.xxs:
            return 14
        default:
            return 16
    }
}

export const getPadding = (size: ChipProps['size']) => {
    const baseVerticalPadding = 'py-2'

    switch (size) {
        case ComponentSizeType.xxs:
            return `px-4 ${baseVerticalPadding}`
        default:
            return `px-6 ${baseVerticalPadding}`
    }
}

export const getFontSize = (size: ChipProps['size']) => {
    switch (size) {
        case ComponentSizeType.xxs:
            return 'fs-12 lh-16'
        default:
            return 'fs-12 lh-20'
    }
}

export const getSupportedChipSizes = (size: ComponentSizeType) => {
    if (size !== ComponentSizeType.xs && size !== ComponentSizeType.xxs) {
        return ComponentSizeType.xs
    }

    return size
}
