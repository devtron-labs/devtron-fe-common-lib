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
    onMenuClose,
    onMenuOpen,
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
        const searchCriterion = [
            option.data.value.name.toLowerCase(),
            `+${option.data.value.dialCode.toLowerCase()}`,
            option.data.value.iso2.toLowerCase(),
        ]

        return searchCriterion.some((criterion) => criterion.includes(searchValue))
    }

    const getOptionValue: SelectPickerProps<(typeof countryOptions)[number]['value']>['getOptionValue'] = (option) =>
        option.value.iso2

    const formatOptionLabel: SelectPickerProps<(typeof countryOptions)[number]['value']>['formatOptionLabel'] = (
        data,
        formatOptionLabelMeta,
    ) => {
        if (formatOptionLabelMeta.context === 'menu') {
            return data.label
        }

        return `+${data.value.dialCode}`
    }

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
            onMenuClose={onMenuClose}
            onMenuOpen={onMenuOpen}
            icon={
                variant === 'selectPhoneCode' && selectedOption?.value?.iso2 ? (
                    <FlagImage country={selectedOption?.value?.iso2} size={20} />
                ) : null
            }
            formatOptionLabel={formatOptionLabel}
            fullWidth
            ariaLabel={variant === 'default' ? 'Country' : 'Phone Code'}
        />
    )
}

export default CountrySelect
