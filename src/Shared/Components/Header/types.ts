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

import { InstallationType, ModuleStatus } from '@Shared/types'

import { ResponseType, TippyCustomizedProps } from '../../../Common'
import { ActionMenuProps } from '../ActionMenu'
import { DOCUMENTATION } from '../DocLink'

export interface PageHeaderType {
    headerName?: string
    headerImage?: string
    showTabs?: boolean
    additionalHeaderInfo?: () => JSX.Element
    renderHeaderTabs?: () => JSX.Element
    isBreadcrumbs?: boolean
    breadCrumbs?: () => JSX.Element
    renderActionButtons?: () => JSX.Element
    tippyProps?: Pick<TippyCustomizedProps<false>, 'additionalContent'> & {
        isTippyCustomized?: boolean
        tippyRedirectLink?: keyof typeof DOCUMENTATION
        TippyIcon?: React.FunctionComponent<any>
        tippyMessage?: string
        onClickTippyButton?: () => void
    }
    onClose?: () => void
    closeIcon?: JSX.Element
}

export interface ServerInfo {
    currentVersion: string
    status: ModuleStatus
    releaseName: string
    installationType: InstallationType
}

export interface ServerInfoResponse extends ResponseType {
    result?: ServerInfo
}

export interface HelpButtonProps {
    serverInfo: ServerInfo
    fetchingServerInfo: boolean
    onClick: () => void
    hideGettingStartedCard: () => void
}

export enum HelpMenuItems {
    GETTING_STARTED = 'getting-started',
    VIEW_DOCUMENTATION = 'view-documentation',
    JOIN_DISCORD_COMMUNITY = 'join-discord-community',
    ABOUT_DEVTRON = 'about-devtron',
    REQUEST_SUPPORT = 'request-support',
    OPEN_NEW_TICKET = 'open-new-ticket',
    VIEW_ALL_TICKETS = 'view-all-tickets',
    GIVE_FEEDBACK = 'give-feedback',
    CHAT_WITH_SUPPORT = 'chat-with-support',
    RAISE_ISSUE_REQUEST = 'raise-issue-request',
    DEVTRON_GPT = 'devtron-gpt',
}

export type HelpButtonActionMenuProps = ActionMenuProps<HelpMenuItems>

export interface ProfileMenuProps {
    user: string
    onClick?: () => void
}
