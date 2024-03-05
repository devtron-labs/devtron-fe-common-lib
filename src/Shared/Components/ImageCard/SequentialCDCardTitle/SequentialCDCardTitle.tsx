import { ARTIFACT_STATUS, STAGE_TYPE } from '../../../constants'
import { DeploymentEnvState } from './DeploymentEnvState'
import { DEPLOYMENT_ENV_TEXT } from './DeploymentEnvState/constants'
import { SequentialCDCardTitleProps } from '../types'
import { ImageTagButton } from '../../../../Common'

const SequentialCDCardTitle = ({
    isLatest,
    isRunningOnParentCD,
    artifactStatus,
    environmentName,
    parentEnvironmentName,
    stageType,
    showLatestTag,
    isVirtualEnvironment,
    deployedOn,
    additionalInfo,
}: SequentialCDCardTitleProps) => {
    const getDeployedStateText = () => {
        if (isVirtualEnvironment) {
            return DEPLOYMENT_ENV_TEXT.VIRTUAL_ENV
        }
        return DEPLOYMENT_ENV_TEXT.ACTIVE
    }

    const renderDeployedEnvironmentName = () => {
        if (deployedOn?.length) {
            return (
                <DeploymentEnvState
                    envStateText={getDeployedStateText()}
                    title={`${deployedOn.length} environments`}
                    tooltipContent={deployedOn.join(',')}
                />
            )
        }

        return (
            <>
                {isLatest && environmentName && (
                    <DeploymentEnvState envStateText={getDeployedStateText()} title={environmentName} />
                )}
                {isRunningOnParentCD && parentEnvironmentName && (
                    <DeploymentEnvState envStateText={getDeployedStateText()} title={parentEnvironmentName} />
                )}
            </>
        )
    }

    if (stageType !== STAGE_TYPE.CD) {
        if (isLatest) {
            return (
                <div className="bcn-0 pb-8 br-4 flex left">
                    <span className="last-deployed-status">Last Run</span>
                </div>
            )
        }
        return null
    }

    if (isLatest || isRunningOnParentCD || Object.values(ARTIFACT_STATUS).includes(artifactStatus) || showLatestTag) {
        return (
            <div className="bcn-0 pb-8 br-4 flex left">
                {renderDeployedEnvironmentName()}
                {artifactStatus === ARTIFACT_STATUS.PROGRESSING && (
                    <DeploymentEnvState envStateText={DEPLOYMENT_ENV_TEXT.DEPLOYING} title={environmentName} />
                )}
                {(artifactStatus === ARTIFACT_STATUS.DEGRADED || artifactStatus === ARTIFACT_STATUS.FAILED) && (
                    <DeploymentEnvState envStateText={DEPLOYMENT_ENV_TEXT.FAILED} title={environmentName} />
                )}
                {showLatestTag && (
                    <ImageTagButton
                        text="Latest"
                        isSoftDeleted={false}
                        isEditing={false}
                        tagId={0}
                        softDeleteTags={[]}
                        isSuperAdmin
                    />
                )}
                {additionalInfo}
            </div>
        )
    }

    return null
}

export default SequentialCDCardTitle
