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

import { getUrlWithSearchParams } from '../../Common'
import { GetPolicyApiUrlProps, GetResourceApiUrlProps } from './types'

export const getResourceApiUrl = <T>({ baseUrl, kind, version, queryParams }: GetResourceApiUrlProps<T>) =>
    getUrlWithSearchParams(`${baseUrl}/${kind}/${version}`, queryParams)

export const getPolicyApiUrl = <T>({ kind, version, queryParams }: GetPolicyApiUrlProps<T>) =>
    getUrlWithSearchParams(`global/policy/${kind}/${version}`, queryParams)
