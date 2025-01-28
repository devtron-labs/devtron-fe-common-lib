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

import { Dispatch, SetStateAction } from 'react'

import { DeploymentConfigDiffProps } from '@Shared/Components/DeploymentConfigDiff'
import { EnvResourceType } from '@Shared/Services'

import { UseUrlFiltersReturnType } from '@Common/Hooks'
import { History, HistoryLogsProps } from '../types'

export interface DeploymentHistoryConfigDiffQueryParams {
    compareWfrId: number
}

export interface DeploymentHistoryConfigDiffProps
    extends Required<Pick<HistoryLogsProps, 'renderRunSource' | 'resourceId'>> {
    appName: string
    envName: string
    pipelineId: number
    wfrId: number
    triggerHistory: Map<number, History>
    setFullScreenView: (fullscreen: boolean) => void
}

export type DeploymentHistoryDiffDetailedProps = Pick<
    DeploymentConfigDiffProps,
    'collapsibleNavList' | 'configList' | 'errorConfig' | 'isLoading' | 'navList' | 'hideDiffState'
> &
    Required<
        Pick<
            DeploymentHistoryConfigDiffProps,
            'setFullScreenView' | 'wfrId' | 'envName' | 'renderRunSource' | 'resourceId' | 'triggerHistory'
        >
    > & {
        pipelineDeployments: History[]
        convertVariables: boolean
        setConvertVariables: Dispatch<SetStateAction<boolean>>
        isCompareDeploymentConfigNotAvailable?: boolean
        urlFilters: UseUrlFiltersReturnType<string, DeploymentHistoryConfigDiffQueryParams>
    }

export interface DeploymentHistoryConfigDiffRouteParams {
    appId: string
    envId: string
    resourceType: EnvResourceType
    resourceName: string
}

export interface DeploymentHistoryParamsType {
    appId: string
    pipelineId?: string
    historyComponent?: string
    baseConfigurationId?: string
    historyComponentName?: string
    envId?: string
    triggerId?: string
}
