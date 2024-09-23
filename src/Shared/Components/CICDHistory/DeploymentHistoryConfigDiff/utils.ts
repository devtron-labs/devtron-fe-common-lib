import moment from 'moment'

import { DATE_TIME_FORMATS } from '@Common/Constants'
import { DeploymentStageType } from '@Shared/constants'

import { History } from '../types'
import { renderPipelineDeploymentStatusIcon } from './helpers'
import { DeploymentHistoryConfigDiffProps } from './types'

export const getPipelineDeployments = (triggerHistory: DeploymentHistoryConfigDiffProps['triggerHistory']) =>
    Array.from(triggerHistory)
        .filter(([, value]) => value?.stage === DeploymentStageType.DEPLOY)
        .map(([, value]) => value)

export const getPipelineDeploymentsWfrIds = ({
    pipelineDeployments,
    wfrId,
}: { pipelineDeployments: History[] } & Pick<DeploymentHistoryConfigDiffProps, 'wfrId'>) => {
    const currentDeploymentIndex = pipelineDeployments.findIndex(({ id }) => id === wfrId)
    const previousWfrId = currentDeploymentIndex > -1 ? pipelineDeployments[currentDeploymentIndex + 1]?.id : null

    return {
        currentWfrId: wfrId,
        previousWfrId: previousWfrId ?? null,
    }
}

export const getPipelineDeploymentsOptions = (pipelineDeployments: History[], wfrId: number) => {
    const currentDeploymentIndex = pipelineDeployments.findIndex(({ id }) => id === wfrId)
    const previousDeployments = pipelineDeployments.slice(currentDeploymentIndex + 1)

    const pipelineDeploymentsOptions = previousDeployments.map(
        ({ id, finishedOn, stage, triggeredBy, triggeredByEmail, status }) => ({
            value: id,
            label: moment(finishedOn).format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT),
            description: `${stage}  ·  ${triggeredBy === 1 ? 'auto trigger' : triggeredByEmail}`,
            startIcon: renderPipelineDeploymentStatusIcon(status),
        }),
    )
    const currentDeployment = moment(pipelineDeployments[currentDeploymentIndex].finishedOn).format(
        DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT,
    )

    return { currentDeployment, pipelineDeploymentsOptions }
}

export const parseDeploymentHistoryDiffSearchParams = (compareWfrId: number) => (searchParams: URLSearchParams) => ({
    compareWfrId: +(searchParams.get('compareWfrId') || compareWfrId),
})
