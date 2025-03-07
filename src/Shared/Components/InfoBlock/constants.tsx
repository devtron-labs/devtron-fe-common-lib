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

import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICSuccess } from '@Icons/ic-success.svg'
import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'
import { ReactComponent as ICHelp } from '@Icons/ic-help.svg'
import { ComponentSizeType } from '@Shared/constants'
import { ButtonProps } from '../Button'
import { Icon } from '../Icon'
import { InfoBlockProps } from './types'

export const VARIANT_TO_BG_MAP: Record<InfoBlockProps['variant'], string> = {
    error: 'bcr-1 er-2',
    help: 'bcv-1 ev-2',
    information: 'bcb-1 eb-2',
    success: 'bcg-1 eg-2',
    warning: 'bcy-1 ey-2',
    neutral: 'bcn-1 en-2',
}

export const VARIANT_TO_ICON_MAP: Record<InfoBlockProps['variant'], InfoBlockProps['customIcon']> = {
    error: <ICError />,
    help: <ICHelp className="fcv-5" />,
    information: <Icon name="ic-info-filled" color="B500" />,
    success: <ICSuccess />,
    warning: <ICWarningY5 />,
    neutral: <Icon name="ic-info-filled" color={null} />,
}

export const CONTAINER_SIZE_TO_CLASS_MAP: Record<InfoBlockProps['size'], string> = {
    [ComponentSizeType.large]: 'px-12',
    [ComponentSizeType.medium]: 'px-8',
}

export const SIZE_TO_ICON_CLASS_MAP: Record<InfoBlockProps['size'], string> = {
    [ComponentSizeType.large]: 'icon-dim-20',
    [ComponentSizeType.medium]: 'icon-dim-18',
}

export const CONTAINER_SIZE_TO_BUTTON_SIZE: Record<InfoBlockProps['size'], ButtonProps['size']> = {
    [ComponentSizeType.large]: ComponentSizeType.medium,
    [ComponentSizeType.medium]: ComponentSizeType.small,
}
