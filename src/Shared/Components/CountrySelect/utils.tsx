/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
