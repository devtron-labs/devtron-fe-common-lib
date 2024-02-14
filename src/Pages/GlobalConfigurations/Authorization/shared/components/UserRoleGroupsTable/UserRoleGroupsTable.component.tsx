import { Link } from 'react-router-dom'
import { getRandomColor, URLS } from '../../../../../../Common'
import { UserRoleGroupsTableProps } from './types'

import { ReactComponent as TrashIcon } from '../../../../../../Assets/Icon/ic-delete-interactive.svg'

import './userRoleGroupsTable.scss'

const UserRoleGroupsTable = ({ roleGroups, showStatus, handleDelete }: UserRoleGroupsTableProps) => (
    <div>
        <div
            className={`user-permission__table-header ${
                showStatus ? 'user-permission__table-header--with-status' : ''
            } display-grid dc__align-items-center dc__uppercase fs-12 fw-6 cn-7 lh-20 pt-6 pb-6`}
        >
            <span />
            <span>Group Name</span>
            <span>Description</span>
            {showStatus && <span>Status</span>}
            <span />
        </div>
        <div className="fs-13 fw-4 lh-20 cn-9">
            {roleGroups.map(({ id, name, description }) => (
                <div
                    key={`user-permission-group-${id}`}
                    className={`user-permission__table-row ${
                        showStatus ? 'user-permission__table-row--with-status' : ''
                    } display-grid dc__align-items-center pt-8 pb-8`}
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
                    {/* TODO (v3): Add status */}
                    {showStatus && <div>Status</div>}
                    {/* TODO (v3): Make this configurable for AD and abstract the handleDelete function */}
                    <button
                        type="button"
                        className="dc__transparent"
                        data-testid="user-permission__delete-button"
                        onClick={() => handleDelete(id)}
                        aria-label="Delete user"
                    >
                        <TrashIcon className="scn-6 icon-dim-16 icon-delete" />
                    </button>
                </div>
            ))}
        </div>
    </div>
)

export default UserRoleGroupsTable
