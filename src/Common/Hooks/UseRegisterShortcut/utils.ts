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

import { ShortcutType } from './types'

export const preprocessKeys = (keys: ShortcutType['keys']) => {
    if (!keys) {
        throw new Error('keys undefined')
    }

    // NOTE: converting key to a string for the case for bad inputs
    const processedKeys = keys.map((key) => `${key}`.toUpperCase()).sort() as ShortcutType['keys']

    return {
        keys: processedKeys,
        id: processedKeys.join(),
    }
}

export const verifyCallbackStack = (stack: ShortcutType['callbackStack']) => {
    if (!stack || !Array.isArray(stack) || !stack.every((callback) => typeof callback === 'function')) {
        throw new Error('callback stack is undefined')
    }
}
