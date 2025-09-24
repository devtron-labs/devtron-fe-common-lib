import { Icon } from '../Icon'
import { ClusterStatusIconProps } from './types'
import { getBulletColorAccToStatus } from './utils'

const ClusterStatusIcon = ({ clusterStatus, isVirtualCluster }: ClusterStatusIconProps) => {
    const statusColor = getBulletColorAccToStatus(clusterStatus)
    return (
        <span className="dc__position-rel dc__overflow-hidden icon-dim-24">
            <Icon name="ic-bg-cluster" color={null} size={24} />
            {!isVirtualCluster && (
                <span
                    className={`dc__position-abs dc__top-16 icon-dim-10 dc__border-radius-50-per dc__right-2--neg ${statusColor}`}
                    style={{ border: '2px solid var(--N0)' }}
                />
            )}
        </span>
    )
}

export default ClusterStatusIcon
