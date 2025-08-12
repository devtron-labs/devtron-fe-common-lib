/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    [RegistryType.OTHER]: 'ic-container-registry',
}

const getRegistryUrlIconName = (registryUrl: string): IconName => {
    if (registryUrl.includes(RegistryType.ECR)) {
        return registryIconMap[RegistryType.ECR]
    }
    if (registryUrl.includes(RegistryType.GCR)) {
        return registryIconMap[RegistryType.GCR]
    }
    if (registryUrl.includes(RegistryType.DOCKER_HUB) || registryUrl.includes(RegistryType.DOCKER)) {
        return registryIconMap[RegistryType.DOCKER_HUB]
    }
    if (registryUrl.includes(RegistryType.QUAY)) {
        return registryIconMap[RegistryType.QUAY]
    }
    if (registryUrl.includes(RegistryType.GITLAB)) {
        return registryIconMap[RegistryType.GITLAB]
    }
    if (registryUrl.includes(RegistryType.GITHUB)) {
        return registryIconMap[RegistryType.GITHUB]
    }
    if (registryUrl.includes(RegistryType.BITBUCKET)) {
        return registryIconMap[RegistryType.BITBUCKET]
    }
    if (registryUrl.includes(RegistryType.ACR)) {
        return registryIconMap[RegistryType.ACR]
    }
    if (registryUrl.includes(RegistryType.ARTIFACT_REGISTRY)) {
        return registryIconMap[RegistryType.ARTIFACT_REGISTRY]
    }

    if (registryUrl.includes(RegistryType.QUAY)) {
        return registryIconMap[RegistryType.QUAY]
    }
    return 'ic-container-registry'
}

export const RegistryIcon = ({ registryType, size = 20, registryUrl }: RegistryIconProps) => (
    <Icon
        name={registryType ? registryIconMap[registryType] : getRegistryUrlIconName(registryUrl)}
        size={size}
        color={null}
    />
)
