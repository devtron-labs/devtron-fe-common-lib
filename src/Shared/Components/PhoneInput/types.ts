import { ComponentProps } from 'react'
import { CountrySelect } from '../CountrySelect'

export interface PhoneInputProps {
    phoneValue: string
    onChange: (value: string) => void
    error?: string | null
    countryCodeSelectName: string
    phoneNumberInputName: string
    required?: boolean
    countryCodeSelectSize?: ComponentProps<typeof CountrySelect>['size']
}
