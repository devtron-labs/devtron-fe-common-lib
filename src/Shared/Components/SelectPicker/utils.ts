import { ComponentSizeType } from '@Shared/constants'
import { SelectPickerProps } from './type'

export const getCommonSelectStyle = ({ error, size }: Pick<SelectPickerProps, 'error' | 'size'>) => ({
    container: (base, state) => ({
        ...base,
        ...(state.isDisabled && {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
        }),
    }),
    menu: (base) => ({
        ...base,
        overflow: 'hidden',
        marginBlock: '4px',
        backgroundColor: 'var(--N0)',
        border: '1px solid var(--N200)',
        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.20)',
    }),
    menuList: (base) => ({
        ...base,
        padding: 0,
        paddingBlock: '4px',
        cursor: 'pointer',
    }),
    control: (base, state) => ({
        ...base,
        minHeight: size === ComponentSizeType.medium ? 'auto' : '36px',
        boxShadow: 'none',
        backgroundColor: 'var(--N50)',
        border: `1px solid ${error ? 'var(--R500)' : 'var(--N200)'}`,
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        padding: '5px 8px',
        gap: '8px',
        opacity: state.isDisabled ? 0.5 : 1,

        '&:hover': {
            borderColor: state.isDisabled ? 'var(--N200)' : 'var(--N300)',
        },
        '&:focus, &:focus-within': {
            borderColor: state.isDisabled ? 'var(--N200)' : 'var(--B500)',
            outline: 'none',
        },
    }),
    option: (base, state) => ({
        ...base,
        color: 'var(--N900)',
        // eslint-disable-next-line no-nested-ternary
        backgroundColor: state.isSelected ? 'var(--B100)' : state.isFocused ? 'var(--N50)' : 'var(--N0)',
        padding: '6px 8px',
        cursor: 'pointer',
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: 400,

        ':active': {
            backgroundColor: 'var(--N100)',
        },
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: 'var(--N600)',
        padding: '0',
        transition: 'all .2s ease',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    clearIndicator: (base) => ({
        ...base,
        padding: 0,
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0',
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
    group: (base) => ({
        ...base,
        paddingTop: '4px',
        paddingBottom: 0,
    }),
    groupHeading: (base) => ({
        ...base,
        fontWeight: 600,
        fontSize: '12px',
        color: 'var(--N900)',
        backgroundColor: 'var(--N100)',
        marginBottom: 0,
        padding: '4px 8px',
        textTransform: 'none',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
        color: 'var(--N900)',
        size: '13px',
        fontWeight: 400,
        lineHeight: '20px',
    }),
    placeholder: (base) => ({
        ...base,
        color: 'var(--N500)',
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: 400,
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    indicatorsContainer: (base) => ({
        ...base,
        gap: '4px',
        flexShrink: 0,
    }),
    singleValue: (base) => ({
        ...base,
        margin: 0,
        color: 'var(--N900)',
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: '20px',
    }),
})
