import { useCallback, useMemo, useState } from 'react'
import ReactSelect, { MenuListProps } from 'react-select'
import { Option, OptionType } from '../../../Common'
import { LoadingIndicator, MenuListWithApplyButton } from '../ReactSelect'
import { GenericSectionErrorState } from '../GenericSectionErrorState'
import { PluginTagSelectProps } from './types'
import { PluginTagSelectValueContainer, pluginTagSelectStyles } from './utils'

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

    const handleMenuClose = () => {
        setLocalSelectedOptions(selectedTags?.map((tag) => ({ label: tag, value: tag })) ?? [])
    }

    const renderNoOptionsMessage = () => {
        if (hasError) {
            return <GenericSectionErrorState reload={reloadTags} />
        }
        return <p className="m-0 cn-7 fs-13 fw-4 lh-20 py-6 px-8">No tags found</p>
    }

    // TODO: Should i add handleUpdateSelectedTags as dependency?
    const renderMenuList = useCallback((props: MenuListProps) => {
        const selectedOptions: any = props.selectProps.value

        //  TODO: Should we create function here or inside MenuListWithApplyButton?
        const handleApplyFilters = () => {
            handleUpdateSelectedTags(selectedOptions.map((option) => option.value))
        }

        return <MenuListWithApplyButton {...props} handleApplyFilter={handleApplyFilters} />
    }, [])

    return (
        <ReactSelect
            styles={pluginTagSelectStyles}
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
                ValueContainer: PluginTagSelectValueContainer,
            }}
            isLoading={isLoading}
            onChange={handleLocalSelection}
            backspaceRemovesValue={false}
            closeMenuOnSelect={false}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            blurInputOnSelect={false}
            maxMenuHeight={250}
            onMenuClose={handleMenuClose}
            placeholder="Select tags"
            inputId="plugin-tag-select"
            className="w-150"
        />
    )
}

export default PluginTagSelect
