import { TippyCustomizedProps } from '@Common/Types'
import { ButtonComponentType, ButtonProps } from '@Shared/Components'

import { DOCUMENTATION } from './constants'

export interface DocLinkProps
    extends Pick<ButtonProps<ButtonComponentType.anchor>, 'onClick' | 'dataTestId' | 'size' | 'variant'>,
        Pick<TippyCustomizedProps, 'isEnterprise' | 'isExternalLink'> {
    docLinkKey: keyof typeof DOCUMENTATION
    text?: string
    showExternalIcon?: boolean
}

export interface DocumentationUrlParamsType
    extends Pick<DocLinkProps, 'docLinkKey' | 'isEnterprise' | 'isExternalLink'> {}
