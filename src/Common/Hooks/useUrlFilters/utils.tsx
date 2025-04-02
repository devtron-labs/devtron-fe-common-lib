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

import { isNullOrUndefined } from '@Shared/Helpers'

export const setItemInLocalStorageIfKeyExists = (localStorageKey: string, value: string) => {
    if (localStorageKey) {
        localStorage.setItem(localStorageKey, value)
    }
}

export const areAnyAdditionalFiltersApplied = (parsedParams: Record<string | number, any>) => {
    if (!parsedParams || !Object.keys(parsedParams).length) {
        return false
    }

    return Object.keys(parsedParams).some((key) => {
        if (isNullOrUndefined(parsedParams[key])) {
            return false
        }

        if (Array.isArray(parsedParams[key]) || typeof parsedParams[key] === 'string') {
            return parsedParams[key].length > 0
        }

        return true
    })
}
