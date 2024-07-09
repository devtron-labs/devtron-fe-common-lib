import { components, DropdownIndicatorProps, ControlProps } from 'react-select'
import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { Progressing } from '@Common/Progressing'
import { SelectPickerProps } from './SelectPicker.component'

export const DropdownIndicator = (props: DropdownIndicatorProps) => {
    const { isDisabled } = props

    return (
        <components.DropdownIndicator {...props}>
            <ICCaretDown className={`icon-dim-16 ${isDisabled ? 'fcn-3' : 'fcn-6'} dc__no-shrink`} />
        </components.DropdownIndicator>
    )
}

export const ControlWithIcon = ({ icon, ...props }: ControlProps & Pick<SelectPickerProps, 'icon'>) => {
    const { children } = props

    return (
        <components.Control {...props}>
            {icon && <div className="p-2 dc__no-shrink flex left">{icon}</div>}
            {children}
        </components.Control>
    )
}

export const LoadingIndicator = () => <Progressing />
