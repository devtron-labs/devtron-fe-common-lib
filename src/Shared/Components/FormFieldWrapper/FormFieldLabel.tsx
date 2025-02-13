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

import { FormFieldLabelProps } from './types'
import { getFormLabelElementId } from './utils'

const FormFieldLabel = ({ label, inputId, required, layout }: FormFieldLabelProps) => {
    if (!label) {
        return null
    }

    const labelId = getFormLabelElementId(inputId)
    const isRowLayout = layout === 'row'

    return (
        <label
            className={`fs-13 lh-20 fw-4 dc__block mb-0 ${isRowLayout ? 'cn-9' : 'cn-7'}`}
            htmlFor={inputId}
            id={labelId}
            data-testid={labelId}
        >
            {typeof label === 'string' ? (
                <span className={`flex left ${required ? 'dc__required-field' : ''}`}>
                    <span className="dc__truncate">{label}</span>
                    {required && <span>&nbsp;</span>}
                </span>
            ) : (
                label
            )}
        </label>
    )
}

export default FormFieldLabel
