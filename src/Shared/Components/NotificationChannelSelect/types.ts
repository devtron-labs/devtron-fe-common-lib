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

import { ServerErrors } from '@Common/ServerError'

export enum NotificationChannelDestType {
    SLACK = 'slack',
    WEBHOOK = 'webhook',
    SES = 'ses',
    SMTP = 'smtp',
}

/**
 * A single configured destination, flattened out of the four provider-specific
 * lists that `GET notification/channel` returns.
 */
export interface NotificationChannelConfigType {
    configId: number
    dest: NotificationChannelDestType
    name: string
}

/**
 * Raw shape of a single entry in any of the four provider lists. Only the
 * fields common to all four are declared; the rest differ per provider and are
 * not needed to render a destination picker.
 */
interface NotificationChannelConfigDTO {
    id: number
    configName: string
}

export interface NotificationChannelConfigsDTO {
    slackConfigs?: NotificationChannelConfigDTO[]
    webhookConfigs?: NotificationChannelConfigDTO[]
    sesConfigs?: NotificationChannelConfigDTO[]
    smtpConfigs?: NotificationChannelConfigDTO[]
}

/**
 * A free-text email address typed into the picker rather than picked from the
 * configured channels. It is not a destination on its own — it still needs an
 * SES or SMTP account to be delivered through, which the caller collects
 * separately via `NotificationEmailAgentSelect`.
 */
export interface NotificationEmailRecipientType {
    recipient: string
}

/** Either a configured channel or a typed email address. */
export type NotificationDestinationType = NotificationChannelConfigType | NotificationEmailRecipientType

interface NotificationSelectCommonProps {
    /**
     * The channels to choose from, as returned by `getNotificationChannelConfigs`
     */
    options: NotificationChannelConfigType[]
    isLoading?: boolean
    optionListError?: ServerErrors
    reloadOptionList?: () => void
    required?: boolean
    error?: string
    label?: string
    placeholder?: string
    inputId?: string
}

export type NotificationChannelSelectProps = NotificationSelectCommonProps & {
    /**
     * Currently selected destinations
     */
    value: NotificationDestinationType[]
    onChange: (selected: NotificationDestinationType[]) => void
    /**
     * If true, a valid email address can be typed in to create a destination
     * that is not one of the configured channels.
     *
     * @default false
     */
    allowEmailRecipients?: boolean
}

export type NotificationEmailAgentSelectProps = NotificationSelectCommonProps & {
    /**
     * The SES/SMTP account typed email addresses are delivered through
     */
    value: NotificationChannelConfigType | null
    onChange: (selected: NotificationChannelConfigType) => void
    helperText?: string
}
