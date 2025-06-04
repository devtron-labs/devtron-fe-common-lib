import { ComponentSizeType } from '@Shared/constants'

import { TEXTAREA_CONSTRAINTS } from './constants'
import { TextareaProps } from './types'

export const getTextAreaConstraintsForSize = (size: TextareaProps['size']) => {
    if (size === ComponentSizeType.small) {
        return {
            MIN_HEIGHT: 56,
            AUTO_EXPANSION_MAX_HEIGHT: 150,
        }
    }

    return TEXTAREA_CONSTRAINTS
}
