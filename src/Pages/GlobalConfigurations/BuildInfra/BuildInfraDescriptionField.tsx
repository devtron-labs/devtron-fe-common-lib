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
import { Textarea } from '@Shared/Components'
import { BuildInfraMetaConfigTypes, BuildInfraProfileMetaFieldProps } from './types'
import { BUILD_INFRA_TEXT } from './constants'

const BuildInfraProfileDescriptionField: FunctionComponent<BuildInfraProfileMetaFieldProps> = ({
    handleProfileInputChange,
    onChange,
    currentValue,
    error,
}) => {
    const handleChange = (e: FormEvent<HTMLTextAreaElement>) => {
        if (handleProfileInputChange) {
            handleProfileInputChange({
                action: BuildInfraMetaConfigTypes.DESCRIPTION,
                data: { value: e.currentTarget.value },
            })

            return
        }

        onChange(e)
    }

    return (
        <Textarea
            label={BUILD_INFRA_TEXT.DESCRIPTION_LABEL}
            name="build-infra-profile-description"
            placeholder={BUILD_INFRA_TEXT.DESCRIPTION_PLACEHOLDER}
            value={currentValue}
            onChange={handleChange}
            error={error}
        />
    )
}

export default BuildInfraProfileDescriptionField
