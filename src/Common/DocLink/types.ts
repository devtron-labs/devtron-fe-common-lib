import { ButtonComponentType, ButtonProps } from '@Shared/Components'

export interface DocLinkProps extends Pick<ButtonProps<ButtonComponentType.anchor>, 'onClick' | 'dataTestId'> {
    docLink: string
    docLinkText?: string
    className?: string
    showEndIcon?: boolean
}
