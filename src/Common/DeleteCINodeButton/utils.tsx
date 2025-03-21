import { Routes } from '@Shared/constants'
import { AppConfigProps, GetTemplateAPIRouteType } from '@Pages/index'
import { getTemplateAPIRoute } from '@Shared/index'
import { post, trash } from '..'

export function savePipeline(
    request,
    {
        isRegexMaterial = false,
        isTemplateView,
    }: Required<Pick<AppConfigProps, 'isTemplateView'>> & {
        isRegexMaterial?: boolean
    },
): Promise<any> {
    let url
    if (isRegexMaterial) {
        url = `${Routes.CI_PIPELINE_PATCH}/regex`
    } else {
        url = isTemplateView
            ? getTemplateAPIRoute({
                  type: GetTemplateAPIRouteType.CI_PIPELINE,
                  queryParams: {
                      id: request.appId,
                  },
              })
            : Routes.CI_PIPELINE_PATCH
    }
    return post(url, request)
}

export function deleteWorkflow(appId: string, workflowId: number, isTemplateView: AppConfigProps['isTemplateView']) {
    const URL = isTemplateView
        ? getTemplateAPIRoute({
              type: GetTemplateAPIRouteType.WORKFLOW,
              queryParams: { id: appId, appWorkflowId: workflowId },
          })
        : `${Routes.WORKFLOW}/${appId}/${workflowId}`
    return trash(URL)
}
