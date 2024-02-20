import Tippy from '@tippyjs/react'
import { components } from 'react-select'
import { Progressing, stopPropagation } from '../../../Common'

export const getCommonSelectStyle = (styleOverrides = {}) => ({
    container: (base, state) => ({
        ...base,
        ...(state.isDisabled && {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
        }),
    }),
    menuList: (base) => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
        cursor: 'pointer',
    }),
    control: (base, state) => ({
        ...base,
        minHeight: '32px',
        boxShadow: 'none',
        backgroundColor: state.isDisabled ? 'var(--N100)' : 'var(--N50)',
        border: '1px solid var(--N200)',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',

        '&:hover': {
            borderColor: 'var(--N300)',
        },
        '&:focus, &:focus-within': {
            borderColor: 'var(--B500)',
            outline: 'none',
        },
    }),
    option: (base, state) => ({
        ...base,
        color: 'var(--N900)',
        backgroundColor: state.isFocused ? 'var(--N100)' : 'white',
        padding: '10px 12px',
        cursor: 'pointer',

        ':active': {
            backgroundColor: 'var(--N100)',
        },
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
    placeholder: (base) => ({
        ...base,
        color: 'var(--N500)',
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: 400,
        margin: 0,
    }),
    ...styleOverrides,
})

const getCustomOptionBackgroundColor = (isSelected: boolean, isFocused: boolean) => {
    if (isSelected) {
        return 'var(--B100)'
    }

    if (isFocused) {
        return 'var(--N50)'
    }

    return 'var(--white)'
}

export const getCustomOptionSelectionStyle =
    (styleOverrides = {}) =>
    (base, state) => ({
        ...base,
        backgroundColor: getCustomOptionBackgroundColor(state.isSelected, state.isFocused),
        color: state.isSelected ? 'var(--B500)' : 'var(--N900)',
        textOverflow: 'ellipsis',
        fontWeight: '500',
        overflow: 'hidden',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        fontSize: '13px',
        ...styleOverrides,
    })

export const SelectOption = (props: any) => {
    const { selectProps, data, showTippy, style, placement, tippyContent, tippyClass } = props
    selectProps.styles.option = getCustomOptionSelectionStyle(style)
    const getOption = () => (
        <div onClick={stopPropagation}>
            <components.Option {...props} />
        </div>
    )

    return showTippy ? (
        <Tippy
            className={tippyClass || 'default-white'}
            arrow={false}
            placement={placement || 'right'}
            content={tippyContent || data.label}
        >
            {getOption()}
        </Tippy>
    ) : (
        getOption()
    )
}

export const LoadingIndicator = () => <Progressing />
