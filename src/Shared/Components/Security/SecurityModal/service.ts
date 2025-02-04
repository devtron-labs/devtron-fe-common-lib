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

import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams } from '@Common/Helper'
import { get } from '@Common/Api'
import { ResponseType } from '@Common/Types'
import { ScanResultDTO, ScanResultParamsType } from './types'

export const getSecurityScan = async ({
    appId,
    envId,
    installedAppId,
    artifactId,
    installedAppVersionHistoryId,
}: ScanResultParamsType): Promise<ResponseType<ScanResultDTO>> => {
    const params: ScanResultParamsType = {
        appId,
        envId,
        installedAppId,
        artifactId,
        installedAppVersionHistoryId,
    }
    const url = getUrlWithSearchParams(ROUTES.SCAN_RESULT, params)
    const response = await get<ScanResultDTO>(url)
    return response
}
