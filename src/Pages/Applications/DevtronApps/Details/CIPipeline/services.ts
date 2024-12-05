import { MutableRefObject } from 'react'

import { ROUTES } from '@Common/Constants'
import { getIsRequestAborted, post } from '@Common/Api'
import { getUrlWithSearchParams, showError } from '@Common/Helper'
import { UploadFileDTO } from '@Shared/types'

export const uploadCIPipelineFile = async ({
    file,
    appId,
    ciPipelineId,
    envId,
    allowedExtensions,
    maxUploadSize,
    abortControllerRef,
}: {
    file: File[]
    appId: number
    ciPipelineId: number
    envId?: number
    allowedExtensions?: string[]
    maxUploadSize?: number
    abortControllerRef?: MutableRefObject<AbortController>
}): Promise<UploadFileDTO> => {
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
        if (getIsRequestAborted(err)) {
            return null
        }
        showError(err)
        throw err
    }
}
