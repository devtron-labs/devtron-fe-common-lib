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

import { get } from '@Common/API'
import { getTeamListMin } from '@Common/Common.service'
import { ROUTES } from '@Common/Constants'
import { ResponseType, Teams } from '@Common/Types'
import { EnvironmentTypeEnum } from '@Shared/constants'
import { stringComparatorBySortOrder } from '@Shared/Helpers'
import { ClusterType } from '@Shared/Services'
import { EnvListMinDTO } from '@Shared/types'

import { AppsGroupedByProjectsType, ClusterDTO, EnvironmentsGroupedByClustersType } from './types'

export const getAppOptionsGroupedByProjects = async (): Promise<AppsGroupedByProjectsType> => {
    const { result } = (await get(ROUTES.APP_LIST_MIN)) as ResponseType<AppsGroupedByProjectsType>

    if (!result) {
        return []
    }

    return result
        .map((project) => ({
            ...project,
            appList: project.appList.sort((a, b) => stringComparatorBySortOrder(a.name, b.name)),
        }))
        .sort((a, b) => stringComparatorBySortOrder(a.projectName, b.projectName))
}

export const getProjectOptions = async (): Promise<Pick<Teams, 'id' | 'name'>[]> => {
    const { result } = await getTeamListMin()

    if (!result) {
        return []
    }

    return result
        .map(({ id, name }) => ({
            id,
            name,
        }))
        .sort((a, b) => stringComparatorBySortOrder(a.name, b.name))
}

export const getClusterOptions = async (): Promise<ClusterType[]> => {
    const { result } = (await get(ROUTES.CLUSTER_LIST_MIN)) as ResponseType<ClusterDTO[]>

    if (!result) {
        return []
    }

    return result
        .map(({ id, cluster_name: name, isVirtualCluster, isProd }) => ({
            id,
            name,
            isVirtual: isVirtualCluster ?? false,
            isProd: isProd ?? false,
        }))
        .sort((a, b) => stringComparatorBySortOrder(a.name, b.name))
}

export const getEnvironmentOptionsGroupedByClusters = async (): Promise<EnvironmentsGroupedByClustersType> => {
    const { result } = (await get(ROUTES.ENVIRONMENT_LIST_MIN)) as ResponseType<EnvListMinDTO[]>

    if (!result) {
        return []
    }

    const sortedEnvList = result
        .map(
            ({
                id,
                environment_name: name,
                isVirtualEnvironment,
                cluster_name: cluster,
                default: isDefault,
                namespace,
            }) => ({
                id,
                name,
                isVirtual: isVirtualEnvironment ?? false,
                cluster,
                environmentType: isDefault ? EnvironmentTypeEnum.production : EnvironmentTypeEnum.nonProduction,
                namespace,
            }),
        )
        .sort((a, b) => stringComparatorBySortOrder(a.name, b.name))

    const envGroupedByCluster = Object.values(
        sortedEnvList.reduce<
            Record<EnvironmentsGroupedByClustersType[number]['clusterName'], EnvironmentsGroupedByClustersType[number]>
        >((acc, env) => {
            if (!acc[env.cluster]) {
                acc[env.cluster] = {
                    clusterName: env.cluster,
                    envList: [],
                }
            }

            acc[env.cluster].envList.push(env)

            return acc
        }, {}),
    ).sort((a, b) => stringComparatorBySortOrder(a.clusterName, b.clusterName))

    return envGroupedByCluster
}
