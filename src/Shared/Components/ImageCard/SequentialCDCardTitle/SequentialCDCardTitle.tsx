import { ARTIFACT_STATUS } from '../../../constants'
import { DeploymentEnvState } from './DeploymentEnvState'
import { DEPLOYMENT_ENV_TEXT } from './DeploymentEnvState/constants'
import { SequentialCDCardTitleProps } from './types'

const SequentialCDCardTitle = ({
    isLatest,
    isRunningOnParentCD,
    artifactStatus,
    environmentName,
    parentEnvironmentName,
}: SequentialCDCardTitleProps) => {
    if (isLatest || isRunningOnParentCD || Object.values(ARTIFACT_STATUS).includes(artifactStatus)) {
        return (
            <div className="bcn-0 pb-8 br-4 flex left">
                {isLatest && <DeploymentEnvState envStateText={DEPLOYMENT_ENV_TEXT.ACTIVE} envName={environmentName} />}
                {isRunningOnParentCD && (
                    <DeploymentEnvState envStateText={DEPLOYMENT_ENV_TEXT.ACTIVE} envName={parentEnvironmentName} />
                )}
                {artifactStatus === ARTIFACT_STATUS.PROGRESSING && (
                    <DeploymentEnvState envStateText={DEPLOYMENT_ENV_TEXT.DEPLOYING} envName={environmentName} />
                )}
                {(artifactStatus === ARTIFACT_STATUS.DEGRADED || artifactStatus === ARTIFACT_STATUS.FAILED) && (
                    <DeploymentEnvState envStateText={DEPLOYMENT_ENV_TEXT.FAILED} envName={environmentName} />
                )}
            </div>
        )
    }

    return null
}

export default SequentialCDCardTitle
