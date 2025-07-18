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

import { AppDetails, AppType } from '../../types'
import { AppDetailsErrorType } from './types'

export const getIsImagePullBackOff = (appDetails: AppDetails): boolean => {
    if (appDetails?.appType === AppType.DEVTRON_APP && appDetails.resourceTree?.nodes?.length) {
        return appDetails.resourceTree.nodes.some((node) =>
            (node.info || []).some((info) => {
                const infoValueLowerCase = info.value?.toLowerCase()
                return (
                    infoValueLowerCase === AppDetailsErrorType.ERRIMAGEPULL ||
                    infoValueLowerCase === AppDetailsErrorType.IMAGEPULLBACKOFF
                )
            }),
        )
    }

    return false
}

export const renderErrorHeaderMessage = (appDetails: AppDetails, key: string, onClickActionButton?) => (
    <div>
        &apos;{appDetails.clusterName}&apos; cluster
        {appDetails.ipsAccessProvided ? ' could not' : ' does not have permission to'} pull container image from ‘
        {appDetails.dockerRegistryId}’ registry.
        {key === 'sync-error' && (
            <span className="cb-5 cursor fw-6 ml-8" onClick={onClickActionButton}>
                {appDetails.ipsAccessProvided ? 'Possible issues?' : 'How to resolve?'}
            </span>
        )}
    </div>
)
