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

import { ReactNode, SyntheticEvent } from 'react'

export enum ConfigHeaderTabType {
    VALUES = 'values',
    INHERITED = 'inherited',
    DRY_RUN = 'dryRun',
}

export enum ProtectConfigTabsType {
    PUBLISHED = 'published',
    COMPARE = 'compare',
    EDIT_DRAFT = 'editDraft',
}

export enum OverrideMergeStrategyType {
    PATCH = 'patch',
    REPLACE = 'replace',
}

export interface ConfigToolbarPopupMenuConfigType {
    text: string
    onClick: (event: SyntheticEvent) => void
    dataTestId: string
    disabled?: boolean
    icon?: ReactNode | null
    variant?: 'default' | 'negative'
    tooltipText?: string
}

export enum ConfigToolbarPopupNodeType {
    DISCARD_DRAFT = 'discardDraft',
    EDIT_HISTORY = 'editHistory',
}

export interface OverrideStrategyTippyContentProps {
    /**
     * Would be rendered as li conveying the information about the merge strategy
     */
    children?: ReactNode
}
