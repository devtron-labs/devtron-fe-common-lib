import { Link } from 'react-router-dom'
import Tippy from '@tippyjs/react'
import { getRandomColor, URLS } from '../../../../../../Common'
import { UserRoleGroupsTableProps } from './types'

import { ReactComponent as TrashIcon } from '../../../../../../Assets/Icon/ic-delete-interactive.svg'

import './userRoleGroupsTable.scss'

const getModifierClassName = (showStatus, showDelete) => {
    if (showStatus && showDelete) {
        return 'user-role-groups__table-row--with-status-and-delete'
    }
    if (showStatus) {
        return 'user-role-groups__table-row--with-status'
    }
    return 'user-role-groups__table-row--with-delete'
}

const UserRoleGroupsTable = ({
    roleGroups,
    showStatus,
    handleDelete,
    statusComponent: StatusComponent,
    statusHeaderComponent: StatusHeaderComponent,
    handleStatusUpdate,
    disableStatusComponent = false,
}: UserRoleGroupsTableProps) => {
    const showDelete = !!handleDelete
    const modifierClassName = getModifierClassName(showStatus, showDelete)

    return (
        <div>
            <div
                className={`user-role-groups__table-header ${modifierClassName} display-grid dc__align-items-center dc__uppercase fs-12 fw-6 cn-7 lh-20 pt-6 pb-6`}
            >
                <span />
                <span>Group Name</span>
                <span>Description</span>
                {showStatus && <StatusHeaderComponent />}
                {showDelete && <span />}
            </div>
            <div className="fs-13 fw-4 lh-20 cn-9">
                {roleGroups.map(({ id, name, description, status, timeToLive }) => (
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
                                handleChange={(updatedStatus, updatedTimeToLive) =>
                                    handleStatusUpdate?.(id, updatedStatus, updatedTimeToLive)
                                }
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
                                    onClick={() => handleDelete(id)}
                                    aria-label="Delete user"
                                >
                                    <TrashIcon className="scn-6 icon-dim-16 icon-delete" />
                                </button>
                            </Tippy>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserRoleGroupsTable
