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
