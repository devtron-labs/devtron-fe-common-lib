import { getUrlWithSearchParams } from '@Common/Helper'
import { GetTemplateAPIRouteProps } from '@Pages/index'
import { getResourceApiUrl, ResourceKindType, ResourceVersionType } from '..'

export const getTemplateAPIRoute = ({ type, queryParams: { id, ...restQueryParams } }: GetTemplateAPIRouteProps) =>
    getUrlWithSearchParams(
        `${getResourceApiUrl({
            baseUrl: 'resource/template',
            kind: ResourceKindType.devtronApplication,
            version: ResourceVersionType.alpha1,
        })}/${type}`,
        { templateId: id, ...restQueryParams },
    )
