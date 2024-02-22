import { FC } from 'react'
import { UserRoleGroup } from '../../../types'

export type UserRoleGroupsTableProps = {
    roleGroups: UserRoleGroup[]
    /**
     * Delete button is shown only if handleDelete is passed
     */
    handleDelete?: (id: number) => void
} & (
    | {
          showStatus?: false
          statusComponent?: never
          statusHeaderComponent?: never
          handleStatusUpdate?: never
          disableStatusComponent?: never
      }
    | {
          showStatus: true
          /**
           * Component for rendering the status
           */
          statusComponent: FC<Record<string, any>>
          /**
           * Component for rendering the status header
           */
          statusHeaderComponent: FC
          handleStatusUpdate?: (
              id: UserRoleGroup['id'],
              updatedStatus: UserRoleGroup['status'],
              updatedTimeToLive: UserRoleGroup['timeToLive'],
          ) => void
          disableStatusComponent?: boolean
      }
)
