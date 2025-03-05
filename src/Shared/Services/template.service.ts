import { getUrlWithSearchParams } from '@Common/Helper'
import { GetTemplateAPIRouteProps } from '@Pages/index'
import { ROUTES } from '@Common/Constants'
import { getResourceApiUrl, ResourceKindType, ResourceVersionType } from '..'

export const getTemplateAPIRoute = ({ type, queryParams: { id, ...restQueryParams } }: GetTemplateAPIRouteProps) =>
    getUrlWithSearchParams(
        `${getResourceApiUrl({
            baseUrl: ROUTES.RESOURCE_TEMPLATE,
            kind: ResourceKindType.devtronApplication,
            version: ResourceVersionType.alpha1,
        })}/${type}`,
        { templateId: id, ...restQueryParams },
    )
