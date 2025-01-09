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

import { useMemo } from 'react'
import { PluginTagSelectProps } from './types'
import { FilterSelectPicker, FilterSelectPickerProps, SelectPickerOptionType } from '../SelectPicker'

const PluginTagSelect = ({
    availableTags,
    handleUpdateSelectedTags,
    selectedTags,
    isLoading,
    tagsError,
    reloadTags,
}: PluginTagSelectProps) => {
    const appliedClusterList = useMemo(
        () => selectedTags?.map((tag) => ({ label: tag, value: tag })) ?? [],
        [selectedTags],
    )

    const tagOptions: SelectPickerOptionType[] = useMemo(
        () =>
            availableTags?.map<SelectPickerOptionType>((tag) => ({
                label: tag,
                value: tag,
                tooltipProps: {
                    content: tag,
                },
            })) || [],
        [availableTags],
    )

    const handleApplyFilters: FilterSelectPickerProps['handleApplyFilter'] = (selectedOptions) => {
        handleUpdateSelectedTags(selectedOptions.map((option) => option.value as string))
    }

    return (
        <div className="w-150">
            <FilterSelectPicker
                options={tagOptions}
                appliedFilterOptions={appliedClusterList}
                optionListError={tagsError}
                reloadOptionList={reloadTags}
                handleApplyFilter={handleApplyFilters}
                placeholder="Tags"
                isLoading={isLoading}
                inputId="plugin-tag-select"
                isDisabled={isLoading}
            />
        </div>
    )
}

export default PluginTagSelect
