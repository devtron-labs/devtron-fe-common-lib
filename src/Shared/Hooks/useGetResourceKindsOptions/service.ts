import { ResponseType, Teams } from '@Common/Types'
import { getTeamListMin } from '@Common/Common.service'
import { get } from '@Common/Api'
import { ClusterType } from '@Shared/Services'
import { EnvironmentType, EnvListMinDTO } from '@Shared/types'
import { EnvironmentTypeEnum } from '@Shared/constants'
import { ROUTES } from '@Common/Constants'
import { AppsGroupedByProjectsType, ClusterDTO } from './types'

export const getAppOptionsGroupedByProjects = async (): Promise<AppsGroupedByProjectsType> => {
    const { result } = (await get('app/min')) as ResponseType<AppsGroupedByProjectsType>

    return result ?? []
}

export const getProjectOptions = async (): Promise<Pick<Teams, 'id' | 'name'>[]> => {
    const { result } = await getTeamListMin()

    return (
        result?.map(({ id, name }) => ({
            id,
            name,
        })) ?? []
    )
}

export const getClusterOptions = async (): Promise<ClusterType[]> => {
    const { result } = (await get('cluster/autocomplete')) as ResponseType<ClusterDTO[]>

    return (
        result?.map((cluster) => ({
            id: cluster.id,
            name: cluster.cluster_name,
            isVirtual: cluster.isVirtualCluster ?? false,
        })) ?? []
    )
}

export const getEnvironmentOptions = async (): Promise<EnvironmentType[]> => {
    const { result } = (await get(ROUTES.ENVIRONMENT_LIST_MIN)) as ResponseType<EnvListMinDTO[]>

    return (
        result?.map((environment) => ({
            id: environment.id,
            name: environment.environment_name,
            isVirtual: environment.isVirtualEnvironment ?? false,
            cluster: environment.cluster_name,
            environmentType: environment.default ? EnvironmentTypeEnum.production : EnvironmentTypeEnum.nonProduction,
            namespace: environment.namespace,
        })) ?? []
    )
}
