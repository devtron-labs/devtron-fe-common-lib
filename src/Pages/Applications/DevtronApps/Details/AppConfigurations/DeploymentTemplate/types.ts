import { ConfigurationType } from '@Shared/types'

export enum DeploymentTemplateTabsType {
    EDIT = 1,
    COMPARE = 2,
    PUBLISHED = 3,
}

export interface DeploymentTemplateQueryParamsType {
    hideLockedKeys: boolean
    resolveScopedVariables: boolean
    selectedTab: DeploymentTemplateTabsType
    showReadMe: boolean
    editMode: ConfigurationType
}
