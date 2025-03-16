import { SortingOrder } from '@Common/Constants'

import { Icon, IconName } from '../Icon'
import { SortIconProps } from './types'

const getIconName = ({ sortBy, sortOrder }: Pick<SortIconProps, 'sortBy' | 'sortOrder'>): IconName => {
    if (sortBy) {
        return sortOrder === SortingOrder.DESC ? 'ic-sort-descending' : 'ic-sort-ascending'
    }

    return 'ic-sortable'
}

export const SortIcon = ({ sortBy, sortOrder, color, size }: SortIconProps) => (
    <Icon name={getIconName({ sortBy, sortOrder })} color={color} size={size} />
)
