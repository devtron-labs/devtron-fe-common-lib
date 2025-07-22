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
