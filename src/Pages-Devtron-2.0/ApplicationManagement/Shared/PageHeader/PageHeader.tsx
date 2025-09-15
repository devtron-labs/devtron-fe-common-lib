import { useLocation } from 'react-router-dom'

import { BreadCrumb, useBreadcrumb } from '@Common/index'
import { PageHeader } from '@Shared/Components'

import { getApplicationManagementBreadcrumbs } from './utils'

export const ApplicationManagementPageHeader = () => {
    const { pathname } = useLocation()
    const { breadcrumbs } = useBreadcrumb(getApplicationManagementBreadcrumbs(pathname), [pathname])

    const renderBreadcrumbs = () => <BreadCrumb breadcrumbs={breadcrumbs} />

    return <PageHeader isBreadcrumbs breadCrumbs={renderBreadcrumbs} />
}
