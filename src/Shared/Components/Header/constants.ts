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

import { CONTACT_SUPPORT_LINK, OPEN_NEW_TICKET, RAISE_ISSUE, VIEW_ALL_TICKETS } from '@Shared/constants'

import { ReactComponent as Chat } from '../../../Assets/Icon/ic-chat-circle-dots.svg'
import { ReactComponent as EditFile } from '../../../Assets/Icon/ic-edit-file.svg'
import { ReactComponent as Files } from '../../../Assets/Icon/ic-files.svg'
import { DISCORD_LINK } from '../../../Common'
import { HelpOptionType } from './types'

export const EnterpriseHelpOptions: HelpOptionType[] = [
    {
        name: 'Open new ticket',
        link: OPEN_NEW_TICKET,
        icon: EditFile,
    },
    {
        name: 'View all tickets',
        link: VIEW_ALL_TICKETS,
        icon: Files,
    },
]

export const OSSHelpOptions: HelpOptionType[] = [
    {
        name: 'Chat with support',
        link: DISCORD_LINK,
        icon: Chat,
    },

    {
        name: 'Raise an issue/request',
        link: RAISE_ISSUE,
        icon: EditFile,
    },
]

export const TrialHelpOptions: HelpOptionType[] = [
    {
        name: 'Request Support',
        link: CONTACT_SUPPORT_LINK,
        icon: EditFile,
    },
]
