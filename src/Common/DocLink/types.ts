import { ButtonComponentType, ButtonProps } from '@Shared/Components'

import { DOCUMENTATION } from './constants'

export interface DocLinkProps extends Pick<ButtonProps<ButtonComponentType.anchor>, 'onClick' | 'dataTestId'> {
    docLinkKey: keyof typeof DOCUMENTATION
    text?: string
    showExternalIcon?: boolean
    hideVersion?: boolean
}

export interface DocumentationUrlParamsType extends Pick<DocLinkProps, 'docLinkKey' | 'hideVersion'> {}
