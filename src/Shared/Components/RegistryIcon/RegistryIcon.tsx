import { RegistryType } from '@Shared/types'

import { Icon, IconName } from '../Icon'
import { RegistryIconProps } from './types'

const registryIconMap: Record<RegistryType, IconName> = {
    [RegistryType.GIT]: 'ic-git',
    [RegistryType.GITHUB]: 'ic-github',
    [RegistryType.GITLAB]: 'ic-gitlab',
    [RegistryType.BITBUCKET]: 'ic-bitbucket',
    [RegistryType.DOCKER]: 'ic-dockerhub',
    [RegistryType.DOCKER_HUB]: 'ic-dockerhub',
    [RegistryType.ACR]: 'ic-azure',
    [RegistryType.QUAY]: 'ic-quay',
    [RegistryType.ECR]: 'ic-ecr',
    [RegistryType.ARTIFACT_REGISTRY]: 'ic-google-artifact-registry',
    [RegistryType.GCR]: 'ic-google-container-registry',
    [RegistryType.OTHER]: 'ic-container',
}

export const RegistryIcon = ({ registryType, size = 20 }: RegistryIconProps) => (
    <Icon name={registryIconMap[registryType] || 'ic-container'} size={size} color={null} />
)
