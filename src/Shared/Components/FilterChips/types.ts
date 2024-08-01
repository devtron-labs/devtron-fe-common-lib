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

import { ReactNode } from 'react'

export interface FilterChipProps {
    /**
     * Filter label
     */
    label?: string
    /**
     * Corresponding value of the filter
     */
    value: unknown
    /**
     * Callback handler for removing the filter
     */
    handleRemoveFilter: (label: string, valueToRemove: unknown) => void
    /**
     * If passed, the label will be formatted accordingly
     */
    getFormattedLabel?: (filterKey: string) => ReactNode
    /**
     * If passed, the label will be formatted accordingly
     */
    getFormattedValue?: (filterKey: string, filterValue: unknown) => ReactNode
    /**
     * If true, would hide the label
     * @default false
     */
    shouldHideLabel?: boolean
}

export interface FilterChipsProps<T = Record<string, unknown>>
    extends Pick<FilterChipProps, 'getFormattedLabel' | 'getFormattedValue' | 'shouldHideLabel'> {
    /**
     * Current filter configuration
     */
    filterConfig: T
    /**
     * Callback handler for removing the filters
     */
    clearFilters: () => void
    /**
     * Handler for removing a applied filter
     */
    onRemoveFilter: (filterConfig: T) => void
    /**
     * Class name for the container
     */
    className?: string
    /**
     * Class name for the clear filter button
     */
    clearButtonClassName?: string
}
