import { stringComparatorBySortOrder } from '../Helpers'
import { clusterListData } from './mock'
import { ClusterType } from './types'

export const getClusterList = async (): Promise<ClusterType[]> =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(clusterListData.sort((a, b) => stringComparatorBySortOrder(a.name, b.name)))
        }, 1000)
    })
