/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentSizeType } from '@Shared/constants'
import { IconBaseColorType } from '@Shared/types'

import {
    INDETERMINATE_ICON_WIDTH_MAP,
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
        return `${INDETERMINATE_ICON_WIDTH_MAP[size]} h-2 br-4 dc__no-shrink bg__white`
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
    isChecked,
    size,
    shape,
    indeterminate,
    isLoading,
}: Required<Pick<DTSwitchProps, 'isChecked' | 'size' | 'shape' | 'indeterminate' | 'isLoading'>>): number => {
    if (isLoading) {
        return size === ComponentSizeType.medium && shape === 'rounded' ? 6 : 4
    }

    if (!isChecked) {
        return 0
    }

    if (indeterminate) {
        // This only has rounded shape
        return size === ComponentSizeType.medium ? 8 : 5
    }

    return size === ComponentSizeType.medium && shape === 'rounded' ? 12 : 8
}

export const getThumbPadding = ({ shape, isLoading }: Pick<DTSwitchProps, 'shape' | 'isLoading'>): string => {
    if (isLoading) {
        return ''
    }

    return THUMB_OUTER_PADDING_MAP[shape]
}
