import { Routes } from '@Shared/constants'
import { post, trash } from '..'

export function savePipeline(request, isRegexMaterial = false): Promise<any> {
    let url
    if (isRegexMaterial) {
        url = `${Routes.CI_PIPELINE_PATCH}/regex`
    } else {
        url = `${Routes.CI_PIPELINE_PATCH}`
    }
    return post(url, request)
}

export function deleteWorkflow(appId: string, workflowId: number) {
    const URL = `${Routes.WORKFLOW}/${appId}/${workflowId}`
    return trash(URL)
}
