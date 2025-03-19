import { usePhoneInput } from 'react-international-phone'
import { CountryISO2Type } from '@Shared/index'
import { PhoneInputProps } from './types'
import { CountrySelect } from '../CountrySelect'
import { CustomInput } from '../CustomInput'
import { Icon } from '../Icon'

const PhoneInput = ({
    error,
    onChange,
    required,
    phoneNumberInputName,
    countryCodeSelectName,
    phoneValue,
    countryCodeSelectSize,
}: PhoneInputProps) => {
    // TODO: There are some issues with argentina country code, need to fix it
    const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
        value: phoneValue,
        forceDialCode: true,
        onChange: (data) => {
            onChange(data.phone)
        },
    })

    const handleUpdateCountry = (updatedCountry: CountryISO2Type) => {
        setCountry(updatedCountry)
    }

    return (
        <div className="flexbox-col dc__gap-6">
            <span className={`${required ? 'dc__required-field' : ''} cn-7 fs-13 fw-4 lh-20`}>Phone Number</span>

            <div className="flexbox-col dc__gap-4">
                <div className="flexbox dc__gap-8">
                    <CountrySelect
                        placeholder=""
                        selectedCountry={country.iso2}
                        variant="selectPhoneCode"
                        handleChange={handleUpdateCountry}
                        name={countryCodeSelectName}
                        size={countryCodeSelectSize}
                    />

                    <CustomInput
                        placeholder="Phone Number"
                        name={phoneNumberInputName}
                        type="tel"
                        value={inputValue}
                        onChange={handlePhoneValueChange}
                        inputRef={inputRef}
                    />
                </div>

                {error && (
                    <div className="flexbox dc__gap-4 fs-11 lh-16 fw-4">
                        <Icon name="ic-error" size={16} color={null} />
                        <span className="dc__ellipsis-right__2nd-line cr-5">{error}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PhoneInput
