import { SelectPicker } from '../SelectPicker'
import { COUNTRY_OPTIONS } from './constants'
import { CountrySelectProps } from './types'

const CountrySelect = ({ selectedCountry, label, required, error, handleChange, placeholder }: CountrySelectProps) => {
    const onChange = (option: (typeof COUNTRY_OPTIONS)[number]) => {
        handleChange(option.value)
    }

    const selectedValue: (typeof COUNTRY_OPTIONS)[number] = selectedCountry
        ? COUNTRY_OPTIONS.find((option) => option.value === selectedCountry) || {
              value: 'XX',
              label: 'Unknown',
              startIcon: null,
          }
        : null

    return (
        <SelectPicker
            inputId="select-picker__country-select"
            value={selectedValue}
            onChange={onChange}
            error={error}
            required={required}
            label={label}
            options={COUNTRY_OPTIONS}
            placeholder={placeholder}
        />
    )
}

export default CountrySelect
