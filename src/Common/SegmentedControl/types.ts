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

import { OptionType } from '@Common/Types'
import { ReactNode } from 'react'

export enum SegmentedControlVariant {
    // NOTE: values are css class names
    GRAY_ON_WHITE = 'gui-yaml-switch',
    WHITE_ON_GRAY = 'gui-yaml-switch-window-bg',
}

export interface SegmentedControlProps {
    tabs: OptionType<string, ReactNode>[]
    initialTab: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    name: string
    tooltips?: string[]
    disabled?: boolean
    rootClassName?: string
    variant?: SegmentedControlVariant
}
