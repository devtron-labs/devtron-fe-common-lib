import { createContext, useMemo } from 'react'
import { RadioGroupProps } from './Types'

export const RadioGroupContext = createContext({
    name: '',
    value: '',
    disabled: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {},
})

const RadioGroup = (props: RadioGroupProps) => {
    const { name, value, disabled, onChange, className, children } = props
    const contextValue = useMemo(() => ({ name, value, disabled, onChange }), [name, value, disabled, onChange])
    return (
        <div className={`form__radio-group ${className || ''}`}>
            <RadioGroupContext.Provider value={contextValue}>{children}</RadioGroupContext.Provider>
        </div>
    )
}

export default RadioGroup
