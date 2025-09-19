import { BreadcrumbText } from '@Common/index'

import { ApplicationManagementIcon } from './ApplicationManagementIcon'

export const getApplicationManagementBreadcrumb = () => ({
    'application-management': {
        component: <ApplicationManagementIcon />,
        linked: true,
    },
    list: { component: <BreadcrumbText heading="Applications" isActive /> },
    d: null,
    app: null,
})
