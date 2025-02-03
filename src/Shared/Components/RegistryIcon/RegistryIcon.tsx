import { RegistryType } from '@Shared/types'

import { Icon, IconName } from '../Icon'
import { RegistryIconProps } from './types'

const getRegistryIcon = (registryType: RegistryType): IconName => {
    switch (registryType) {
        case RegistryType.GIT:
            return 'ic-git'
        case RegistryType.GITHUB:
            return 'ic-github'
        case RegistryType.GITLAB:
            return 'ic-gitlab'
        case RegistryType.BITBUCKET:
            return 'ic-bitbucket'
        case RegistryType.DOCKER:
        case RegistryType.DOCKER_HUB:
            return 'ic-dockerhub'
        case RegistryType.ACR:
            return 'ic-azure'
        case RegistryType.QUAY:
            return 'ic-quay'
        case RegistryType.ECR:
            return 'ic-ecr'
        case RegistryType.ARTIFACT_REGISTRY:
            return 'ic-google-artifact-registry'
        case RegistryType.GCR:
            return 'ic-google-container-registry'
        default:
            return 'ic-container'
    }
}

export const RegistryIcon = ({ registryType, size = 20 }: RegistryIconProps) => (
    <Icon name={getRegistryIcon(registryType)} size={size} color={null} />
)
