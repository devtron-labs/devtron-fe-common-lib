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
