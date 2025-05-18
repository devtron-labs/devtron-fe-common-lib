import { IconBaseColorType } from '@Shared/types'

import {
    ROUNDED_SWITCH_SIZE_MAP,
    ROUNDED_SWITCH_THUMB_SIZE_MAP,
    ROUNDED_SWITCH_TRACK_COLOR_MAP,
    SQUARE_SWITCH_SIZE_MAP,
    SQUARE_SWITCH_TRACK_COLOR_MAP,
    SWITCH_HEIGHT_MAP,
} from './constants'
import { SwitchProps } from './types'

export const getSwitchContainerClass = ({ shape, size }: Required<Pick<SwitchProps, 'shape' | 'size'>>): string =>
    `${SWITCH_HEIGHT_MAP[size]} ${shape === 'rounded' ? ROUNDED_SWITCH_SIZE_MAP[size] : SQUARE_SWITCH_SIZE_MAP[size]}`

export const getSwitchTrackColor = ({
    shape,
    variant,
    isChecked,
}: Required<Pick<SwitchProps, 'shape' | 'variant' | 'isChecked'>>): `var(--${IconBaseColorType})` => {
    if (!isChecked) {
        return 'var(--N200)'
    }

    return shape === 'rounded' ? ROUNDED_SWITCH_TRACK_COLOR_MAP[variant] : SQUARE_SWITCH_TRACK_COLOR_MAP[variant]
}

export const getSwitchThumbClass = ({
    shape,
    size,
    showIndeterminateIcon,
}: Pick<SwitchProps, 'shape' | 'size'> & { showIndeterminateIcon: boolean }) => {
    if (showIndeterminateIcon) {
        return 'w-100 h-100 flex'
    }

    return `flex p-3 ${shape === 'rounded' ? `dc__border-radius-50-per ${ROUNDED_SWITCH_THUMB_SIZE_MAP[size]}` : 'br-3'} bg__white`
}

export const getSwitchIconColor = ({
    iconColor,
    isChecked,
    variant,
}: Pick<SwitchProps, 'iconColor' | 'isChecked' | 'variant'>): IconBaseColorType => {
    if (!isChecked) {
        return 'N200'
    }

    return iconColor || (variant === 'theme' ? 'B500' : 'G500')
}
