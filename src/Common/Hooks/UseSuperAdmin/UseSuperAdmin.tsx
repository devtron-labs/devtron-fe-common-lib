import React, { useEffect, useState } from 'react'
import { getUserRole } from '../../Common.service'
import { useSuperAdminType } from './types'
import { showError } from '../../Helper'

/**
 * @description It will return isSuperAdmin and would be set to false by default, might need few optimizations like dep, etc
 * @returns {useSuperAdminType} isSuperAdmin
 */
export const useSuperAdmin = (): useSuperAdminType => {
    const [isSuperAdmin, setSuperAdmin] = useState<boolean>(false)

    useEffect(() => {
        getUserRole()
            .then((response) => {
                setSuperAdmin(response.result.superAdmin ?? false)
            })
            .catch((error) => {
                showError(error)
            })
    }, [])

    return { isSuperAdmin }
}
