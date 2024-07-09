import { OptionType } from '@Common/Types'
import { ReactElement, ReactNode } from 'react'

export interface SelectPickerOptionType extends OptionType<number | string, ReactNode> {
    description?: string
    startIcon?: ReactElement
    endIcon?: ReactElement
}
