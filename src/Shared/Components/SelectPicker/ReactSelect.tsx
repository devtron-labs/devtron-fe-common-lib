import Select, { Props as SelectProps } from 'react-select'
import { commonSelectStyles } from '../ReactSelect'

export interface ReactSelectProps extends Omit<SelectProps, 'styles'> {
    styleOverrides?: Pick<
        SelectProps['styles'],
        'control' | 'option' | 'valueContainer' | 'dropdownIndicator' | 'menuList' | 'menu' | 'singleValue'
    >
}

const ReactSelect = ({ styleOverrides, ...props }: ReactSelectProps) => (
    <Select
        {...props}
        styles={{
            ...commonSelectStyles,
            control: (base, state) => ({
                ...commonSelectStyles.control(base, state),
                ...styleOverrides?.control?.({}, state),
            }),
            option: (base, state) => ({
                ...commonSelectStyles.option(base, state),
                ...styleOverrides?.option?.({}, state),
            }),
            valueContainer: (base, state) => ({
                ...commonSelectStyles.valueContainer(base, state),
                ...styleOverrides?.valueContainer?.({}, state),
            }),
            dropdownIndicator: (base, state) => ({
                ...commonSelectStyles.dropdownIndicator(base, state),
                ...styleOverrides?.dropdownIndicator?.({}, state),
            }),
            menuList: (base, state) => ({
                ...commonSelectStyles.menuList(base, state),
                ...styleOverrides?.menuList?.({}, state),
            }),
            menu: (base, state) => ({
                ...commonSelectStyles.menu(base, state),
                ...styleOverrides?.menu?.({}, state),
            }),
            singleValue: (base, state) => ({
                ...commonSelectStyles.singleValue(base, state),
                ...styleOverrides?.singleValue?.({}, state),
            }),
        }}
    />
)

export { ReactSelect }
export { components } from 'react-select'
export type { GroupBase, OptionsOrGroups, SelectInstance, StylesConfig } from 'react-select'
