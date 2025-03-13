import { GitProviderType } from '@Common/Constants'
import { IconName } from '../Icon'

export const getGitIconName = (repoUrl: string): IconName => {
    if (repoUrl.includes(GitProviderType.GITHUB)) {
        return 'ic-github'
    }
    if (repoUrl.includes(GitProviderType.GITLAB)) {
        return 'ic-gitlab'
    }
    if (repoUrl.includes(GitProviderType.BITBUCKET)) {
        return 'ic-bitbucket'
    }
    return 'ic-git'
}
