import { NodeType, Nodes } from '../../Shared'

export interface GVKType {
    Group: string
    Version: string
    Kind: Nodes | NodeType
}

export interface ApiResourceGroupType {
    gvk: GVKType
    namespaced: boolean
    isGrouped?: boolean
}

export interface ApiResourceType {
    apiResources: ApiResourceGroupType[]
    allowedAll: boolean
}

export interface K8SObjectBaseType {
    name: string
    isExpanded: boolean
}

export interface K8SObjectType extends K8SObjectBaseType {
    child: ApiResourceGroupType[]
}
