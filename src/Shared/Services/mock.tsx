import { ClusterType } from './types'

export const clusterListData: ClusterType[] = Array.from(Array(10).keys()).map((id) => ({
    id,
    name: `cluster-${id}`,
}))
