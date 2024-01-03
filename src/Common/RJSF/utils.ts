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

export const getCommonSelectStyle = (styleOverrides = {}) => ({
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
    valueContainer: (base, state) => ({
        ...base,
        padding: '0 8px',
        fontWeight: '400',
        color: state.selectProps.menuIsOpen ? 'var(--N500)' : base.color,
    }),
    loadingMessage: (base) => ({
        ...base,
        color: 'var(--N600)',
    }),
    noOptionsMessage: (base) => ({
        ...base,
        color: 'var(--N600)',
    }),
    multiValue: (base, state) => ({
        ...base,
        border: `1px solid var(--N200)`,
        borderRadius: `4px`,
        background: 'white',
        height: '28px',
        marginRight: '8px',
        padding: '2px',
        fontSize: '12px',
    }),
    ...styleOverrides,
})

/**
 * Returns the redirection props for a url
 */
export const getRedirectionProps = (
    url: string,
): React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    url: string
} => {
    try {
        // The URL is validated when added using the form
        const isInternalUrl = new URL(url).origin === window.location.origin
        return {
            href: url,
            target: isInternalUrl ? '_self' : '_blank',
            rel: isInternalUrl ? undefined : 'external noreferrer',
            url,
        }
    } catch (err) {
        return {
            href: url,
            target: '_blank',
            url: `${url} (Invalid URL)`,
        }
    }
}

/**
 * Infers the type for json schema from value type
 */
export const getInferredTypeFromValueType = (value) => {
    const valueType = typeof value

    switch (valueType) {
        case 'boolean':
        case 'string':
        case 'number':
            return valueType
        case 'object':
            if (Array.isArray(value)) {
                return 'array'
            }
            if (value === null) {
                return 'null'
            }
            return valueType
        default:
            // Unsupported or undefined types
            return 'null'
    }
}
