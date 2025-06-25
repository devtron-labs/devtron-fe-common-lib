import { getNoMatchingResultText, SelectPicker, SelectPickerVariantType } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { ContextSwitcherTypes } from './types'
import { customSelectFilterOption, getDisabledOptions } from './utils'

export const ContextSwitcher = ({
    inputId,
    options = [],
    inputValue,
    onInputChange,
    isLoading,
    value,
    onChange,
    placeholder,
    filterOption,
    formatOptionLabel,
    optionListError,
    reloadOptionList,
    classNamePrefix,
}: ContextSwitcherTypes) => {
    const selectedOptions = options?.map((section) => ({
        ...section,
        options: section?.label === 'Recently Visited' ? section.options?.slice(1) : section.options,
    }))
    return (
        <SelectPicker
            inputId={inputId}
            options={selectedOptions || []}
            inputValue={inputValue}
            onInputChange={onInputChange}
            isLoading={isLoading}
            noOptionsMessage={getNoMatchingResultText}
            onChange={onChange}
            value={value}
            variant={SelectPickerVariantType.BORDER_LESS}
            placeholder={placeholder}
            isOptionDisabled={getDisabledOptions}
            size={ComponentSizeType.xl}
            filterOption={filterOption || customSelectFilterOption}
            formatOptionLabel={formatOptionLabel}
            optionListError={optionListError}
            reloadOptionList={reloadOptionList}
            classNamePrefix={classNamePrefix}
        />
    )
}
