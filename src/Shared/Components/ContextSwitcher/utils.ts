import { SelectPickerProps } from '../SelectPicker'
import { RecentlyVisitedGroupedOptionsType, RecentlyVisitedOptions } from './types'

export const getDisabledOptions = (option: RecentlyVisitedOptions): SelectPickerProps['isDisabled'] => option.isDisabled

export const customSelect: SelectPickerProps['filterOption'] = (option, searchText: string) => {
    const label = option.data.label as string
    return option.data.value === 0 || label.toLowerCase().includes(searchText.toLowerCase())
}

export const getMinCharSearchPlaceholderGroup = (resourceKind: string): RecentlyVisitedGroupedOptionsType => ({
    label: `All ${resourceKind}`,
    options: [{ value: 0, label: 'Type 3 characters to search', isDisabled: true }],
})
