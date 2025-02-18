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

import { Tooltip } from '../../../../../Common'
import { DeploymentEnvStateProps } from './types'
import { getDeploymentEnvConfig } from './utils'

const DeploymentEnvState = ({ envStateText, title, tooltipContent }: DeploymentEnvStateProps) => {
    const { Icon, stateClassName } = getDeploymentEnvConfig(envStateText)

    return (
        <Tooltip
            alwaysShowTippyOnHover={!!tooltipContent}
            content={tooltipContent}
            placement="right"
            interactive
            className="w-250 dc__overflow-auto mxh-140"
        >
            <div className={`${stateClassName} br-4 cn-9 pt-3 pb-3 pl-6 pr-6 bw-1 mr-6`}>
                <span className="fw-4 fs-11 lh-16 flex dc__gap-4">
                    {Icon}
                    {envStateText}
                    <span className="fw-6">{title}</span>
                </span>
            </div>
        </Tooltip>
    )
}

export default DeploymentEnvState
