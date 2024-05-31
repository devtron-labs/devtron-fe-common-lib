import { clusterListData } from './mock'
import { ClusterType } from './types'

export const getClusterList = async (): Promise<ClusterType[]> =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(clusterListData)
        }, 1000)
    })
