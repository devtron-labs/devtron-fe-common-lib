import { DeploymentNodeType } from '@Common/Types'

export const STAGE_MAP = {
    [DeploymentNodeType.PRECD]: 'PRE',
    [DeploymentNodeType.CD]: 'DEPLOY',
    [DeploymentNodeType.POSTCD]: 'POST',
    [DeploymentNodeType.APPROVAL]: 'APPROVAL',
} as const
