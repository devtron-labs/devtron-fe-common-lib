import { ComponentSizeType } from '@Shared/constants'
import { SelectPickerProps } from './type'

export const SELECT_PICKER_FONT_SIZE_MAP: Record<SelectPickerProps['size'], string> = {
    [ComponentSizeType.small]: '12px',
    [ComponentSizeType.medium]: '13px',
    [ComponentSizeType.large]: '13px',
}

export const SELECT_PICKER_ICON_SIZE_MAP: Record<SelectPickerProps['size'], { width: string; height: string }> = {
    [ComponentSizeType.small]: { width: '12px', height: '12px' },
    [ComponentSizeType.medium]: { width: '16px', height: '16px' },
    [ComponentSizeType.large]: { width: '16px', height: '16px' },
}

export const SELECT_PICKER_CONTROL_SIZE_MAP: Record<SelectPickerProps['size'], string> = {
    [ComponentSizeType.small]: 'auto',
    [ComponentSizeType.medium]: 'auto',
    [ComponentSizeType.large]: '36px',
}
