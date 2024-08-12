import { CommonGroupedDropdownStyles } from '../ReactSelect'

export const getFilterStyle = (controlWidth?: string, menuAlignFromRight?: boolean) => ({
    ...CommonGroupedDropdownStyles,
    menu: (base) => ({
        ...base,
        width: '200px',
        ...(menuAlignFromRight && { right: 0 }),
    }),
    control: (base, state) => ({
        ...CommonGroupedDropdownStyles.control(base, state),
        maxHeight: '36px',
        minHeight: '36px',
        fontSize: '12px',
        paddingLeft: '8px',
        width: controlWidth || '150px',
    }),
    container: (base) => ({
        ...base,
        height: '36px',
        width: controlWidth || '150px',
        maxHeight: '36px',
    }),
    option: (base, state) => ({
        ...base,
        height: '36px',
        padding: '8px 12px',
        backgroundColor: state.isFocused ? 'var(--N100)' : 'white',
        color: 'var(--N900)',
        cursor: 'pointer',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',

        ':active': {
            backgroundColor: 'var(--N100)',
        },
    }),
})
