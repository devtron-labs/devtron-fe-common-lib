import { ComponentSizeType } from '@Shared/constants'

export const getBarHeightForSize = (size: ComponentSizeType) => {
    switch (size) {
        case ComponentSizeType.large:
            return 'h-20'
        default:
            return 'h-8'
    }
}
