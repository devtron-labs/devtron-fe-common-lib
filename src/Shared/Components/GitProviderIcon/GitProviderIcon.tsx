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

import { GitProviderType } from '@Common/Constants'

import { Icon, IconName } from '../Icon'
import { GitProviderIconProps } from './types'

const gitProviderIconMap: Record<GitProviderType, IconName> = {
    [GitProviderType.GIT]: 'ic-git',
    [GitProviderType.GITHUB]: 'ic-github',
    [GitProviderType.GITLAB]: 'ic-gitlab',
    [GitProviderType.BITBUCKET]: 'ic-bitbucket',
    [GitProviderType.GITEA]: 'ic-git',
    [GitProviderType.AZURE]: 'ic-azure',
}

export const GitProviderIcon = ({ gitProvider, size = 20 }: GitProviderIconProps) => (
    <Icon name={gitProviderIconMap[gitProvider] || 'ic-git'} size={size} color={null} />
)
