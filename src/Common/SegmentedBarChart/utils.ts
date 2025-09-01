import { ComponentSizeType } from '@Shared/constants'

export const getBarHeightForSize = (size: ComponentSizeType) => {
    switch (size) {
        case ComponentSizeType.large:
            return 'h-20'
        case ComponentSizeType.xs:
            return 'h-6'
        case ComponentSizeType.small:
        default:
            return 'h-8'
    }
}
