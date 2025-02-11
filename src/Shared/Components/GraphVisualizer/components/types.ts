import { ReactElement, ReactNode } from 'react'
import { Node } from '@xyflow/react'

import { SelectPickerProps } from '../../SelectPicker'

export interface BaseNodeProps {
    id: string
    className?: string
    isConnectable: boolean
    children: ReactNode
}

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
