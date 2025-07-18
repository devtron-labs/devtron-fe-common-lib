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

import { AppType } from '../../types'
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
                    heading={`ImagePullBackOff: Failed to pull image on ‘${appDetails.clusterName}’ from ‘${appDetails.dockerRegistryId}’ `}
                    description={
                        <div>
                            <span>Possible causes for ImagePullBackOff:</span>
                            <span>
                                &nbsp;&bull; The cluster may not have permission to pull images from the registry
                            </span>
                            <span>&nbsp;&bull; The image tag might be incorrect or missing in the registry</span>
                        </div>
                    }
                />
            </div>
        )
    )
}

export default ErrorBar
