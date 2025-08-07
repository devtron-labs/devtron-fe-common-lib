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

import { GroupBase } from 'react-select'

import { SelectPickerOptionType, SelectPickerProps } from '../SelectPicker'

export interface ContextSwitcherTypes
    extends Pick<
        SelectPickerProps,
        | 'placeholder'
        | 'onChange'
        | 'value'
        | 'isLoading'
        | 'onInputChange'
        | 'inputValue'
        | 'inputId'
        | 'formatOptionLabel'
        | 'filterOption'
        | 'optionListError'
        | 'reloadOptionList'
        | 'classNamePrefix'
    > {
    options: GroupBase<SelectPickerOptionType<string | number>>[]
    isAppDataAvailable?: boolean
}

export interface RecentlyVisitedOptions extends SelectPickerOptionType<number> {
    isDisabled?: boolean
    isRecentlyVisited?: boolean
}

export interface RecentlyVisitedGroupedOptionsType extends GroupBase<SelectPickerOptionType<number>> {
    label: string
    options: RecentlyVisitedOptions[]
}
