import { ComponentSizeType } from '@Shared/constants'

import { IconsProps } from '../Icon'

export interface ChipProps {
    label: string
    size?: ComponentSizeType
    value?: string | number
    /**
     * @default 'neutral'
     */
    style?: 'neutral' | 'error'
    onRemove?: () => void
    startIconProps?: Pick<IconsProps, 'name' | 'color'>
}

export interface GetIconPropsType extends Pick<ChipProps, 'style' | 'startIconProps' | 'size'> {}
