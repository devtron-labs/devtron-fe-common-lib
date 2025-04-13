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

import { FunctionComponent } from 'react'

import { BuildInfraFormItemProps } from './types'

const BuildInfraFormItem: FunctionComponent<BuildInfraFormItemProps> = ({
    heading,
    marker: Marker,
    children,
    isInheriting,
    showDivider,
}) => (
    // If in configuration active is false, means it is inheriting values from other profile
    <>
        <div className="flexbox-col dc__gap-8 w-100">
            <div className="flexbox dc__gap-12 dc__align-start w-100">
                <Marker className="icon-dim-20 dc__no-shrink" />

                <div className="flexbox-col dc__gap-8 w-100">
                    {heading}
                    {!isInheriting && children}
                </div>
            </div>
        </div>

        {showDivider && <div className="w-100 dc__border-bottom-n1" />}
    </>
)

export default BuildInfraFormItem
