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

import { ChipProps } from './types'

export const getIconSize = (size: ChipProps['size']) => {
    switch (size) {
        case ComponentSizeType.xxs:
            return 14
        default:
            return 16
    }
}

export const getPadding = (size: ChipProps['size']) => {
    const baseVerticalPadding = 'py-2'

    switch (size) {
        case ComponentSizeType.xxs:
            return `px-4 ${baseVerticalPadding}`
        default:
            return `px-6 ${baseVerticalPadding}`
    }
}

export const getFontSize = (size: ChipProps['size']) => {
    switch (size) {
        case ComponentSizeType.xxs:
            return 'fs-12 lh-16'
        default:
            return 'fs-12 lh-20'
    }
}

export const getSupportedChipSizes = (size: ComponentSizeType) => {
    if (size !== ComponentSizeType.xs && size !== ComponentSizeType.xxs) {
        return ComponentSizeType.xs
    }

    return size
}
