import { CountryISO2Type } from '@Shared/types'

import { SelectPickerProps } from '../SelectPicker'

export interface CountrySelectProps
    extends Pick<
            SelectPickerProps,
            'required' | 'label' | 'error' | 'placeholder' | 'size' | 'onMenuOpen' | 'onMenuClose'
        >,
        Required<Pick<SelectPickerProps, 'name'>> {
    selectedCountry: CountryISO2Type
    handleChange: (iso2: CountryISO2Type) => void
    variant?: 'default' | 'selectPhoneCode'
}
