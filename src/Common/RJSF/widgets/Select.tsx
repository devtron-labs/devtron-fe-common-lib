import isEqual from 'lodash/isEqual'
import { WidgetProps } from '@rjsf/utils'
import ReactSelect, { MenuListProps, components } from 'react-select'
import { PLACEHOLDERS } from '../constants'
import { getCommonSelectStyle } from '../utils'

import { ReactComponent as ArrowDown } from '../../../Assets/Icon/ic-chevron-down.svg'

const commonStyles = getCommonSelectStyle()

const MenuList = ({ children, ...props }: MenuListProps) => (
    <components.MenuList {...props}>{Array.isArray(children) ? children.slice(0, 20) : children}</components.MenuList>
)

const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <ArrowDown className="icon-dim-20 icon-n5" data-testid="overview-project-edit-dropdown" />
    </components.DropdownIndicator>
)

export const Select = (props: WidgetProps) => {
    const {
        id,
        multiple = false,
        options,
        value,
        disabled,
        readonly,
        autofocus = false,
        onChange,
        onBlur,
        onFocus,
        placeholder,
    } = props
    const { enumOptions: selectOptions = [] } = options
    const emptyValue = multiple ? [] : ''

    const handleChange = (option) => {
        onChange(multiple ? option.map((o) => o.value) : option.value)
    }

    const getOption = (value) =>
        multiple
            ? selectOptions.filter((option) => value.some((val) => isEqual(val, option.value)))
            : selectOptions.find((option) => isEqual(value, option.value))

    return (
        <ReactSelect
            id={id}
            name={id}
            isMulti={multiple}
            value={typeof value === 'undefined' ? emptyValue : getOption(value)}
            autoFocus={autofocus}
            onChange={handleChange}
            options={selectOptions}
            onBlur={() => onBlur(id, value)}
            onFocus={() => onFocus(id, value)}
            placeholder={placeholder || PLACEHOLDERS.SELECT}
            isDisabled={disabled || readonly}
            styles={{
                ...commonStyles,
                control: (base) => ({
                    ...base,
                    ...commonStyles.control,
                    backgroundColor: 'var(--N50)',
                }),
            }}
            components={{
                IndicatorSeparator: null,
                DropdownIndicator,
                MenuList,
            }}
            menuPlacement="auto"
        />
    )
}
