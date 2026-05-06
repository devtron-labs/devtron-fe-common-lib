import { ClusterStatusType } from '@Pages/ResourceBrowser'

export const getBulletColorAccToStatus = (status: ClusterStatusType) => {
    switch (status) {
        case ClusterStatusType.HEALTHY:
            return 'bcg-5'
        case ClusterStatusType.UNHEALTHY:
            return 'bcy-5'
        default:
            return 'bcr-5'
    }
}
