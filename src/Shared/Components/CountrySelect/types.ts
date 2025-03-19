import { ParsedCountry } from 'react-international-phone'
import { SelectPickerProps } from '../SelectPicker'

export type CountryISO2Type = ParsedCountry['iso2']

export interface CountrySelectProps extends Pick<SelectPickerProps, 'required' | 'label' | 'error' | 'placeholder'> {
    selectedCountry: CountryISO2Type
    handleChange: (iso2: CountryISO2Type) => void
}
