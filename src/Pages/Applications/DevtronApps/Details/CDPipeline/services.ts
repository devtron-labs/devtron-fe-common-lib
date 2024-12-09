import { MutableRefObject } from 'react'

import { getIsRequestAborted, post } from '@Common/Api'
import { ROUTES } from '@Common/Constants'
import { getUrlWithSearchParams, showError } from '@Common/Helper'
import { UploadFileDTO, UploadFileProps } from '@Shared/types'

export const uploadCDPipelineFile = async ({
    file,
    appId,
    envId,
    allowedExtensions,
    maxUploadSize,
    abortControllerRef,
}: UploadFileProps & {
    appId: number
    envId: number
    abortControllerRef?: MutableRefObject<AbortController>
}): Promise<UploadFileDTO> => {
    const formData = new FormData()
    formData.append('file', file[0])

    try {
        const { result } = await post(
            getUrlWithSearchParams(`${ROUTES.CD_CONFIG}/${appId}/${envId}/${ROUTES.FILE_UPLOAD}`, {
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
