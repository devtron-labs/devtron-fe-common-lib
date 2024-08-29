import { ConfigurationType } from '@Shared/types'

export interface DeploymentTemplateQueryParamsType {
    hideLockedKeys: boolean
    resolveScopedVariables: boolean
    compareValues: boolean
    compareManifest: boolean
    currentMode: ConfigurationType
}
