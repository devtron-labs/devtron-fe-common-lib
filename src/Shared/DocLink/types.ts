import { MouseEvent } from 'react'

import { ButtonComponentType, ButtonProps } from '@Shared/Components'

import { DOCUMENTATION } from './constants'

export type BaseDocLink<T extends boolean> = {
    isExternalLink?: T
    isEnterprise?: boolean
    docLinkKey: T extends true ? string : keyof typeof DOCUMENTATION
}

export type DocLinkProps<T extends boolean> = Pick<
    ButtonProps<ButtonComponentType.anchor>,
    'dataTestId' | 'size' | 'variant'
> &
    BaseDocLink<T> & {
        text?: string
        showExternalIcon?: boolean
        onClick?: (e: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLAnchorElement>) => void
        /**
         * If `true`, disables opening the documentation link in side panel.
         * @default false
         */
        disableSidePanelOpen?: boolean
    }
