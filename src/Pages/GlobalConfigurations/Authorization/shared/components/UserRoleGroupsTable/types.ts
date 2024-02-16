import { UserRoleGroup } from '../../../types'

export interface UserRoleGroupsTableProps {
    roleGroups: UserRoleGroup[]
    showStatus?: boolean
    handleDelete?: (id: number) => void
}
