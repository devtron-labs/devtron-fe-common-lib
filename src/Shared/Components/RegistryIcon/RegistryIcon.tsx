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
    if (!registryUrl) return 'ic-container-registry'

    const registryTypesToCheck: RegistryType[] = [
        RegistryType.ECR,
        RegistryType.GCR,
        RegistryType.DOCKER_HUB,
        RegistryType.DOCKER,
        RegistryType.QUAY,
        RegistryType.GITLAB,
        RegistryType.GITHUB,
        RegistryType.BITBUCKET,
        RegistryType.ACR,
        RegistryType.ARTIFACT_REGISTRY,
    ]

    const matchedType = registryTypesToCheck.find((type) => registryUrl.includes(type))

    if (!matchedType) return 'ic-container-registry'

    // Special case for Docker/DockerHub
    return matchedType === RegistryType.DOCKER ? registryIconMap[RegistryType.DOCKER_HUB] : registryIconMap[matchedType]
}

export const RegistryIcon = ({ registryType, size = 20, registryUrl }: RegistryIconProps) => (
    <Icon
        name={registryType ? registryIconMap[registryType] : getRegistryUrlIconName(registryUrl)}
        size={size}
        color={null}
    />
)
