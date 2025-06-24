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
