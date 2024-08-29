import { ConfigurationType } from '@Shared/types'

export enum DeploymentTemplateCompareModes {
    VALUES = 'values',
    MANIFEST = 'manifest',
}

export interface DeploymentTemplateQueryParamsType {
    hideLockedKeys: boolean
    resolveScopedVariables: boolean
    compareMode: DeploymentTemplateCompareModes
    editMode: ConfigurationType
}
