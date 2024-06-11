import { getUrlWithSearchParams } from '../../Common'
import { ResourceKindType, ResourceVersionType } from '../types'

export interface ClusterType {
    id: number
    name: string
    /**
     * If true, denotes virtual cluster
     */
    isVirtual: boolean
}

export interface GetResourceApiUrlProps<T> {
    baseUrl: string
    kind: ResourceKindType
    version: ResourceVersionType
    queryParams?: T extends Parameters<typeof getUrlWithSearchParams>[1] ? T : never
}
