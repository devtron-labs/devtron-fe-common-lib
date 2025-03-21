import { useMemo } from 'react'
import { SelectPicker, SelectPickerProps } from '../SelectPicker'
import { CountrySelectProps } from './types'
import { getCountryOptions } from './utils'
import { FlagImage } from '../FlagImage'

const CountrySelect = ({
    selectedCountry,
    label,
    required,
    error,
    handleChange,
    placeholder,
    name,
    variant = 'default',
    size,
}: CountrySelectProps) => {
    const countryOptions = useMemo(() => getCountryOptions(variant), [variant])

    const onChange = (option: (typeof countryOptions)[number]) => {
        handleChange(option.value.iso2)
    }

    const selectedOption: (typeof countryOptions)[number] = selectedCountry
        ? countryOptions.find((option) => option.value.iso2 === selectedCountry) || null
        : null

    const filterOption: SelectPickerProps<(typeof countryOptions)[number]['value']>['filterOption'] = (
        option,
        searchText,
    ) => {
        const searchValue = searchText.toLowerCase()
        const searchCriterion = [option.data.value.name.toLowerCase(), `+${option.data.value.dialCode.toLowerCase()}`]

        return searchCriterion.some((criterion) => criterion.includes(searchValue))
    }

    const getOptionValue: SelectPickerProps<(typeof countryOptions)[number]['value']>['getOptionValue'] = (option) =>
        option.value.iso2

    return (
        <SelectPicker<(typeof countryOptions)[number]['value'], false>
            inputId={`select-picker__country-select--${name}`}
            value={selectedOption}
            onChange={onChange}
            error={error}
            required={required}
            label={label}
            options={countryOptions}
            placeholder={placeholder}
            size={size}
            filterOption={filterOption}
            getOptionValue={getOptionValue}
            icon={
                variant === 'selectPhoneCode' && selectedOption?.value?.iso2 ? (
                    <FlagImage country={selectedOption?.value?.iso2} />
                ) : null
            }
            controlShouldRenderValue={variant !== 'selectPhoneCode'}
        />
    )
}

export default CountrySelect
