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

/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { SegmentedBarChart } from '@Common/SegmentedBarChart'

import { ClusterMapProps } from './types'
import { getEntities } from './utils'

export const ClusterMap = ({ filteredList, isLoading }: ClusterMapProps) => {
    if (!filteredList?.length) {
        return null
    }

    const { statusEntities, deploymentEntities } = getEntities(filteredList)

    return (
        <div className="pb-16 px-20">
            <div className="dc__grid-half shadow__card--20 w-100 dc__border br-8 dc__grid dc__align-items-center">
                <SegmentedBarChart
                    entities={statusEntities}
                    rootClassName="p-16 fs-13 dc__border-right-n1 cn-9"
                    countClassName="fw-6 fs-20 lh-1-5"
                    labelClassName="lh-20"
                    isProportional
                    showAnimationOnBar
                    isLoading={isLoading}
                />

                <SegmentedBarChart
                    entities={deploymentEntities}
                    rootClassName="p-16 fs-13 cn-9"
                    countClassName="fw-6 fs-20 lh-1-5"
                    labelClassName="lh-20"
                    isProportional
                    showAnimationOnBar
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}
