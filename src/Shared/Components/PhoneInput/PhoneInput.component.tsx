import { usePhoneInput } from 'react-international-phone'
import { CountryISO2Type } from '@Shared/index'
import { useRef } from 'react'
import { PhoneInputProps } from './types'
import { CountrySelect } from '../CountrySelect'
import { CustomInput } from '../CustomInput'
import FormFieldInfo from '../FormFieldWrapper/FormFieldInfo'

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
        forceDialCode: true,
        onChange: (data) => {
            // So initially this will format the phone or set the dial code to us if no phone is there, but since we expect user to enter phone number, we will ignore the first call
            if (!hasValueInitialized.current) {
                hasValueInitialized.current = true
                return
            }
            onChange(data.phone)
        },
    })

    const handleUpdateCountry = (updatedCountry: CountryISO2Type) => {
        setCountry(updatedCountry)
    }

    return (
        <div className="flexbox-col dc__gap-6">
            <span className={`${required ? 'dc__required-field' : ''} cn-7 fs-13 fw-4 lh-20`}>Phone Number</span>

            <div className="flexbox-col dc__gap-4 dc__grid">
                <div className="flexbox dc__gap-8 w-100">
                    <div className="flexbox dc__mxw-50-per">
                        <CountrySelect
                            placeholder=""
                            selectedCountry={country.iso2}
                            variant="selectPhoneCode"
                            handleChange={handleUpdateCountry}
                            name={countryCodeSelectName}
                            size={countryCodeSelectSize}
                        />
                    </div>

                    <CustomInput
                        placeholder="Phone Number"
                        name={phoneNumberInputName}
                        type="tel"
                        value={inputValue}
                        onChange={handlePhoneValueChange}
                        inputRef={inputRef}
                        // Since we are showing error below but want css of errors here
                        error={error ? ' ' : null}
                        fullWidth
                    />
                </div>

                {error && <FormFieldInfo error={error} inputId={phoneNumberInputName} />}
            </div>
        </div>
    )
}

export default PhoneInput
