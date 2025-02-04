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
import { getIsRequestAborted, post } from '@Common/Api'
import { getUrlWithSearchParams, showError } from '@Common/Helper'
import { UploadFileDTO, UploadFileProps } from '@Shared/types'
import { APIOptions } from '@Common/Types'

export const uploadCIPipelineFile = async ({
    file,
    appId,
    ciPipelineId,
    envId,
    allowedExtensions,
    maxUploadSize,
    abortControllerRef,
}: {
    appId: number
    ciPipelineId: number
    envId?: number
} & UploadFileProps &
    Pick<APIOptions, 'abortControllerRef'>): Promise<UploadFileDTO> => {
    const formData = new FormData()
    formData.append('file', file[0])

    try {
        const { result } = await post(
            getUrlWithSearchParams(`${ROUTES.CI_CONFIG_GET}/${appId}/${ciPipelineId}/${ROUTES.FILE_UPLOAD}`, {
                envId,
                allowedExtensions,
                maxUploadSize,
            }),
            formData,
            { abortControllerRef },
            true,
        )

        return result
    } catch (err) {
        if (!getIsRequestAborted(err)) {
            showError(err)
        }
        throw err
    }
}
