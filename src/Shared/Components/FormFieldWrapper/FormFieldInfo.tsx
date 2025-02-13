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

import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'
import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICInfoFilledOverride } from '@Icons/ic-info-filled-override.svg'
import { FormFieldInfoProps, FormInfoItemProps } from './types'
import { getFormErrorElementId } from './utils'

const FormInfoItem = ({ id, text, icon, textClass }: FormInfoItemProps) => (
    <div className="flexbox dc__gap-4 fs-11 lh-16 fw-4" id={id}>
        <span className="dc__no-shrink icon-dim-16 flex top dc__fill-available-space">{icon}</span>
        <span className={`dc__ellipsis-right__2nd-line ${textClass}`}>{text}</span>
    </div>
)

const FormFieldInfo = ({ error, helperText, warningText, inputId }: FormFieldInfoProps) => (
    <div className="flex left column dc__gap-4">
        {error && <FormInfoItem text={error} icon={<ICError />} textClass="cr-5" id={getFormErrorElementId(inputId)} />}
        {helperText && (
            <FormInfoItem
                text={helperText}
                icon={<ICInfoFilledOverride className="info-icon-n6" />}
                textClass="cn-7"
                id={`${inputId}-helper-text`}
            />
        )}
        {warningText && (
            <FormInfoItem
                text={warningText}
                icon={<ICWarning className="warning-icon-y7" />}
                textClass="cy-7"
                id={`${inputId}-warning-msg`}
            />
        )}
    </div>
)

export default FormFieldInfo
