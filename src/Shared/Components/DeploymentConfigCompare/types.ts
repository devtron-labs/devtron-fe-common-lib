import { AppEnvDeploymentConfigType, EnvResourceType } from '@Shared/Services'

export interface EnvironmentOptionType {
    name: string
    id: number
    isProtected?: boolean
}

export type DeploymentConfigCompareProps = {
    environments: EnvironmentOptionType[]
    goBackURL?: string
    isBaseConfigProtected?: boolean
    getNavItemHref: (resourceType: EnvResourceType, resourceName: string) => string
} & (
    | {
          type: 'appGroup'
          envName: string
          appName?: never
      }
    | {
          type: 'app'
          appName: string
          envName?: never
      }
)

export interface DeploymentConfigParams {
    appId: string
    envId: string
    compareTo: string
    resourceType: string
    resourceName: string
}

export interface AppEnvDeploymentConfigQueryParamsType {
    configType: AppEnvDeploymentConfigType
    compareWith: string
    compareWithConfigType: AppEnvDeploymentConfigType
    identifierId?: number
    pipelineId?: number
    compareWithIdentifierId?: number
    compareWithPipelineId?: number
    chartRefId?: number
    manifestChartRefId?: number
    compareWithManifestChartRefId?: number
}

export enum AppEnvDeploymentConfigQueryParams {
    CONFIG_TYPE = 'configType',
    COMPARE_WITH = 'compareWith',
    COMPARE_WITH_CONFIG_TYPE = 'compareWithConfigType',
    IDENTIFIER_ID = 'identifierId',
    PIPELINE_ID = 'pipelineId',
    COMPARE_WITH_IDENTIFIER_ID = 'compareWithIdentifierId',
    COMPARE_WITH_PIPELINE_ID = 'compareWithPipelineId',
    CHART_REF_ID = 'chartRefId',
    MANIFEST_CHART_REF_ID = 'manifestChartRefId',
    COMPARE_WITH_MANIFEST_CHART_REF_ID = 'compareWithManifestChartRefId',
}

export type GetConfigDiffDataProps = Required<
    Pick<DeploymentConfigCompareProps, 'appName' | 'envName' | 'type'> & {
        configType: AppEnvDeploymentConfigType
        compareName: string
        identifierId: number
        pipelineId: number
    }
>

export type GetDeploymentTemplateDataProps = Omit<GetConfigDiffDataProps, 'identifierId' | 'pipelineId'>

export type GetManifestDataProps = Pick<DeploymentConfigCompareProps, 'type' | 'environments'> & {
    appId: string
    envId: string
    configType: AppEnvDeploymentConfigType
    compareName: string
    values: string
    identifierId: number
    pipelineId: number
    manifestChartRefId: number
}
