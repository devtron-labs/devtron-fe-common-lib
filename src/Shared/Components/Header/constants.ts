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
                  id: HelpMenuItems.GETTING_STARTED,
                  label: 'Getting started',
                  startIcon: { name: 'ic-path' },
                  componentType: 'link',
                  to: `/${URLS.GETTING_STARTED}`,
              },
          ]
        : []) satisfies ActionMenuItemType[]),
    {
        id: HelpMenuItems.VIEW_DOCUMENTATION,
        label: 'View documentation',
        startIcon: { name: 'ic-book-open' },
        componentType: 'anchor',
        href: DOCUMENTATION_HOME_PAGE,
    },
    {
        id: HelpMenuItems.JOIN_DISCORD_COMMUNITY,
        label: 'Join discord community',
        startIcon: { name: 'ic-discord-fill' },
        componentType: 'anchor',
        href: DISCORD_LINK,
    },
    {
        id: HelpMenuItems.ABOUT_DEVTRON,
        label: 'About Devtron',
        startIcon: { name: 'ic-devtron' },
    },
]

export const OSS_HELP_ACTION_MENU_ITEMS: ActionMenuItemType[] = [
    {
        id: HelpMenuItems.CHAT_WITH_SUPPORT,
        label: 'Chat with support',
        componentType: 'anchor',
        href: DISCORD_LINK,
        startIcon: { name: 'ic-chat-circle-online' },
    },
    {
        id: HelpMenuItems.RAISE_ISSUE_REQUEST,
        label: 'Raise an issue/request',
        startIcon: { name: 'ic-file-edit' },
        componentType: 'anchor',
        href: RAISE_ISSUE,
    },
]

export const ENTERPRISE_TRIAL_HELP_ACTION_MENU_ITEMS: ActionMenuItemType[] = [
    {
        id: HelpMenuItems.REQUEST_SUPPORT,
        label: 'Request Support',
        startIcon: { name: 'ic-file-edit' },
        componentType: 'anchor',
        href: CONTACT_SUPPORT_LINK,
    },
]

export const ENTERPRISE_HELP_ACTION_MENU_ITEMS: ActionMenuItemType[] = [
    {
        id: HelpMenuItems.OPEN_NEW_TICKET,
        label: 'Open new ticket',
        startIcon: { name: 'ic-edit' },
        componentType: 'anchor',
        href: OPEN_NEW_TICKET,
    },
    {
        id: HelpMenuItems.VIEW_ALL_TICKETS,
        label: 'View all tickets',
        startIcon: { name: 'ic-files' },
        componentType: 'anchor',
        href: VIEW_ALL_TICKETS,
    },
    {
        id: HelpMenuItems.GIVE_FEEDBACK,
        label: 'Give feedback',
        startIcon: { name: 'ic-megaphone-right' },
    },
]
