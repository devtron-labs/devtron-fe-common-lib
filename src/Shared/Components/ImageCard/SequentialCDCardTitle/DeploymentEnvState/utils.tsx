import { DEPLOYMENT_ENV_TEXT } from './constants'
import { GetDeploymentEnvConfigType } from './types'
import { ReactComponent as ICWorld } from '../../../../../Assets/Icon/ic-world.svg'
import { ReactComponent as ICRocketFail } from '../../../../../Assets/Icon/ic-rocket-fail.svg'

// eslint-disable-next-line import/prefer-default-export
export const getDeploymentEnvConfig = (envStateText: string): GetDeploymentEnvConfigType => {
    switch (envStateText) {
        case DEPLOYMENT_ENV_TEXT.ACTIVE:
            return { Icon: <ICWorld className="icon-dim-16 mr-4 scg-5" />, stateClassName: 'bcg-1 eg-2' }

        case DEPLOYMENT_ENV_TEXT.FAILED:
            return { Icon: <ICRocketFail className="icon-dim-16 mr-4" />, stateClassName: 'bcr-1 er-2' }

        case DEPLOYMENT_ENV_TEXT.DEPLOYING:
            return {
                Icon: <div className="dc__app-summary__icon icon-dim-16 mr-6 progressing progressing--node" />,
                stateClassName: 'bcy-1 ey-2',
            }

        default:
            return {
                Icon: null,
                stateClassName: '',
            }
    }
}
