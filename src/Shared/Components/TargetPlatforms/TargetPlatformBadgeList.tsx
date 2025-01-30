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

import { ReactComponent as ICStack } from '@Icons/ic-stack.svg'
import { Tooltip } from '@Common/Tooltip'
import { TargetPlatformBadgeListProps } from './types'

const TargetPlatformBadge = ({ name }: TargetPlatformBadgeListProps['targetPlatforms'][number]) => (
    <div className="bg__secondary py-2 px-6 dc__mxw-200 br-4">
        <Tooltip content={name}>
            <span className="dc__truncate cn-7 fs-12 fw-5 lh-16">{name}</span>
        </Tooltip>
    </div>
)

const TargetPlatformBadgeList = ({ targetPlatforms }: TargetPlatformBadgeListProps) => {
    if (!targetPlatforms?.length) {
        return null
    }

    return (
        <div className="flexbox dc__gap-8 dc__align-start">
            <ICStack className="icon-dim-20 dc__no-shrink scn-7 p-2" />

            <div className="flexbox dc__gap-6 flex-wrap">
                {targetPlatforms.map(({ name }) => (
                    <TargetPlatformBadge key={name} name={name} />
                ))}
            </div>
        </div>
    )
}

export default TargetPlatformBadgeList
