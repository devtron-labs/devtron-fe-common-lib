import { CountryISO2Type } from '@Shared/index'
import { SelectPickerProps } from '../SelectPicker'

export interface CountrySelectProps
    extends Pick<SelectPickerProps, 'required' | 'label' | 'error' | 'placeholder' | 'size'>,
        Required<Pick<SelectPickerProps, 'name'>> {
    selectedCountry: CountryISO2Type
    handleChange: (iso2: CountryISO2Type) => void
    variant?: 'default' | 'selectPhoneCode'
}
