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

import { FormEvent, FunctionComponent } from 'react'
import { BUILD_INFRA_DEFAULT_PLATFORM_NAME, getBuildInfraInheritActionFromLocator } from '@Pages/index'
import { BuildInfraFormItemProps } from './types'
import { CHECKBOX_VALUE, Checkbox } from '../../../Common'

const BuildInfraFormItem: FunctionComponent<BuildInfraFormItemProps> = ({
    heading,
    marker: Marker,
    children,
    isInheriting,
    showDivider,
    handleProfileInputChange,
    locator,
    isGlobalProfile,
    targetPlatform = BUILD_INFRA_DEFAULT_PLATFORM_NAME,
}) => {
    const handleActivationChange = (e: FormEvent<HTMLInputElement>) => {
        const { checked } = e.currentTarget
        const action = getBuildInfraInheritActionFromLocator(locator, checked)
        handleProfileInputChange({ action, data: { targetPlatform } })
    }

    const renderMarker = () => {
        if (isGlobalProfile) {
            return <Marker className="icon-dim-20 dc__no-shrink" />
        }

        return (
            <Checkbox
                onChange={handleActivationChange}
                isChecked={!isInheriting}
                value={CHECKBOX_VALUE.CHECKED}
                dataTestId={`${locator}_marker`}
            />
        )
    }

    // If in configuration active is false, means it is inheriting values from other profile
    return (
        <>
            <div className="flexbox-col dc__gap-8 w-100">
                <div className="flexbox dc__gap-12 dc__align-start w-100">
                    {renderMarker()}

                    <div className="flexbox-col dc__gap-8 w-100">
                        {heading}
                        {!isInheriting && children}
                    </div>
                </div>
            </div>

            {showDivider && <div className="w-100 dc__border-bottom-n1" />}
        </>
    )
}

export default BuildInfraFormItem
