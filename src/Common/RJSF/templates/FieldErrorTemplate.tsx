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

import React from 'react'
import { errorId, FieldErrorProps } from '@rjsf/utils'

import { ReactComponent as Error } from '../../../Assets/Icon/ic-warning.svg'

export const FieldErrorTemplate = ({ errors = [], idSchema }: FieldErrorProps) => {
    const id = errorId(idSchema)

    return (
        errors.length > 0 && (
            <span id={id}>
                {errors
                    .filter((elem) => !!elem)
                    .map((error, index: number) => (
                        <span className="form__error" key={index}>
                            <Error className="form__icon form__icon--error" />
                            {error}
                        </span>
                    ))}
            </span>
        )
    )
}
