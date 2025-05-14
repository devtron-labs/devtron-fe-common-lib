import { URLS } from '@Common/Constants'

import { CreateActionMenuItems, CreateActionMenuProps } from './types'

export const getCreateActionMenuOptions = (createCustomAppURL: string): CreateActionMenuProps['options'] => [
    {
        items: [
            {
                id: CreateActionMenuItems.CUSTOM_APP,
                label: 'Custom app',
                description: 'Connect a git repository to deploy a custom application',
                startIcon: { name: 'ic-add' },
                componentType: 'link',
                to: createCustomAppURL,
            },
        ],
    },
    {
        items: [
            {
                id: CreateActionMenuItems.CHART_STORE,
                label: 'From Chart store',
                description: 'Deploy apps using third party helm charts (eg. prometheus, redis etc.)',
                startIcon: { name: 'ic-helm' },
                componentType: 'link',
                to: URLS.CHARTS_DISCOVER,
            },
            {
                id: CreateActionMenuItems.JOB,
                label: 'Job',
                description: 'Jobs allow manual and automated execution of developer actions.',
                startIcon: { name: 'ic-k8s-job' },
                componentType: 'link',
                to: `${URLS.JOB}/${URLS.APP_LIST}/${URLS.CREATE_JOB}`,
            },
        ],
    },
]
