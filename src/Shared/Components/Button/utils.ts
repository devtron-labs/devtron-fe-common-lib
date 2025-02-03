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

import { COMPONENT_SIZE_TYPE_TO_ICON_SIZE_MAP } from '@Shared/constants'
import {
    BUTTON_SIZE_TO_CLASS_NAME_MAP,
    ICON_BUTTON_SIZE_TO_CLASS_NAME_MAP,
    ICON_BUTTON_SIZE_TO_ICON_SIZE_MAP,
} from './constants'
import { ButtonProps } from './types'

export const getButtonIconClassName = ({ size, icon }: Pick<ButtonProps, 'size' | 'icon'>) => {
    const iconSize = icon ? ICON_BUTTON_SIZE_TO_ICON_SIZE_MAP[size] : COMPONENT_SIZE_TYPE_TO_ICON_SIZE_MAP[size]

    return `icon-dim-${iconSize}`
}

export const getButtonLoaderSize = ({ size, icon }: Pick<ButtonProps, 'size' | 'icon'>) => {
    if (icon) {
        return ICON_BUTTON_SIZE_TO_ICON_SIZE_MAP[size]
    }

    return COMPONENT_SIZE_TYPE_TO_ICON_SIZE_MAP[size]
}

export const getButtonDerivedClass = ({
    size,
    variant,
    style,
    isLoading,
    icon,
}: Pick<ButtonProps, 'variant' | 'size' | 'style' | 'isLoading' | 'icon'>) =>
    `button button__${variant}--${style} ${icon ? ICON_BUTTON_SIZE_TO_CLASS_NAME_MAP[size] : BUTTON_SIZE_TO_CLASS_NAME_MAP[size]} ${isLoading ? 'button--loading' : ''}`
