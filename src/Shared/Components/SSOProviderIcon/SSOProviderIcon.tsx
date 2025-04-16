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

import { SSOProvider } from '@Common/Constants'

import { Icon, IconName } from '../Icon'
import { SSOProviderIconProps } from './types'

const ssoProviderIconMap: Record<SSOProvider, IconName> = {
    [SSOProvider.google]: 'ic-google',
    [SSOProvider.github]: 'ic-github',
    [SSOProvider.gitlab]: 'ic-gitlab',
    [SSOProvider.ldap]: 'ic-ldap',
    [SSOProvider.microsoft]: 'ic-microsoft',
    [SSOProvider.oidc]: 'ic-oidc',
    [SSOProvider.openshift]: 'ic-openshift',
}

export const SSOProviderIcon = ({ provider, size = 20 }: SSOProviderIconProps) => (
    <Icon name={ssoProviderIconMap[provider]} size={size} color={null} />
)
