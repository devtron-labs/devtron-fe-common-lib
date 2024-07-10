import {
    components,
    DropdownIndicatorProps,
    ControlProps,
    OptionProps,
    MenuProps,
    ClearIndicatorProps,
    ValueContainerProps,
} from 'react-select'
import { Progressing } from '@Common/Progressing'
import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { SelectPickerOptionType, SelectPickerProps } from './type'

export const SelectPickerDropdownIndicator = (props: DropdownIndicatorProps<SelectPickerOptionType>) => {
    const { isDisabled } = props

    return (
        <components.DropdownIndicator {...props}>
            <ICCaretDown className={`icon-dim-16 ${isDisabled ? 'scn-3' : 'scn-6'} dc__no-shrink`} />
        </components.DropdownIndicator>
    )
}

export const SelectPickerClearIndicator = (props: ClearIndicatorProps<SelectPickerOptionType>) => (
    <components.ClearIndicator {...props}>
        <ICClose className="icon-dim-16 fcn-6 dc__no-shrink" />
    </components.ClearIndicator>
)

export const SelectPickerControl = ({
    icon,
    showSelectedOptionIcon,
    ...props
}: ControlProps<SelectPickerOptionType> & Pick<SelectPickerProps, 'icon' | 'showSelectedOptionIcon'>) => {
    const { children, getValue } = props
    const { startIcon, endIcon } = getValue()?.[0] ?? {}
    // Show the display icon if either the selected option icon is not to be shown or not available
    const showDisplayIcon = !!(icon && (!showSelectedOptionIcon || !(startIcon || endIcon)))

    return (
        <components.Control {...props}>
            {showDisplayIcon && <div className="dc__no-shrink icon-dim-20 flex dc__fill-available-space">{icon}</div>}
            {children}
        </components.Control>
    )
}

export const SelectPickerValueContainer = ({
    showSelectedOptionIcon,
    ...props
}: ValueContainerProps<SelectPickerOptionType> & Pick<SelectPickerProps, 'showSelectedOptionIcon'>) => {
    const { children, getValue, hasValue } = props
    const { startIcon, endIcon } = getValue()?.[0] ?? {}
    const showIcon = !!(showSelectedOptionIcon && hasValue && (startIcon || endIcon))

    return (
        <components.ValueContainer {...props}>
            <div className="flex left dc__gap-8">
                {showIcon && (
                    <div className="dc__no-shrink icon-dim-20 flex dc__fill-available-space">
                        {startIcon || endIcon}
                    </div>
                )}
                {children}
            </div>
        </components.ValueContainer>
    )
}

export const SelectPickerLoadingIndicator = () => <Progressing />

export const SelectPickerOption = (props: OptionProps<SelectPickerOptionType>) => {
    const { label, data } = props
    const { description, startIcon, endIcon } = data ?? {}
    const showDescription = !!description

    return (
        <components.Option {...props}>
            <div className={`flex left ${showDescription ? 'top' : ''} dc__gap-8`}>
                {startIcon && (
                    <div className="dc__no-shrink icon-dim-16 flex dc__fill-available-space">{startIcon}</div>
                )}
                <div className="flex-grow-1">
                    <h4 className="m-0 cn-9 fs-13 fw-4 lh-20 dc__truncate">{label}</h4>
                    {/* TODO Eshank: Add support for custom ellipsis */}
                    {showDescription && <p className="m-0 fs-12 fw-4 lh-18 cn-7 dc__truncate">{description}</p>}
                </div>
                {endIcon && <div className="dc__no-shrink icon-dim-16 flex dc__fill-available-space">{endIcon}</div>}
            </div>
        </components.Option>
    )
}

export const SelectPickerMenu = ({
    renderMenuListFooter,
    ...props
}: MenuProps<SelectPickerOptionType> & Pick<SelectPickerProps, 'renderMenuListFooter'>) => {
    const { children } = props

    return (
        <components.Menu {...props}>
            {children}
            {renderMenuListFooter?.()}
        </components.Menu>
    )
}
