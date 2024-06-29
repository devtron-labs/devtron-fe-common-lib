import { useMemo, useState } from 'react'
import ReactSelect, { MenuListProps } from 'react-select'
import { Option, OptionType } from '../../../Common'
import { commonSelectStyles, LoadingIndicator, MenuListWithApplyButton } from '../ReactSelect'
import { GenericSectionErrorState } from '../GenericSectionErrorState'
import { PluginTagSelectProps } from './types'

const PluginTagSelect = ({
    availableTags,
    handleUpdateSelectedTags,
    selectedTags,
    isLoading,
    hasError,
    reloadTags,
}: PluginTagSelectProps) => {
    const [localSelectedOptions, setLocalSelectedOptions] = useState<OptionType[]>(
        selectedTags?.map((tag) => ({ label: tag, value: tag })) ?? [],
    )

    const tagOptions: OptionType[] = useMemo(
        () => availableTags?.map((tag) => ({ label: tag, value: tag })) || [],
        [availableTags],
    )

    const handleLocalSelection = (selectedOptions: OptionType[]) => {
        setLocalSelectedOptions(selectedOptions)
    }

    const handleApplyFilters = () => {
        handleUpdateSelectedTags(localSelectedOptions.map((option) => option.label))
    }

    const handleMenuClose = () => {
        setLocalSelectedOptions(selectedTags?.map((tag) => ({ label: tag, value: tag })) ?? [])
    }

    const renderNoOptionsMessage = () => {
        if (hasError) {
            return <GenericSectionErrorState withBorder reload={reloadTags} />
        }
        return <p className="m-0 cn-7 fs-13 fw-4 lh-20 py-6 px-8">No tags found</p>
    }

    const renderMenuList = (props: MenuListProps) => (
        <MenuListWithApplyButton {...props} handleApplyFilter={handleApplyFilters} />
    )

    // TODO: Look if should close menu on apply
    return (
        <ReactSelect
            styles={commonSelectStyles}
            options={tagOptions}
            isMulti
            value={localSelectedOptions}
            components={{
                IndicatorSeparator: null,
                ClearIndicator: null,
                LoadingIndicator,
                NoOptionsMessage: renderNoOptionsMessage,
                MenuList: renderMenuList,
                Option,
            }}
            isLoading={isLoading}
            onChange={handleLocalSelection}
            escapeClearsValue={false}
            closeMenuOnSelect={false}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            blurInputOnSelect={false}
            maxMenuHeight={250}
            onMenuClose={handleMenuClose}
            inputId="plugin-tag-select"
            className="w-200"
        />
    )
}

export default PluginTagSelect
