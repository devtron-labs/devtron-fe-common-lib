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

import { useRef, useState } from 'react'
import { usePhoneInput } from 'react-international-phone'

import { CountryISO2Type } from '@Shared/types'

import { CountrySelect } from '../CountrySelect'
import { CustomInput } from '../CustomInput'
import { FormFieldInfo } from '../FormFieldWrapper'
import { PhoneInputProps } from './types'

const PhoneInput = ({
    error,
    onChange,
    required,
    phoneNumberInputName,
    countryCodeSelectName,
    phoneValue,
    countryCodeSelectSize,
}: PhoneInputProps) => {
    const hasValueInitialized = useRef(false)

    // TODO: There are some issues with argentina country code, need to fix it
    const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
        value: phoneValue,
        disableDialCodeAndPrefix: true,
        onChange: (data) => {
            // So initially this will format the phone or set the dial code to us if no phone is there, but since we expect user to enter phone number, we will ignore the first call
            if (!hasValueInitialized.current) {
                hasValueInitialized.current = true
                return
            }
            onChange(data.phone, data.country.iso2 !== country.iso2)
        },
    })

    const [isCountrySelectOpen, setIsCountrySelectOpen] = useState<boolean>(false)

    const handleOpenCountrySelect = () => {
        setIsCountrySelectOpen(true)
    }

    const handleCloseCountrySelect = () => {
        setIsCountrySelectOpen(false)
    }

    const handleUpdateCountry = (updatedCountry: CountryISO2Type) => {
        setCountry(updatedCountry)
    }

    return (
        <div className="flexbox-col dc__gap-6">
            <span className={`${required ? 'dc__required-field' : ''} cn-7 fs-13 fw-4 lh-20`}>Phone Number</span>

            <div className="flexbox-col dc__gap-4 dc__grid">
                <div className="flexbox dc__gap-8 w-100">
                    <div className={`flexbox ${isCountrySelectOpen ? 'dc__mxw-50-per w-100' : 'dc__mnw-100'}`}>
                        <CountrySelect
                            placeholder={null}
                            selectedCountry={country.iso2}
                            variant="selectPhoneCode"
                            handleChange={handleUpdateCountry}
                            name={countryCodeSelectName}
                            size={countryCodeSelectSize}
                            onMenuClose={handleCloseCountrySelect}
                            onMenuOpen={handleOpenCountrySelect}
                        />
                    </div>

                    <CustomInput
                        placeholder="Phone Number"
                        name={phoneNumberInputName}
                        type="tel"
                        value={inputValue}
                        onChange={handlePhoneValueChange}
                        inputRef={inputRef}
                        error={error}
                        hideFormFieldInfo
                        ariaLabel="Phone Number"
                        fullWidth
                    />
                </div>

                {error && <FormFieldInfo error={error} inputId={phoneNumberInputName} />}
            </div>
        </div>
    )
}

export default PhoneInput
