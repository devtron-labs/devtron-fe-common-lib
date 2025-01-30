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

import { AppStatusProps } from './types'
import { StatusComponent } from './StatusComponent'
import { APP_STATUS } from './constants'

export const AppStatus = ({ status, isJobView = false, isVirtualEnv = false, ...restProps }: AppStatusProps) => {
    const appStatus = isVirtualEnv ? APP_STATUS.NOT_AVAILABLE : status
    const isNotDeployed = appStatus.toLowerCase().replace(/ /g, '-') === APP_STATUS.NOT_DEPLOYED
    const notDeployedMessage = isJobView ? APP_STATUS.JOB_VIEW_NOT_DEPLOYED_MESSAGE : APP_STATUS.NOT_DEPLOYED_MESSAGE
    const textContent = isNotDeployed ? notDeployedMessage : appStatus

    return <StatusComponent status={appStatus} message={textContent} {...restProps} />
}
