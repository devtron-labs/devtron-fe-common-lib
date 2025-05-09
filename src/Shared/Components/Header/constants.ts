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

import { DISCORD_LINK, DOCUMENTATION_HOME_PAGE, URLS } from '@Common/Constants'
import { CONTACT_SUPPORT_LINK, OPEN_NEW_TICKET, RAISE_ISSUE, VIEW_ALL_TICKETS } from '@Shared/constants'

import { ActionMenuItemType } from '../ActionMenu'
import { HelpMenuItems } from './types'

export const COMMON_HELP_ACTION_MENU_ITEMS: ActionMenuItemType[] = [
    ...((!window._env_?.K8S_CLIENT
        ? [
              {
                  label: 'Getting started',
                  value: HelpMenuItems.GETTING_STARTED,
                  startIcon: { name: 'ic-path', color: 'N600' },
                  componentType: 'link',
                  to: `/${URLS.GETTING_STARTED}`,
              },
          ]
        : []) satisfies ActionMenuItemType[]),
    {
        label: 'View documentation',
        value: HelpMenuItems.VIEW_DOCUMENTATION,
        startIcon: { name: 'ic-file', color: 'N600' },
        componentType: 'anchor',
        href: DOCUMENTATION_HOME_PAGE,
    },
    {
        label: 'Join discord community',
        value: HelpMenuItems.JOIN_DISCORD_COMMUNITY,
        startIcon: { name: 'ic-discord-fill', color: 'N600' },
        componentType: 'anchor',
        href: DISCORD_LINK,
    },
    {
        label: 'About Devtron',
        value: HelpMenuItems.ABOUT_DEVTRON,
        startIcon: { name: 'ic-devtron', color: 'N600' },
    },
]

export const OSS_HELP_ACTION_MENU_ITEMS: ActionMenuItemType[] = [
    {
        label: 'Chat with support',
        value: HelpMenuItems.CHAT_WITH_SUPPORT,
        componentType: 'anchor',
        href: CONTACT_SUPPORT_LINK,
        startIcon: { name: 'ic-chat-circle-dots', color: 'N600' },
    },
    {
        label: 'Raise an issue/request',
        value: HelpMenuItems.RAISE_ISSUE_REQUEST,
        startIcon: { name: 'ic-file-edit', color: 'N600' },
        componentType: 'anchor',
        href: RAISE_ISSUE,
    },
]

export const ENTERPRISE_TRIAL_HELP_ACTION_MENU_ITEMS: ActionMenuItemType[] = [
    {
        label: 'Request Support',
        value: HelpMenuItems.REQUEST_SUPPORT,
        startIcon: { name: 'ic-file-edit', color: 'N600' },
        componentType: 'anchor',
        href: OPEN_NEW_TICKET,
    },
]

export const ENTERPRISE_HELP_ACTION_MENU_ITEMS: ActionMenuItemType[] = [
    {
        label: 'Open new ticket',
        value: HelpMenuItems.OPEN_NEW_TICKET,
        startIcon: { name: 'ic-file-edit', color: 'N600' },
        componentType: 'anchor',
        href: OPEN_NEW_TICKET,
    },
    {
        label: 'View all tickets',
        value: HelpMenuItems.VIEW_ALL_TICKETS,
        startIcon: { name: 'ic-files', color: 'N600' },
        componentType: 'anchor',
        href: VIEW_ALL_TICKETS,
    },
    {
        label: 'Give feedback',
        value: HelpMenuItems.GIVE_FEEDBACK,
        startIcon: { name: 'ic-megaphone-right', color: 'N600' },
    },
]
