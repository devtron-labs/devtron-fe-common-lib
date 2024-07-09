import {
    components,
    DropdownIndicatorProps,
    ControlProps,
    OptionProps,
    MenuProps,
    ClearIndicatorProps,
} from 'react-select'
import { Progressing } from '@Common/Progressing'
import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { SelectPickerOptionType, SelectPickerProps } from './type'

export const SelectPickerDropdownIndicator = (props: DropdownIndicatorProps) => {
    const { isDisabled } = props

    return (
        <components.DropdownIndicator {...props}>
            <ICCaretDown className={`icon-dim-16 ${isDisabled ? 'scn-3' : 'scn-6'} dc__no-shrink`} />
        </components.DropdownIndicator>
    )
}

export const SelectPickerClearIndicator = (props: ClearIndicatorProps) => (
    <components.ClearIndicator {...props}>
        <ICClose className="icon-dim-16 fcn-6 dc__no-shrink" />
    </components.ClearIndicator>
)

export const SelectPickerControl = ({ icon, ...props }: ControlProps & Pick<SelectPickerProps, 'icon'>) => {
    const { children } = props

    return (
        <components.Control {...props}>
            {icon && <div className="p-2 dc__no-shrink flex left">{icon}</div>}
            {children}
        </components.Control>
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
}: MenuProps & Pick<SelectPickerProps, 'renderMenuListFooter'>) => {
    const { children } = props

    return (
        <components.Menu {...props}>
            {children}
            {renderMenuListFooter?.()}
        </components.Menu>
    )
}
