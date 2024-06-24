import { VariableType } from '../../../Common'
import { BaseFilterQueryParams } from '../../types'

export enum PluginCreationType {
    SHARED = 'SHARED',
    PRESET = 'PRESET',
}

interface MinimalPluginVersionDataDTO {
    id: number
    name: string
    description: string
    pluginVersion: string
}

interface DetailedPluginVersionDTO extends MinimalPluginVersionDataDTO {
    tags: string[]
    isLatest: boolean
    inputVariables: VariableType[]
    outputVariables: VariableType[]
    /**
     * Present in case of shared plugin
     */
    updatedBy?: string
    docLink?: string
}

interface PluginVersionsDTO {
    detailedPluginVersionData: DetailedPluginVersionDTO
    minimalPluginVersionData: MinimalPluginVersionDataDTO
}

export interface ParentPluginDTO {
    id: number
    name: string
    description: string
    type: PluginCreationType
    icon: string
    pluginVersions: PluginVersionsDTO
}

export interface PluginDetailDTO {
    parentPlugins: ParentPluginDTO
    totalCount: number
}

export interface PluginDetailPayloadType {
    appId: number
    fetchLatestVersionDetails: boolean
    pluginId?: number[]
    parentPluginId?: number
}

export interface PluginListFiltersType extends Pick<BaseFilterQueryParams<unknown>, 'searchKey' | 'offset'> {
    selectedTags: string[]
}

interface ParentPluginType extends Pick<ParentPluginDTO, 'id' | 'name' | 'description' | 'type' | 'icon'> {}

interface BasePluginVersionType
    extends Pick<MinimalPluginVersionDataDTO, 'id' | 'description' | 'name' | 'pluginVersion'> {
    parentPluginId: ParentPluginType['id']
}

interface DetailedPluginVersionType
    extends BasePluginVersionType,
        Pick<
            DetailedPluginVersionDTO,
            'tags' | 'isLatest' | 'inputVariables' | 'outputVariables' | 'updatedBy' | 'docLink'
        > {}

export interface PluginDataStoreType {
    parentPluginStore: Record<string, ParentPluginType>
    pluginVersionStore: Record<string, DetailedPluginVersionType>
}
