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

import { IconName } from '../Icon'

export const isAWSCodeCommitURL = (url: string = ''): boolean =>
    url.includes('git-codecommit.') && url.includes('.amazonaws.com')

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
    if (repoUrl.includes(GitProviderType.AZURE)) {
        return 'ic-azure'
    }
    if (repoUrl.includes(GitProviderType.GITEA)) {
        return 'ic-gitea'
    }
    if (isAWSCodeCommitURL(repoUrl)) {
        return 'ic-aws-codecommit'
    }

    return 'ic-git'
}
