import { MouseEvent } from 'react'

import { ButtonComponentType, ButtonProps } from '@Shared/Components'

import { DOCUMENTATION } from './constants'

export type BaseDocLink<T extends boolean> = {
    isExternalLink?: T
    isEnterprise?: boolean
    docLinkKey: T extends true ? string : keyof typeof DOCUMENTATION
}

export type DocLinkProps<T extends boolean = false> = Pick<
    ButtonProps<ButtonComponentType.anchor>,
    'dataTestId' | 'size' | 'variant' | 'fullWidth' | 'fontWeight' | 'startIcon'
> &
    Omit<BaseDocLink<T>, 'isEnterprise'> & {
        text?: string
        showExternalIcon?: boolean
        onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
        /**
         * If `true`, the documentation will open in a new browser tab instead of the side panel.
         * @default false
         */
        openInNewTab?: boolean
    }
