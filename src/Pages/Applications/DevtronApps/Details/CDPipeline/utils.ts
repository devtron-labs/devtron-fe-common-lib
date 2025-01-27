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

import { APIOptions, CDMaterialType } from '@Common/Types'

export const getAPIOptionsWithTriggerTimeout = (options?: APIOptions): APIOptions => {
    const _options: APIOptions = options ? structuredClone(options) : {}

    if (window._env_.TRIGGER_API_TIMEOUT) {
        _options.timeout = window._env_.TRIGGER_API_TIMEOUT
    }

    return _options
}

/**
 * This check is used to find the image that is currently deployed on the environment
 * from the image list fetched from genericCDMaterialsService for a given environment
 *
 * @param material CDMaterialType
 * @returns if image is currently deployed
 */
export const isImageActiveOnEnvironment = (material: CDMaterialType) => material.deployed && material.latest
