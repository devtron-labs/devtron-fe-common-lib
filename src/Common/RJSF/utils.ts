import { TranslatableString, englishStringTranslator } from '@rjsf/utils'

/**
 * Override for the TranslatableString from RJSF
 */
export const translateString = (stringToTranslate: TranslatableString, params?: string[]): string => {
    switch (stringToTranslate) {
        case TranslatableString.NewStringDefault:
            // Use an empty string for the new additionalProperties string default value
            return ''
        default:
            return englishStringTranslator(stringToTranslate, params)
    }
}

export const getCommonSelectStyle = (styleOverrides = {}) => {
    return {
        menuList: (base) => ({
            ...base,
            paddingTop: 0,
            paddingBottom: 0,
        }),
        control: (base, state) => ({
            ...base,
            minHeight: '32px',
            boxShadow: 'none',
            backgroundColor: 'var(--N50)',
            border: state.isFocused ? '1px solid var(--B500)' : '1px solid var(--N200)',
            cursor: 'pointer',
        }),
        option: (base, state) => ({
            ...base,
            color: 'var(--N900)',
            backgroundColor: state.isFocused ? 'var(--N100)' : 'white',
            padding: '10px 12px',
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: 'var(--N400)',
            padding: '0 8px',
            transition: 'all .2s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 8px',
            fontWeight: '400',
        }),
        loadingMessage: (base) => ({
            ...base,
            color: 'var(--N600)',
        }),
        noOptionsMessage: (base) => ({
            ...base,
            color: 'var(--N600)',
        }),
        ...styleOverrides,
    }
}
