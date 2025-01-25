import { ReactComponent as ICInfo } from '@Icons/ic-medium-info.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning-y5.svg'
import { ReactElement, ReactNode } from 'react'
import { ReactComponent as ICDelete } from '@Images/delete-medium.svg'
import { ConfirmationModalVariantType } from './types'
import { ButtonStyleType } from '../Button'

export const getIconFromVariant = (variant: ConfirmationModalVariantType): ReactElement => {
    switch (variant) {
        case ConfirmationModalVariantType.delete:
            return <ICDelete />
        case ConfirmationModalVariantType.warning:
            return <ICWarning />
        default:
            return <ICInfo />
    }
}

export const getConfirmationLabel = (confirmationKeyword: string): ReactNode => (
    <span className="fs-13 lh-20 dc__word-break-all">
        Type <span className="fw-6">‘{confirmationKeyword}’</span> to confirm
    </span>
)

export const getPrimaryButtonStyleFromVariant = (variant: ConfirmationModalVariantType): ButtonStyleType => {
    if (variant === ConfirmationModalVariantType.delete) {
        return ButtonStyleType.negative
    }
    return ButtonStyleType.default
}
