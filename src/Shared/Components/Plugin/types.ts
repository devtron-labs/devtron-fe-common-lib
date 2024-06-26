import { VariableType } from '../../../Common'
import { BaseFilterQueryParams } from '../../types'
import { getPluginStoreData } from './service'

export enum PluginCreationType {
    SHARED = 'SHARED',
    PRESET = 'PRESET',
}

export interface PluginTagNamesDTO {
    tagNames: string[]
}

interface MinimalPluginVersionDataDTO {
    id: number
    name: string
    description: string
    pluginVersion: string
    isLatest: boolean
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
    detailedPluginVersionData: DetailedPluginVersionDTO[]
    minimalPluginVersionData: MinimalPluginVersionDataDTO[]
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
    parentPlugins: ParentPluginDTO[]
    totalCount: number
}

export interface PluginDetailPayloadType {
    appId: number
    fetchLatestVersionDetails: boolean
    pluginId?: number[]
    parentPluginId?: number[]
}

export interface PluginListFiltersType extends Pick<BaseFilterQueryParams<unknown>, 'searchKey'> {
    selectedTags: string[]
    showSelectedPlugins: boolean
}

interface ParentPluginType extends Pick<ParentPluginDTO, 'id' | 'name' | 'description' | 'type' | 'icon'> {
    latestVersionId: MinimalPluginVersionDataDTO['id']
    pluginVersions: MinimalPluginVersionDataDTO[]
}

interface DetailedPluginVersionType
    extends Pick<MinimalPluginVersionDataDTO, 'id' | 'description' | 'name' | 'pluginVersion'>,
        Pick<
            DetailedPluginVersionDTO,
            'tags' | 'isLatest' | 'inputVariables' | 'outputVariables' | 'updatedBy' | 'docLink'
        >,
        Pick<ParentPluginType, 'icon' | 'type'> {
    parentPluginId: ParentPluginType['id']
}

export interface PluginDataStoreType {
    parentPluginStore: Record<number, ParentPluginType>
    pluginVersionStore: Record<number, DetailedPluginVersionType>
}

// TODO: Deprecate this type
export interface PluginDetailType extends DetailedPluginVersionType {}

interface BasePluginListContainerProps {
    filters: PluginListFiltersType
    handleUpdateFilters: (filters: PluginListFiltersType) => void
    availableTags: string[]
    handleUpdateAvailableTags: (tags: string[]) => void
    handlePluginSelection: (parentPluginId: PluginDetailType['parentPluginId']) => void
    pluginDataStore: PluginDataStoreType
    handlePluginDataStoreUpdate: (pluginStore: PluginDataStoreType) => void
    totalCount: number
    handleUpdateTotalCount: (totalCount: number) => void
    persistFilters?: boolean
    pluginList: Pick<PluginDetailType, 'parentPluginId'>[]
    handlePluginListUpdate: (pluginList: Pick<PluginDetailType, 'parentPluginId'>[]) => void
}

export type PluginListContainerProps = BasePluginListContainerProps &
    (
        | {
              /**
               * Would be used to identify the case where we are selecting plugins like mandatory plugin list
               */
              isSelectable: false
              selectedPluginsMap?: never
          }
        | {
              isSelectable: true
              /**
               * Map of parentId to boolean
               */
              selectedPluginsMap: Record<number, boolean>
          }
    )

export interface GetPluginStoreDataServiceParamsType extends Pick<PluginListFiltersType, 'searchKey' | 'selectedTags'> {
    offset: number
    appId: number
}

export interface GetPluginListPayloadType
    extends Pick<GetPluginStoreDataServiceParamsType, 'searchKey' | 'offset' | 'appId'> {
    tag: PluginListFiltersType['selectedTags']
    size: number
    fetchLatestVersionDetails: boolean
}

export interface GetPluginStoreDataReturnType {
    totalCount: number
    pluginStore: PluginDataStoreType
}

export interface PluginListParamsType {
    appId?: string
}

export interface PluginTagSelectProps extends Pick<BasePluginListContainerProps, 'availableTags'> {
    selectedTags: BasePluginListContainerProps['filters']['selectedTags']
    isLoading: boolean
    hasError: boolean
    reloadTags: () => void
    handleUpdateSelectedTags: (tags: string[]) => void
}

export interface PluginListProps
    extends Pick<
        PluginListContainerProps,
        | 'pluginDataStore'
        | 'pluginList'
        | 'totalCount'
        | 'filters'
        | 'handlePluginSelection'
        | 'selectedPluginsMap'
        | 'isSelectable'
    > {
    handleDataUpdateForPluginResponse: (pluginResponse: Awaited<ReturnType<typeof getPluginStoreData>>) => void
    handleClearFilters: () => void
}

export interface PluginCardProps
    extends Pick<PluginListProps, 'isSelectable' | 'pluginDataStore' | 'handlePluginSelection'> {
    parentPluginId: PluginDetailType['parentPluginId']
    isSelected: boolean
}
