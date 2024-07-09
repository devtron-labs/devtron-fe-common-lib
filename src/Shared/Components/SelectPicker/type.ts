import { OptionType } from '@Common/Types'
import { ReactNode } from 'react'

// TODO Eshank: Make this configurable
export interface SelectPickerOptionType extends OptionType<number | string, ReactNode> {
    description?: string
    startIcon?: ReactNode
    endIcon?: ReactNode
}
