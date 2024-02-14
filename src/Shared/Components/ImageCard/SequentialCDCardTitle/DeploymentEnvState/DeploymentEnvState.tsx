import { DeploymentEnvStateProps } from './types'
import { getDeploymentEnvConfig } from './utils'

const DeploymentEnvState = ({ envStateText, envName }: DeploymentEnvStateProps) => {
    const { Icon, stateClassName } = getDeploymentEnvConfig(envStateText)

    return (
        <div className={`${stateClassName} br-4 cn-9 pt-3 pb-3 pl-6 pr-6 bw-1 mr-6`}>
            <span className="fw-4 fs-11 lh-16 flex">
                {Icon}
                {envStateText}
                <span className="fw-6 ml-4">{envName}</span>
            </span>
        </div>
    )
}

export default DeploymentEnvState
