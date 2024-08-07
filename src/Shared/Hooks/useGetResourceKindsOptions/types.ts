// ====== Service Types: Start ====== //

import { ResourceKindType } from '@Shared/types'
import { ServerErrors } from '@Common/ServerError'
import { getAppOptionsGroupedByProjects, getClusterOptions, getEnvironmentOptions, getProjectOptions } from './service'

export interface AppType {
    name: string
}

export type AppsGroupedByProjectsType = {
    projectId: number
    projectName: string
    appList: AppType[]
}[]

export interface ClusterDTO {
    id: number
    cluster_name: string
    isVirtualCluster: boolean
}

// ====== Service Types: End ====== //

export interface UseGetResourceKindsOptionsProps {
    resourcesToFetch: Extract<
        ResourceKindType,
        | ResourceKindType.devtronApplication
        | ResourceKindType.project
        | ResourceKindType.cluster
        | ResourceKindType.environment
    >[]
}

export interface UseGetResourceKindOptionsReturnType {
    isResourcesOptionsLoading: boolean
    resourcesOptionsMap: {
        [ResourceKindType.devtronApplication]: Awaited<ReturnType<typeof getAppOptionsGroupedByProjects>>
        [ResourceKindType.project]: Awaited<ReturnType<typeof getProjectOptions>>
        [ResourceKindType.cluster]: Awaited<ReturnType<typeof getClusterOptions>>
        [ResourceKindType.environment]: Awaited<ReturnType<typeof getEnvironmentOptions>>
    }
    resourcesOptionsError: ServerErrors
    refetchResourcesOptions: () => void
}
