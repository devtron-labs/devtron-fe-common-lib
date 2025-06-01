import { IconBaseColorType } from '@Shared/types'

import {
    ROUNDED_SWITCH_SIZE_MAP,
    ROUNDED_SWITCH_THUMB_SIZE_MAP,
    ROUNDED_SWITCH_TRACK_COLOR_MAP,
    ROUNDED_SWITCH_TRACK_HOVER_COLOR_MAP,
    SQUARE_SWITCH_SIZE_MAP,
    SQUARE_SWITCH_TRACK_COLOR_MAP,
    SQUARE_SWITCH_TRACK_HOVER_COLOR_MAP,
    SWITCH_HEIGHT_MAP,
    SWITCH_THUMB_PADDING_MAP,
    THUMB_OUTER_PADDING_MAP,
} from './constants'
import { DTSwitchProps } from './types'

export const getSwitchContainerClass = ({ shape, size }: Required<Pick<DTSwitchProps, 'shape' | 'size'>>): string =>
    `${SWITCH_HEIGHT_MAP[size]} ${shape === 'rounded' ? ROUNDED_SWITCH_SIZE_MAP[size] : SQUARE_SWITCH_SIZE_MAP[size]}`

export const getSwitchTrackColor = ({
    shape,
    variant,
    isChecked,
    isLoading,
}: Required<Pick<DTSwitchProps, 'shape' | 'variant' | 'isChecked' | 'isLoading'>>): string => {
    if (isLoading) {
        return 'dc__transparent--unstyled'
    }

    if (!isChecked) {
        return 'bcn-2'
    }

    return shape === 'rounded' ? ROUNDED_SWITCH_TRACK_COLOR_MAP[variant] : SQUARE_SWITCH_TRACK_COLOR_MAP[variant]
}

export const getSwitchTrackHoverColor = ({
    shape,
    variant,
    isChecked,
    isLoading,
}: Required<Pick<DTSwitchProps, 'shape' | 'variant' | 'isChecked' | 'isLoading'>>):
    | (typeof ROUNDED_SWITCH_TRACK_HOVER_COLOR_MAP)[DTSwitchProps['variant']]
    | 'transparent' => {
    if (isLoading) {
        return 'transparent'
    }

    if (!isChecked) {
        return 'var(--N300)'
    }

    return shape === 'rounded'
        ? ROUNDED_SWITCH_TRACK_HOVER_COLOR_MAP[variant]
        : SQUARE_SWITCH_TRACK_HOVER_COLOR_MAP[variant]
}

export const getSwitchThumbClass = ({
    shape,
    size,
    showIndeterminateIcon,
}: Pick<DTSwitchProps, 'shape' | 'size'> & { showIndeterminateIcon: boolean }) => {
    if (showIndeterminateIcon) {
        return 'w-100 h-100 flex'
    }

    return `flex ${SWITCH_THUMB_PADDING_MAP[size]} ${shape === 'rounded' ? `dc__border-radius-50-per ${ROUNDED_SWITCH_THUMB_SIZE_MAP[size]}` : 'br-3'} bg__white`
}

export const getSwitchIconColor = ({
    iconColor,
    isChecked,
    variant,
}: Pick<DTSwitchProps, 'iconColor' | 'isChecked' | 'variant'>): IconBaseColorType => {
    if (!isChecked) {
        return 'N500'
    }

    return iconColor || (variant === 'theme' ? 'B500' : 'G500')
}

export const getThumbPosition = ({
    isLoading,
    isChecked,
}: Pick<DTSwitchProps, 'isLoading' | 'isChecked'>): 'left' | 'right' | 'center' => {
    if (isLoading) {
        return 'center'
    }

    return isChecked ? 'right' : 'left'
}

export const getThumbPadding = ({ shape, isLoading }: Pick<DTSwitchProps, 'shape' | 'isLoading'>): string => {
    if (isLoading) {
        return ''
    }

    return THUMB_OUTER_PADDING_MAP[shape]
}
