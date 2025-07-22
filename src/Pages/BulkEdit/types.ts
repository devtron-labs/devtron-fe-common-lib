export interface BulkEditConfigV2Type {
    gvk: string
    readme: string
    schema: Record<string, any>
}

export interface AppEnvDetail {
    appName: string
    envName?: string
    message: string
}

export interface ObjectsWithAppEnvDetail extends AppEnvDetail {
    names: string[]
}

export interface DeploymentTemplateResponse {
    message: string[]
    failure: AppEnvDetail[]
    successful: AppEnvDetail[]
}

export interface CmCsResponse {
    message: string[]
    failure: ObjectsWithAppEnvDetail[]
    successful: ObjectsWithAppEnvDetail[]
}

export interface BulkEditResponseType {
    deploymentTemplate?: DeploymentTemplateResponse
    configMap?: CmCsResponse
    secret?: CmCsResponse
}

export interface ImpactedDeploymentTemplate {
    appId?: number
    envId?: number
    appName: string
    envName?: string
}

export interface ImpactedCmCs {
    appId?: number
    envId?: number
    appName: string
    envName?: string
    names: string[]
}

export interface ImpactedObjectsType {
    deploymentTemplate?: ImpactedDeploymentTemplate[]
    configMap?: ImpactedCmCs[]
    secret?: ImpactedCmCs[]
}
