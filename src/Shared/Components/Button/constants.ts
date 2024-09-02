import { ComponentSizeType } from '@Shared/constants'
import { ButtonProps } from './types'

export const BUTTON_SIZE_TO_CLASS_NAME_MAP: Record<ButtonProps['size'], string> = {
    [ComponentSizeType.xs]: 'px-9 py-1 fs-14 lh-20 fw-6 dc__gap-6',
    [ComponentSizeType.small]: 'px-9 py-3 fs-12 lh-20 fw-6 dc__gap-6',
    [ComponentSizeType.medium]: 'px-11 py-5 fs-13 lh-20 fw-6 dc__gap-8',
    [ComponentSizeType.large]: 'px-13 py-7 fs-13 lh-20 fw-6 dc__gap-10',
    [ComponentSizeType.xl]: 'px-15 py-9 fs-14 lh-20 fw-6 dc__gap-12',
}

export const BUTTON_SIZE_TO_ICON_CLASS_NAME_MAP: Record<ButtonProps['size'], string> = {
    [ComponentSizeType.xs]: 'icon-dim-12',
    [ComponentSizeType.small]: 'icon-dim-12',
    [ComponentSizeType.medium]: 'icon-dim-16',
    [ComponentSizeType.large]: 'icon-dim-16',
    [ComponentSizeType.xl]: 'icon-dim-20',
}
