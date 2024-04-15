import { URLS, createGitCommitUrl, get, handleUTCTime } from '../../../Common'
import { ISTTimeModal } from '../../Helpers'

export function getCITriggerInfo(params: { envId: number | string; ciArtifactId: number | string }) {
    const URL = `${URLS.APP}/material-info/${params.envId}/${params.ciArtifactId}`
    return get(URL)
}

export function getCITriggerInfoModal(params: { envId: number | string; ciArtifactId: number | string }) {
    return getCITriggerInfo(params).then((response) => {
        let materials = response?.result?.ciMaterials || []
        materials = materials.map((mat) => ({
            id: mat.id,
            gitMaterialName: mat.gitMaterialName || '',
            gitMaterialId: mat.gitMaterialId || 0,
            gitURL: mat.url || '',
            type: mat.type || '',
            value: mat.value || '',
            active: mat.active || false,
            history: mat.history.map((hist, index) => ({
                commitURL: mat.url ? createGitCommitUrl(mat.url, hist.Commit) : '',
                commit: hist.Commit || '',
                author: hist.Author || '',
                date: hist.Date ? ISTTimeModal(hist.Date, false) : '',
                message: hist.Message || '',
                changes: hist.Changes || [],
                showChanges: index === 0,
                webhookData: hist.WebhookData,
            })),
            lastFetchTime: mat.lastFetchTime || '',
        }))
        if (materials.length > 0 && !materials.find((mat) => mat.isSelected)) {
            materials[0].isSelected = true
        }
        return {
            code: response.code,
            result: {
                materials,
                triggeredByEmail: response.result.triggeredByEmail || '',
                lastDeployedTime: response.result.lastDeployedTime
                    ? handleUTCTime(response.result.lastDeployedTime, false)
                    : '',
                environmentName: response.result.environmentName || '',
                environmentId: response.result.environmentId || 0,
                appName: response.result.appName || '',
                appReleaseTags: response?.result?.imageTaggingData?.appReleaseTags,
                imageComment: response?.result?.imageTaggingData?.imageComment,
                imageReleaseTags: response?.result?.imageTaggingData?.imageReleaseTags,
                image: response?.result?.image,
                tagsEditable: response?.result?.imageTaggingData?.tagsEditable,
            },
        }
    })
}
