import { MutableRefObject } from 'react'
import { VariableType } from '../../../Common'
import { BaseFilterQueryParams } from '../../types'
import { ImageWithFallbackProps } from '../ImageWithFallback'
import { getPluginStoreData } from './service'

export enum PluginCreationType {
    SHARED = 'SHARED',
    PRESET = 'PRESET',
}

export interface GetPluginTagsPayloadType {
    appId: number
}

export interface PluginTagNamesDTO {
    tagNames: string[]
}

/**
 * Minimal data of child plugins
 */
interface MinimalPluginVersionDataDTO {
    id: number
    name: string
    description: string
    pluginVersion: string
    isLatest: boolean
}

interface DetailedPluginVersionDTO extends MinimalPluginVersionDataDTO {
    tags: string[]
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

export interface PluginDetailServiceParamsType {
    appId: number
    pluginIds?: number[]
    parentPluginIds?: number[]
}

export interface PluginDetailPayloadType extends Pick<PluginDetailServiceParamsType, 'appId'> {
    pluginId?: PluginDetailServiceParamsType['pluginIds']
    parentPluginId?: PluginDetailServiceParamsType['parentPluginIds']
}

export interface PluginListFiltersType extends Pick<BaseFilterQueryParams<unknown>, 'searchKey'> {
    selectedTags: string[]
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

// TODO: Check if can deprecate this if have time
export interface PluginDetailType extends DetailedPluginVersionType {}
export type PluginListItemType = Pick<PluginDetailType, 'parentPluginId'>

interface BasePluginListContainerProps {
    availableTags: string[]
    handleUpdateAvailableTags: (tags: string[]) => void
    handlePluginSelection: (parentPluginId: PluginDetailType['parentPluginId']) => void
    pluginDataStore: PluginDataStoreType
    handlePluginDataStoreUpdate: (pluginStore: PluginDataStoreType) => void
    rootClassName?: string
    showCardBorder?: boolean
}

type PluginListType =
    | {
          persistFilters: true
          parentPluginList: PluginListItemType[]
          handleParentPluginListUpdate: (pluginList: PluginListItemType[]) => void
          parentTotalCount: number
          handleParentTotalCount: (totalCount: number) => void
          parentFilters: PluginListFiltersType
          handleUpdateParentFilters: (filters: PluginListFiltersType) => void
      }
    | {
          persistFilters: false
          parentPluginList?: never
          handleParentPluginListUpdate?: never
          parentTotalCount?: never
          handleParentTotalCount?: never
          parentFilters?: never
          handleUpdateParentFilters?: never
      }

export type PluginListContainerProps = BasePluginListContainerProps &
    PluginListType &
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
              selectedPluginsMap: Record<number, true>
          }
    )

export interface GetPluginStoreDataServiceParamsType extends Pick<PluginListFiltersType, 'searchKey' | 'selectedTags'> {
    signal: AbortSignal
    appId: number
    offset?: number
}

export interface GetPluginListPayloadType
    extends Pick<GetPluginStoreDataServiceParamsType, 'searchKey' | 'offset' | 'appId'> {
    tag: PluginListFiltersType['selectedTags']
    size: number
}

export interface GetPluginStoreDataReturnType {
    totalCount: number
    pluginStore: PluginDataStoreType
}

export interface PluginListParamsType {
    appId?: string
}

export interface PluginTagSelectProps extends Pick<BasePluginListContainerProps, 'availableTags'> {
    selectedTags: PluginListContainerProps['parentFilters']['selectedTags']
    isLoading: boolean
    hasError: boolean
    reloadTags: () => void
    handleUpdateSelectedTags: (tags: string[]) => void
}

export interface PluginListProps
    extends Pick<
        PluginListContainerProps,
        'pluginDataStore' | 'handlePluginSelection' | 'selectedPluginsMap' | 'isSelectable' | 'showCardBorder'
    > {
    handleDataUpdateForPluginResponse: (
        pluginResponse: Awaited<ReturnType<typeof getPluginStoreData>>,
        /**
         * If true, the response would be appended to the existing data
         * if false, the existing data would be replaced with the new data
         * @default false
         */
        appendResponse?: boolean,
    ) => void
    handleClearFilters: () => void
    pluginList: PluginListContainerProps['parentPluginList']
    totalCount: PluginListContainerProps['parentTotalCount']
    filters: PluginListContainerProps['parentFilters']
    getPluginStoreRef: MutableRefObject<AbortController>
}

export interface PluginCardProps
    extends Pick<PluginListProps, 'isSelectable' | 'pluginDataStore' | 'handlePluginSelection' | 'showCardBorder'> {
    parentPluginId: PluginDetailType['parentPluginId']
    isSelected: boolean
}

export interface PluginCardSkeletonListProps {
    /**
     * @default 3
     */
    count?: number
}

export interface PluginTagsContainerProps {
    tags: string[]
    rootClassName?: string
}

export interface PluginImageContainerProps extends Pick<ImageWithFallbackProps, 'imageProps'> {
    fallbackImageClassName?: string
}
