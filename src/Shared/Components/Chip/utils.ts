import { ComponentSizeType } from '@Shared/constants'

import { IconsProps } from '../Icon'
import { GetIconPropsType } from './types'

const getIconSize = (size: ComponentSizeType) => {
    switch (size) {
        case ComponentSizeType.medium:
            return 20
        case ComponentSizeType.small:
            return 18
        default:
            return 16
    }
}

export const getIconProps = ({ style, startIconProps, size }: GetIconPropsType): IconsProps => {
    const iconSize = getIconSize(size)

    if (style === 'error') {
        return {
            name: 'ic-error',
            color: 'R500',
            size: iconSize,
        }
    }

    return startIconProps ? { ...startIconProps, size: iconSize } : null
}
