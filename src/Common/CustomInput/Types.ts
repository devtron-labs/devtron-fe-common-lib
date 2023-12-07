export interface CustomInputProps {
    name: string
    value: string | number
    autoComplete: string
    onChange: (e: any) => void
    onBlur?: (e: any) => void
    onFocus?: (e: any) => void
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
    error?: React.ReactNode
    helperText?: string;
}