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

import { Icon } from '../Icon'
import { AppStatusProps } from './types'
import { StatusComponent } from './StatusComponent'
import { APP_STATUS } from './constants'
import { getJobStatusFromStatus } from './utils'

export const AppStatus = ({ status, isJobView = false, isVirtualEnv = false, ...restProps }: AppStatusProps) => {
    const _status = isJobView ? getJobStatusFromStatus(status) : status
    const appStatus = isVirtualEnv ? APP_STATUS.NOT_AVAILABLE : (_status ?? '')
    const isNotDeployed =
        appStatus.toLowerCase().replace(/ /g, '-') === APP_STATUS.NOT_DEPLOYED ||
        appStatus.toLowerCase() === APP_STATUS.NOT_DEPLOYED_NO_SPACE
    const notDeployedMessage = isJobView ? APP_STATUS.JOB_VIEW_NOT_DEPLOYED_MESSAGE : APP_STATUS.NOT_DEPLOYED_MESSAGE
    const textContent = isNotDeployed ? notDeployedMessage : appStatus

    return appStatus ? (
        <StatusComponent status={appStatus} message={textContent} {...restProps} />
    ) : (
        <div className="flexbox dc__align-items-center dc__gap-6">
            <Icon
                name="ic-info-outline"
                size={restProps.iconSize}
                tooltipProps={{
                    alwaysShowTippyOnHover: true,
                    placement: 'top',
                    content: 'To fetch app status for Helm based deployments open the app detail page',
                }}
                color="N600"
            />
            <span className="fs-13 lh-20 cn-6">-</span>
        </div>
    )
}
