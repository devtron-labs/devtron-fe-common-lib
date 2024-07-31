import { CommonGroupedDropdownStyles } from '../ReactSelect'

export const getFilterStyle = (menuAlignFromRight: boolean) => ({
    ...CommonGroupedDropdownStyles,
    menu: (base) => ({
        ...base,
        width: '200px',
        ...(menuAlignFromRight && { right: 0 }),
    }),
    control: (base, state) => ({
        ...CommonGroupedDropdownStyles.control(base, state),
        width: 'max-content',
        maxWidth: '200px',
        minWidth: '150px',
    }),
})
