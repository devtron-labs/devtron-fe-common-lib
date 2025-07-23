import { ComponentSizeType } from '@Shared/constants'

export const getIconSize = (size: ComponentSizeType) => {
    switch (size) {
        case ComponentSizeType.medium:
            return 20
        case ComponentSizeType.small:
            return 18
        default:
            return 16
    }
}

export const getVerticalPadding = (size: ComponentSizeType) => {
    switch (size) {
        case ComponentSizeType.medium:
            return 'py-6'
        case ComponentSizeType.small:
            return 'py-4'
        default:
            return 'py-1'
    }
}

export const getRemoveButtonSize = (size: ComponentSizeType) => {
    if (size !== ComponentSizeType.medium && size !== ComponentSizeType.small) {
        return ComponentSizeType.xs
    }

    return size
}

export const getFontSize = (size: ComponentSizeType) => {
    switch (size) {
        case ComponentSizeType.medium:
            return 'fs-13'
        case ComponentSizeType.small:
            return 'fs-12'
        default:
            return 'fs-11'
    }
}
