/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useState } from 'react'

import { getUserRole } from '../../Common.service'
import { showError } from '../../Helper'
import { UseGetUserRolesType } from './types'

/**
 * @description It will return isSuperAdmin and would be set to false by default, might need few optimizations like dep, etc
 * @returns {UseGetUserRolesType} isSuperAdmin, canManageAllAccess
 */
const useGetUserRoles = (): UseGetUserRolesType => {
    const [result, setResult] = useState<UseGetUserRolesType>({
        isSuperAdmin: false,
        canManageAllAccess: false,
        hasManagerPermissions: false,
    })

    useEffect(() => {
        getUserRole()
            .then(({ result: apiResult }) => {
                const hasManagerPermissions = apiResult.roles.some((role) => role.startsWith('role:manager'))

                setResult({
                    isSuperAdmin: apiResult.superAdmin ?? false,
                    canManageAllAccess: apiResult.canManageAllAccess ?? false,
                    hasManagerPermissions,
                })
            })
            .catch((error) => {
                showError(error)
            })
    }, [])

    return result
}

export default useGetUserRoles
