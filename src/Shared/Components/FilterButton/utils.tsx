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
})
