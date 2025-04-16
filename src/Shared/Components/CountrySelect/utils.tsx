import { defaultCountries, parseCountry, ParsedCountry } from 'react-international-phone'

import { Tooltip } from '@Common/Tooltip'

import { FlagImage } from '../FlagImage'
import { SelectPickerOptionType } from '../SelectPicker'
import { CountrySelectProps } from './types'

export const getCountryOptions = (variant: CountrySelectProps['variant']): SelectPickerOptionType<ParsedCountry>[] =>
    defaultCountries.map((countryData) => {
        const parsedCountry = parseCountry(countryData)

        const countryWithDialCode = `${parsedCountry.name} (+${parsedCountry.dialCode})`

        return {
            value: parsedCountry,
            label:
                variant === 'selectPhoneCode' ? (
                    <div className="flexbox dc__gap-8 dc__align-items-center">
                        <FlagImage country={parsedCountry.iso2} size={16} />
                        <Tooltip content={countryWithDialCode}>
                            <span className="fs-13 fw-4 lh-20 dc__truncate">{countryWithDialCode}</span>
                        </Tooltip>
                    </div>
                ) : (
                    parsedCountry.name
                ),
            startIcon: variant === 'default' ? <FlagImage country={parsedCountry.iso2} /> : null,
        }
    })
