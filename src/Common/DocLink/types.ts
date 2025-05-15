import { ButtonComponentType, ButtonProps } from '@Shared/Components'

import { DOCUMENTATION } from './constants'

export interface DocLinkProps extends Pick<ButtonProps<ButtonComponentType.anchor>, 'onClick' | 'dataTestId'> {
    doc: keyof typeof DOCUMENTATION
    text?: string
    showExternalIcon?: boolean
}
