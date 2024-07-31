import { OptionType } from '@Common/Types'

export interface FilterButtonPropsType {
    placeholder: string
    appliedFilters: string[]
    options: OptionType[]
    handleApplyChange: (selectedOptions: string[]) => void
    disabled?: boolean
    getFormattedFilterLabelValue?: (identifier: string) => string
    menuAlignFromRight?: boolean
}
