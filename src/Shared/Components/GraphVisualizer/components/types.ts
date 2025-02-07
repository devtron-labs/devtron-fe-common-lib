import { ReactElement } from 'react'
import { Node } from '@xyflow/react'

import { SelectPickerProps } from '../../SelectPicker'

export type IconNodeProps = Node<
    {
        icon: ReactElement
    },
    'iconNode'
>

export type TextNodeProps = Node<
    {
        icon?: ReactElement
        text: string
    },
    'textNode'
>

export type DropdownNodeProps = Node<
    Omit<
        SelectPickerProps<string | number, false>,
        'variant' | 'fullWidth' | 'classNamePrefix' | 'menuPosition' | 'menuSize' | 'menuPortalTarget' | 'error'
    > & {
        isError?: boolean
    },
    'dropdownNode'
>
