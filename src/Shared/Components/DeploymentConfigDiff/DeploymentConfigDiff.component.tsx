import { DeploymentConfigDiffNavigation } from './DeploymentConfigDiffNavigation'
import { DeploymentConfigDiffMain } from './DeploymentConfigDiffMain'
import { DeploymentConfigDiffProps } from './DeploymentConfigDiff.types'
import './DeploymentConfigDiff.scss'

export const DeploymentConfigDiff = ({
    isLoading,
    configList = [],
    collapsibleNavList = [],
    navList = [],
    goBackURL,
    navHeading,
    navHelpText,
    tabConfig,
    errorConfig,
    ...resProps
}: DeploymentConfigDiffProps) => (
    <div className="deployment-config-diff">
        <DeploymentConfigDiffNavigation
            isLoading={isLoading}
            collapsibleNavList={collapsibleNavList}
            navList={navList}
            goBackURL={goBackURL}
            navHeading={navHeading}
            navHelpText={navHelpText}
            tabConfig={tabConfig}
            errorConfig={errorConfig}
        />
        <DeploymentConfigDiffMain
            isLoading={isLoading}
            configList={configList}
            errorConfig={errorConfig}
            {...resProps}
        />
    </div>
)
