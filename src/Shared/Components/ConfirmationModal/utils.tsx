/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
