import { Dispatch, SetStateAction } from 'react'

import { DeploymentConfigDiffProps } from '@Shared/Components/DeploymentConfigDiff'
import { EnvResourceType } from '@Shared/Services'

import { History, HistoryLogsProps } from '../types'

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
        previousWfrId: number
        convertVariables: boolean
        setConvertVariables: Dispatch<SetStateAction<boolean>>
        isCompareDeploymentConfigNotAvailable?: boolean
    }

export interface DeploymentHistoryConfigDiffQueryParams {
    compareWfrId: number
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
