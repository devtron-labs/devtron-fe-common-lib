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

import { getDefaultRegistry } from '@rjsf/core'
import { BaseInputTemplateProps } from '@rjsf/utils'

import { PLACEHOLDERS } from '../constants'

const {
    templates: { BaseInputTemplate },
} = getDefaultRegistry()

export const BaseInput = ({ placeholder, ...props }: BaseInputTemplateProps) => {
    const { schema } = props

    return (
        <BaseInputTemplate
            placeholder={schema.placeholder || placeholder || PLACEHOLDERS.INPUT}
            {...props}
            className="form__input cn-9 fs-13 lh-20 fw-4"
        />
    )
}
