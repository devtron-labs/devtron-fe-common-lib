import { ResponseType } from '../../Common'
import { clusterListData } from './mock'
import { ClusterType } from './types'

export const getClusterList = async (): Promise<ResponseType<ClusterType[]>> =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 200,
                result: clusterListData,
                status: '',
                errors: [],
            })
        }, 1000)
    })
