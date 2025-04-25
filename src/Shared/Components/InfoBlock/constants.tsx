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

import { ComponentSizeType } from '@Shared/constants'

import { ButtonProps } from '../Button'
import { Icon } from '../Icon'
import { InfoBlockProps } from './types'

export const VARIANT_TO_ICON_MAP: Record<InfoBlockProps['variant'], InfoBlockProps['customIcon']> = {
    error: <Icon name="ic-error" color="R500" />,
    help: <Icon name="ic-help-outline" color="V500" />,
    information: <Icon name="ic-info-filled" color="B500" />,
    success: <Icon name="ic-success" color="G500" />,
    warning: <Icon name="ic-warning" color="Y500" />,
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
