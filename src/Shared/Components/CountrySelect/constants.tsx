import { defaultCountries, FlagImage, parseCountry } from 'react-international-phone'
import { SelectPickerOptionType } from '../SelectPicker'
import { CountryISO2Type } from './types'

export const COUNTRY_OPTIONS: SelectPickerOptionType<CountryISO2Type>[] = defaultCountries.map((countryData) => {
    const parsedCountry = parseCountry(countryData)

    return {
        value: parsedCountry.iso2,
        label: parsedCountry.name,
        startIcon: <FlagImage iso2={parsedCountry.iso2} protocol={window.isSecureContext ? 'https' : 'http'} />,
    }
})
