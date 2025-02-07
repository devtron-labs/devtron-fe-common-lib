import { GenericInfoCardBorderVariant } from './types'

export const getClassNameForBorderVariant = (variant: GenericInfoCardBorderVariant) => {
    if (variant === GenericInfoCardBorderVariant.NONE) {
        return ''
    }

    return 'br-4 dc__border-n1'
}
