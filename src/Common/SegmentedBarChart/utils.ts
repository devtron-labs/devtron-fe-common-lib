import { ComponentSizeType } from '@Shared/constants'

export const getBarHeightForSize = (size: ComponentSizeType) => {
    switch (size) {
        case ComponentSizeType.large:
            return 'h-20'
        case ComponentSizeType.medium:
            return 'h-12'
        case ComponentSizeType.xs:
            return 'h-6'
        default:
            return 'h-8'
    }
}
