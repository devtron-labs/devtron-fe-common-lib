import { SortingOrder } from '@Common/Constants'
import { IconsProps } from '../Icon'

export interface SortIconProps extends Pick<IconsProps, 'color' | 'size' | 'tooltipProps'> {
    sortBy: string
    sortOrder: SortingOrder
}
