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
import { ProgressingProps } from '@Common/Types'
import { ButtonProps } from './types'

export const BUTTON_SIZE_TO_CLASS_NAME_MAP: Record<ButtonProps['size'], string> = {
    [ComponentSizeType.xs]: 'px-9 py-1 fs-12 lh-20 fw-6 dc__gap-6 mw-48',
    [ComponentSizeType.small]: 'px-9 py-3 fs-12 lh-20 fw-6 dc__gap-8 mw-48',
    [ComponentSizeType.medium]: 'px-11 py-5 fs-13 lh-20 fw-6 dc__gap-8 mw-48',
    [ComponentSizeType.large]: 'px-13 py-7 fs-13 lh-20 fw-6 dc__gap-8 mw-64',
    [ComponentSizeType.xl]: 'px-15 py-9 fs-14 lh-20 fw-6 dc__gap-12 mw-64',
} as const

export const ICON_BUTTON_SIZE_TO_CLASS_NAME_MAP: Record<ButtonProps['size'], string> = {
    [ComponentSizeType.xs]: 'p-3',
    [ComponentSizeType.small]: 'p-5',
    [ComponentSizeType.medium]: 'p-7',
    [ComponentSizeType.large]: 'p-7',
    [ComponentSizeType.xl]: 'p-7',
} as const

export const BUTTON_SIZE_TO_ICON_SIZE_MAP: Record<ButtonProps['size'], ProgressingProps['size']> = {
    [ComponentSizeType.xs]: 14,
    [ComponentSizeType.small]: 16,
    [ComponentSizeType.medium]: 16,
    [ComponentSizeType.large]: 16,
    [ComponentSizeType.xl]: 20,
} as const

export const ICON_BUTTON_SIZE_TO_ICON_SIZE_MAP: Record<ButtonProps['size'], ProgressingProps['size']> = {
    [ComponentSizeType.xs]: 16,
    [ComponentSizeType.small]: 16,
    [ComponentSizeType.medium]: 16,
    [ComponentSizeType.large]: 20,
    [ComponentSizeType.xl]: 24,
} as const
