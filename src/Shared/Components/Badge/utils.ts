import { ComponentSizeType } from '@Shared/constants'
import { IconBaseColorType } from '@Shared/types'

import { BadgeProps } from './types'

export const getClassNameAccToVariant = (
    variant: BadgeProps['variant'],
): { styles: string; iconColor: IconBaseColorType } => {
    switch (variant) {
        case 'custom':
            return { styles: '', iconColor: 'B700' }
        case 'negative':
            return { styles: 'bcr-1 cr-7', iconColor: 'R700' }
        case 'warning':
            return { styles: 'bcy-50 cy-7', iconColor: 'Y700' }
        case 'positive':
            return { styles: 'bcg-1 cg-7', iconColor: 'G700' }
        case 'neutral':
            return { styles: 'bg__secondary cn-700', iconColor: 'N700' }
        case 'default':
        default:
            return { styles: 'bcb-1 cb-7', iconColor: 'B700' }
    }
}

export const getClassNameAccToSize = (size: BadgeProps['size']) => {
    switch (size) {
        case ComponentSizeType.xxxs:
            return 'fs-11 lh-16 px-4 py-1'
        case ComponentSizeType.xxs:
            return 'fs-12 lh-16 px-6 py-2'
        case ComponentSizeType.xs:
        default:
            return 'fs-13 lh-20 px-6 py-2'
    }
}
