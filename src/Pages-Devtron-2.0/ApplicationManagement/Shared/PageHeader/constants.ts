import { URLS } from '@Common/Constants'

import { BreadcrumbConfig } from './types'

export const APPLICATION_MANAGEMENT_BREADCRUMB_CONFIG: BreadcrumbConfig[] = [
    {
        key: 'overview',
        route: URLS.APPLICATION_MANAGEMENT_OVERVIEW,
        heading: 'Overview',
    },
]
