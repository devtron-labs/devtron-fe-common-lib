import { Dispatch, SetStateAction } from 'react'

import { DeploymentConfigDiffProps } from '@Shared/Components/DeploymentConfigDiff'
import { EnvResourceType } from '@Shared/Services'

import { History } from '../types'

export interface DeploymentHistoryConfigDiffProps {
    appName: string
    envName: string
    pipelineId: number
    wfrId: number
    triggerHistory: Map<number, History>
    setFullScreenView: (fullscreen: boolean) => void
}

export type DeploymentHistoryDiffDetailedProps = Pick<
    DeploymentConfigDiffProps,
    'collapsibleNavList' | 'configList' | 'errorConfig' | 'isLoading' | 'navList'
> &
    Pick<DeploymentHistoryConfigDiffProps, 'setFullScreenView' | 'wfrId' | 'envName'> & {
        pipelineDeployments: History[]
        previousWfrId: number
        convertVariables: boolean
        setConvertVariables: Dispatch<SetStateAction<boolean>>
    }

export interface DeploymentHistoryConfigDiffQueryParams {
    compareWfrId: number
}

export interface DeploymentHistoryConfigDiffRouteParams {
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
