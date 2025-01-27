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

import { CSSProperties } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { SelectPickerProps } from './type'

export const SELECT_PICKER_FONT_SIZE_MAP: Record<SelectPickerProps['size'], CSSProperties['fontSize']> = {
    [ComponentSizeType.small]: '12px',
    [ComponentSizeType.medium]: '13px',
    [ComponentSizeType.large]: '13px',
}

export const SELECT_PICKER_ICON_SIZE_MAP: Record<SelectPickerProps['size'], Pick<CSSProperties, 'width' | 'height'>> = {
    [ComponentSizeType.small]: { width: '12px', height: '12px' },
    [ComponentSizeType.medium]: { width: '16px', height: '16px' },
    [ComponentSizeType.large]: { width: '16px', height: '16px' },
}

export const SELECT_PICKER_CONTROL_SIZE_MAP: Record<SelectPickerProps['size'], CSSProperties['minHeight']> = {
    [ComponentSizeType.small]: 'auto',
    [ComponentSizeType.medium]: 'auto',
    [ComponentSizeType.large]: '36px',
}
