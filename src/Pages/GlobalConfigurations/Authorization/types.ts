import { SortingParams } from '../../../Common'
import { UserListSortableKeys, UserStatus } from './constants'

export type BaseFilterQueryParams<T> = {
    /**
     * Offset for the list result
     */
    offset?: number
    /**
     * Number of items required in the list
     */
    size?: number
    /**
     * Search string (if any)
     */
    searchKey?: string
    /**
     * If true, all items are returned with any search / filtering applied without pagination
     */
    showAll?: boolean
} & SortingParams<T>

export type UserListFilterParams = BaseFilterQueryParams<UserListSortableKeys> & {
    /**
     * Selected statuses (if any)
     */
    status: UserStatus[]
}

export interface UserRoleGroup {
    /**
     * Id of the permission group
     */
    id: number
    /**
     * Name of the permission group
     */
    name: string
    /**
     * Associated description for the group
     *
     * @default '-'
     */
    description?: string
    /**
     * Status of the role group
     */
    status: UserStatus
    /**
     * Timeout for the role group
     */
    timeToLive: string
}
