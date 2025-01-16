import Select, { Props as SelectProps } from 'react-select'
import { commonSelectStyles } from '../ReactSelect'

export interface ReactSelectProps extends Omit<SelectProps, 'styles'> {
    styleOverrides?: Pick<
        SelectProps['styles'],
        'control' | 'option' | 'valueContainer' | 'dropdownIndicator' | 'menuList' | 'menu'
    >
}

const ReactSelect = ({ styleOverrides, ...props }: ReactSelectProps) => (
    <Select
        {...props}
        styles={{
            ...commonSelectStyles,
            control: (base, state) => ({
                ...commonSelectStyles.control(base, state),
                ...styleOverrides?.control?.(base, state),
            }),
            option: (base, state) => ({
                ...commonSelectStyles.option(base, state),
                ...styleOverrides?.option?.(base, state),
            }),
            valueContainer: (base, state) => ({
                ...commonSelectStyles.valueContainer(base, state),
                ...styleOverrides?.valueContainer?.(base, state),
            }),
            dropdownIndicator: (base, state) => ({
                ...commonSelectStyles.dropdownIndicator(base, state),
                ...styleOverrides?.dropdownIndicator?.(base, state),
            }),
            menuList: (base, state) => ({
                ...commonSelectStyles.menuList(base, state),
                ...styleOverrides?.menuList?.(base, state),
            }),
            menu: (base, state) => ({
                ...commonSelectStyles.menu(base, state),
                ...styleOverrides?.menu?.(base, state),
            }),
        }}
    />
)

export { ReactSelect }
export type { GroupBase, OptionsOrGroups, SelectInstance, StylesConfig, components } from 'react-select'
