import { createGitCommitUrl, handleUTCTime } from '../../Common'
import { CIMaterialInfoDTO, CIMaterialInfoType } from './app.types'

export const getParsedCIMaterialInfo = (ciMaterialData: CIMaterialInfoDTO): CIMaterialInfoType => {
    const materials = (ciMaterialData?.ciMaterials ?? []).map((mat) => ({
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
            date: hist.Date ? handleUTCTime(hist.Date, false) : '',
            message: hist.Message || '',
            changes: hist.Changes || [],
            showChanges: index === 0,
            webhookData: hist.WebhookData,
            isSelected: false,
        })),
        lastFetchTime: mat.lastFetchTime || '',
    }))

    return {
        materials,
        triggeredByEmail: ciMaterialData?.triggeredByEmail || '',
        lastDeployedTime: ciMaterialData?.lastDeployedTime ? handleUTCTime(ciMaterialData.lastDeployedTime, false) : '',
        environmentName: ciMaterialData?.environmentName || '',
        environmentId: ciMaterialData?.environmentId || 0,
        appId: ciMaterialData?.appId,
        appName: ciMaterialData?.appName || '',
        appReleaseTags: ciMaterialData?.imageTaggingData?.appReleaseTags,
        imageComment: ciMaterialData?.imageTaggingData?.imageComment,
        imageReleaseTags: ciMaterialData?.imageTaggingData?.imageReleaseTags,
        image: ciMaterialData?.image,
        tagsEditable: ciMaterialData?.imageTaggingData?.tagsEditable,
    }
}
