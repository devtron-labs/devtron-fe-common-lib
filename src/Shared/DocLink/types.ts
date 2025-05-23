import { ButtonComponentType, ButtonProps } from '@Shared/Components'

import { DOCUMENTATION } from './constants'

export type BaseDocLink<T extends boolean> = {
    isExternalLink?: T
    isEnterprise?: boolean
    docLinkKey: T extends true ? string : keyof typeof DOCUMENTATION
}

export type DocLinkProps<T extends boolean> = Pick<
    ButtonProps<ButtonComponentType.anchor>,
    'onClick' | 'dataTestId' | 'size' | 'variant'
> &
    BaseDocLink<T> & {
        text?: string
        showExternalIcon?: boolean
    }
