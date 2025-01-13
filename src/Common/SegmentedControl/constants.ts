import { ComponentSizeType } from '@Shared/constants'
import { SegmentedControlProps } from './types'

export const SEGMENTED_CONTROL_SIZE_TO_CLASS_MAP: Record<SegmentedControlProps['size'], string> = {
    [ComponentSizeType.medium]: '',
    [ComponentSizeType.large]: 'gui-yaml-switch--lg',
}
