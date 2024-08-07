import { useMemo } from 'react'
import { ResourceKindType } from '@Shared/types'
import { useAsync } from '@Common/Helper'
import { getAppOptionsGroupedByProjects, getClusterOptions, getEnvironmentOptions, getProjectOptions } from './service'
import { UseGetResourceKindOptionsReturnType, UseGetResourceKindsOptionsProps } from './types'
import { getResourcesToFetchMap } from './utils'

/**
 * Generic hook to fetch the options list for the supported resource kinds.
 *
 * Note: no call would be made for empty resource kind list
 *
 * @example Usage
 * ```tsx
 * const data = useGetResourceKindsOptions({
 *      resourcesToFetch: [ResourceKindType.devtronApplication, ResourceKindType.environment]
 * })
 * ```
 */
const useGetResourceKindsOptions = ({
    resourcesToFetch,
}: UseGetResourceKindsOptionsProps): UseGetResourceKindOptionsReturnType => {
    const resourcesToFetchMap = useMemo(() => getResourcesToFetchMap(resourcesToFetch), [resourcesToFetch])
    const [isResourcesOptionsLoading, resourcesOptions, resourcesOptionsError, refetchResourcesOptions] = useAsync(
        () =>
            Promise.all([
                resourcesToFetchMap[ResourceKindType.devtronApplication] ? getAppOptionsGroupedByProjects() : null,
                resourcesToFetchMap[ResourceKindType.project] ? getProjectOptions() : null,
                resourcesToFetchMap[ResourceKindType.cluster] ? getClusterOptions() : null,
                resourcesToFetchMap[ResourceKindType.environment] ? getEnvironmentOptions() : null,
            ]),
        [resourcesToFetchMap],
        resourcesToFetch.length > 0,
    )

    return {
        isResourcesOptionsLoading,
        resourcesOptionsMap: {
            [ResourceKindType.devtronApplication]: resourcesOptions?.[0] ?? [],
            [ResourceKindType.project]: resourcesOptions?.[1] ?? [],
            [ResourceKindType.cluster]: resourcesOptions?.[2] ?? [],
            [ResourceKindType.environment]: resourcesOptions?.[3] ?? [],
        },
        resourcesOptionsError,
        refetchResourcesOptions,
    }
}

export default useGetResourceKindsOptions
