import { GenericInfoCardBorderVariant } from './types'

export const getClassNameForBorderVariant = (variant: GenericInfoCardBorderVariant) => {
    if (variant === GenericInfoCardBorderVariant.NONE) {
        return ''
    }

    return 'dc__border-n1'
}
