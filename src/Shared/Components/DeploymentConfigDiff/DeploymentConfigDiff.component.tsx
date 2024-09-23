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
    showDetailedDiffState,
    renderedInDrawer,
    ...resProps
}: DeploymentConfigDiffProps) => (
    <div className={`deployment-config-diff ${renderedInDrawer ? 'deployment-config-diff--drawer' : ''}`}>
        <DeploymentConfigDiffNavigation
            isLoading={isLoading}
            collapsibleNavList={collapsibleNavList}
            navList={navList}
            goBackURL={goBackURL}
            navHeading={navHeading}
            navHelpText={navHelpText}
            tabConfig={tabConfig}
            showDetailedDiffState={showDetailedDiffState}
        />
        <DeploymentConfigDiffMain
            isLoading={isLoading}
            configList={configList}
            showDetailedDiffState={showDetailedDiffState}
            {...resProps}
        />
    </div>
)
