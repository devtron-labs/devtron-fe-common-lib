export interface CustomInputProps {
    name: string
    value: string | number
    onChange: (e: any) => void
    onFocus?: (e: any) => void
    autoComplete?: string
    label?: React.ReactNode
    labelClassName?: string
    type?: 'text' | 'number'
    disabled?: boolean
    placeholder?: string
    tabIndex?: number
    dataTestid?: string
    isRequiredField?: boolean
    autoFocus?: boolean
    rootClassName?: string
    showLink?: boolean
    link?: string
    linkText?: string
    error?: string[] | string
    helperText?: string;
    handleBlurChange?: (e) => void
    readOnly?: boolean
    noTrim?: boolean
}