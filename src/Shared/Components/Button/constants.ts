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

import { ProgressingProps } from '@Common/Types'
import { COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP, ComponentSizeType } from '@Shared/constants'

import { ButtonProps } from './types'

export const BUTTON_SIZE_TO_CLASS_NAME_MAP: Record<ButtonProps['size'], string> = {
    [ComponentSizeType.xxs_small_icon]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.xxs]} px-9 dc__gap-6 mw-48`,
    [ComponentSizeType.xxxs]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.xxs]} px-9 dc__gap-6 mw-48`,
    [ComponentSizeType.xxs]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.xxs]} px-9 dc__gap-6 mw-48`,
    [ComponentSizeType.xs]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.xs]} px-9 dc__gap-6 mw-48`,
    [ComponentSizeType.small]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.small]} px-9 dc__gap-8 mw-48`,
    [ComponentSizeType.medium]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.medium]} px-11 dc__gap-8 mw-48`,
    [ComponentSizeType.large]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.large]} px-13 dc__gap-8 mw-64`,
    [ComponentSizeType.xl]: `${COMPONENT_SIZE_TYPE_TO_FONT_AND_BLOCK_PADDING_MAP[ComponentSizeType.xl]} px-15 dc__gap-12 mw-64`,
} as const

export const BUTTON_FONT_WEIGHT_TO_CLASS_NAME_MAP: Record<ButtonProps['fontWeight'], string> = {
    bold: 'fw-6',
    normal: 'fw-4',
} as const

export const ICON_BUTTON_SIZE_TO_CLASS_NAME_MAP: Record<ButtonProps['size'], string> = {
    [ComponentSizeType.xxs_small_icon]: 'p-4',
    [ComponentSizeType.xxxs]: 'p-1',
    [ComponentSizeType.xxs]: 'p-1',
    [ComponentSizeType.xs]: 'p-3',
    [ComponentSizeType.small]: 'p-5',
    [ComponentSizeType.medium]: 'p-7',
    [ComponentSizeType.large]: 'p-7',
    [ComponentSizeType.xl]: 'p-7',
} as const

export const BUTTON_SIZE_TO_ICON_SIZE_MAP: Record<ButtonProps['size'], ProgressingProps['size']> = {
    [ComponentSizeType.xxs_small_icon]: 12,
    [ComponentSizeType.xxxs]: 14,
    [ComponentSizeType.xxs]: 14,
    [ComponentSizeType.xs]: 14,
    [ComponentSizeType.small]: 16,
    [ComponentSizeType.medium]: 16,
    [ComponentSizeType.large]: 16,
    [ComponentSizeType.xl]: 20,
} as const

export const ICON_BUTTON_SIZE_TO_ICON_SIZE_MAP: Record<ButtonProps['size'], ProgressingProps['size']> = {
    [ComponentSizeType.xxs_small_icon]: 12,
    [ComponentSizeType.xxxs]: 16,
    [ComponentSizeType.xxs]: 16,
    [ComponentSizeType.xs]: 16,
    [ComponentSizeType.small]: 16,
    [ComponentSizeType.medium]: 16,
    [ComponentSizeType.large]: 20,
    [ComponentSizeType.xl]: 24,
} as const
