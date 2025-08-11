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

import { SegmentedControlProps } from './types'

export const COMPONENT_SIZE_TO_SEGMENT_CLASS_MAP: Record<SegmentedControlProps['size'], string> = {
    [ComponentSizeType.xs]: 'py-2 px-6 fs-12 lh-18',
    [ComponentSizeType.small]: 'py-2 px-6 fs-12 lh-20',
    [ComponentSizeType.medium]: 'py-4 px-8 fs-13 lh-20',
} as const

export const COMPONENT_SIZE_TO_ICON_CLASS_MAP: Record<SegmentedControlProps['size'], string> = {
    [ComponentSizeType.xs]: 'py-1',
    [ComponentSizeType.small]: 'py-2',
    [ComponentSizeType.medium]: 'py-2',
} as const
