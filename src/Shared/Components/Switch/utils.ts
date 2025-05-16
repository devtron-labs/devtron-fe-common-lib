import { IconBaseColorType } from '@Shared/types'

import { SwitchProps } from './types'

// On intro of size there will changes in almost all methods
export const getSwitchContainerClass = ({ shape }: Required<Pick<SwitchProps, 'shape'>>): string => {
    if (shape === 'rounded') {
        return 'py-3 h-24 w-20'
    }

    return 'w-28 h-18'
}

export const getSwitchTrackColor = ({
    shape,
    variant,
    isChecked,
}: Required<Pick<SwitchProps, 'shape' | 'variant' | 'isChecked'>>): `var(--${IconBaseColorType})` => {
    if (!isChecked) {
        return 'var(--N200)'
    }

    if (shape === 'rounded') {
        if (variant === 'theme') {
            return 'var(--B500)'
        }

        return 'var(--G500)'
    }

    if (variant === 'theme') {
        return 'var(--B300)'
    }

    return 'var(--G300)'
}

export const getSwitchThumbClass = ({
    indeterminate,
    shape,
    isChecked,
}: Pick<SwitchProps, 'indeterminate' | 'shape' | 'isChecked'>) => {
    if (isChecked && indeterminate) {
        return 'w-100 h-100 flex'
    }

    return `flex p-2 ${shape === 'rounded' ? 'dc__border-radius-50-per icon-dim-10' : 'br-3'} bg__white`
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
