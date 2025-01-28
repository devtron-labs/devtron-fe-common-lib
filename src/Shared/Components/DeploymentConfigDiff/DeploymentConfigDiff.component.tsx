/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    isNavHelpTextShowingError,
    tabConfig,
    errorConfig,
    showDetailedDiffState,
    hideDiffState,
    renderedInDrawer,
    ...resProps
}: DeploymentConfigDiffProps) => (
    <div
        className={`deployment-config-diff dc__overflow-auto ${renderedInDrawer ? 'deployment-config-diff--drawer' : ''}`}
    >
        <DeploymentConfigDiffNavigation
            isLoading={isLoading}
            collapsibleNavList={collapsibleNavList}
            navList={navList}
            goBackURL={goBackURL}
            navHeading={navHeading}
            navHelpText={navHelpText}
            isNavHelpTextShowingError={isNavHelpTextShowingError}
            tabConfig={tabConfig}
            errorConfig={errorConfig}
            showDetailedDiffState={showDetailedDiffState}
            hideDiffState={hideDiffState}
        />
        <DeploymentConfigDiffMain
            isLoading={isLoading}
            configList={configList}
            errorConfig={errorConfig}
            showDetailedDiffState={showDetailedDiffState}
            hideDiffState={hideDiffState}
            {...resProps}
        />
    </div>
)
