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

import { NavLink } from 'react-router-dom'

import { ROUTER_URLS } from '@PagesDevtron2.0/Shared'

import { AppType } from '../../types'
import { Icon } from '../Icon'
import { InfoBlock } from '../InfoBlock'
import { ErrorBarType } from './types'
import { getIsImagePullBackOff } from './utils'

const ErrorBar = ({ appDetails, useParentMargin = true }: ErrorBarType) => {
    if (
        !appDetails ||
        appDetails.appType !== AppType.DEVTRON_APP ||
        !appDetails.resourceTree ||
        !appDetails.resourceTree.nodes ||
        appDetails.externalCi
    ) {
        return null
    }

    const isImagePullBackOff = getIsImagePullBackOff(appDetails)

    return (
        isImagePullBackOff && (
            <div className={`flexbox-col dc__gap-16 ${useParentMargin ? 'm-20' : ''} fs-13`}>
                <InfoBlock
                    heading={
                        <div className="flexbox dc__content-space fs-13 lh-20 cn-9 fw-6">
                            <div>
                                ImagePullBackOff: Failed to pull image on ‘{appDetails.clusterName}’ from ‘
                                {appDetails.dockerRegistryId}’
                            </div>
                            <NavLink
                                to={`${ROUTER_URLS.GLOBAL_CONFIG_DOCKER}/${appDetails.dockerRegistryId}`}
                                className="cb-5 fs-13 anchor w-auto dc__no-decor flex ml-8"
                            >
                                Check Permission&nbsp;&nbsp;
                                <Icon name="ic-arrow-right" color="B500" />
                            </NavLink>
                        </div>
                    }
                    description={
                        <div className="flexbox-col fs-13 lh-20 cn-9 dc__content-space">
                            <div>Possible causes for ImagePullBackOff:</div>
                            <div>&nbsp;&bull; The cluster may not have permission to pull images from the registry</div>
                            <div>&nbsp;&bull; The image tag might be incorrect or missing in the registry</div>
                        </div>
                    }
                    variant="error"
                />
            </div>
        )
    )
}

export default ErrorBar
