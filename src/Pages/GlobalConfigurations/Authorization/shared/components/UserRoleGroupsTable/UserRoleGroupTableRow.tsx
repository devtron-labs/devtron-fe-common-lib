import { Link } from 'react-router-dom'
import Tippy from '@tippyjs/react'

import { getRandomColor, URLS } from '../../../../../../Common'
import { UserRoleGroupsTableProps } from './types'
import { ReactComponent as TrashIcon } from '../../../../../../Assets/Icon/ic-delete-interactive.svg'
import { UserRoleGroup } from '../../../types'

const UserRoleGroupTableRow = ({
    id,
    name,
    description,
    status,
    timeToLive,
    modifierClassName,
    disableStatusComponent,
    handleStatusUpdate,
    handleDelete,
    statusComponent: StatusComponent,
    showStatus,
    showDelete,
}: UserRoleGroup &
    Pick<
        UserRoleGroupsTableProps,
        'disableStatusComponent' | 'handleStatusUpdate' | 'handleDelete' | 'statusComponent' | 'showStatus'
    > & {
        modifierClassName: string
        showDelete: boolean
    }) => {
    const _handleStatusUpdate = (updatedStatus, updatedTimeToLive) => {
        handleStatusUpdate?.(id, updatedStatus, updatedTimeToLive)
    }

    const _handleDelete = () => {
        handleDelete(id)
    }

    return (
        <div
            key={`user-groups-group-${id}`}
            className={`user-role-groups__table-row ${modifierClassName} display-grid dc__align-items-center`}
        >
            <div
                className="icon-dim-20 mw-20 flexbox flex-justify-center flex-align-center dc__border-radius-50-per dc__uppercase cn-0"
                style={{ backgroundColor: getRandomColor(name) }}
            >
                {name[0]}
            </div>
            <Link to={`${URLS.PERMISSION_GROUPS}/${id}`} className="dc__ellipsis-right anchor cursor">
                {name}
            </Link>
            <div className="dc__ellipsis-right">{description || '-'}</div>
            {showStatus && (
                <StatusComponent
                    userStatus={status}
                    timeToLive={timeToLive}
                    userEmail=""
                    handleChange={_handleStatusUpdate}
                    disabled={disableStatusComponent}
                    showDropdownBorder={false}
                    breakLinesForTemporaryAccess
                />
            )}
            {showDelete && (
                <Tippy className="default-tt" arrow={false} placement="top" content="Delete">
                    <button
                        type="button"
                        className="dc__transparent flex p-4"
                        data-testid="user-role-groups__delete-button icon-delete"
                        onClick={_handleDelete}
                        aria-label="Delete row"
                    >
                        <TrashIcon className="scn-6 icon-dim-16 icon-delete" />
                    </button>
                </Tippy>
            )}
        </div>
    )
}

export default UserRoleGroupTableRow
