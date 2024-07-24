import { ResourceKindType } from '@Shared/types'
import { UseGetResourceKindsOptionsProps } from './types'

export const getResourcesToFetchMap = (resourcesToFetch: UseGetResourceKindsOptionsProps['resourcesToFetch']) =>
    resourcesToFetch.reduce<Record<UseGetResourceKindsOptionsProps['resourcesToFetch'][0], boolean>>(
        (acc, resource) => {
            acc[resource] = true

            return acc
        },
        {
            [ResourceKindType.devtronApplication]: false,
            [ResourceKindType.project]: false,
            [ResourceKindType.cluster]: false,
            [ResourceKindType.environment]: false,
        },
    )
