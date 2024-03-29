export enum UserListSortableKeys {
    email = 'email_id',
    lastLogin = 'last_login',
}

/**
 * User Status received from the API
 */
export enum UserStatusDto {
    active = 'active',
    inactive = 'inactive',
}

/**
 * User status for the frontend
 */
export enum UserStatus {
    active = 'active',
    inactive = 'inactive',
    temporary = 'temporaryAccess',
}
