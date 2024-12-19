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

import { ValidationRules } from './ValidationRules'

/**
 *
 * @param value tag key value to validate
 * @returns isValid: boolean, errorMessages: string[]
 */
export const validateTagKeyValue = (value: string): { isValid: boolean; errorMessages: string[] } => {
    const { propagateTagKey } = new ValidationRules()

    const { isValid, messages } = propagateTagKey(value)
    return { isValid, errorMessages: messages }
}

export const validateTagValue = (value: string, key: string): { isValid: boolean; errorMessages: string[] } => {
    const { propagateTagValue } = new ValidationRules()

    const { isValid, messages } = propagateTagValue(value, key)
    return { isValid, errorMessages: messages }
}
