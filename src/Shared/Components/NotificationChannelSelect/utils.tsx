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

import { Icon } from '@Shared/Components/Icon'

import { SelectPickerOptionType } from '../SelectPicker'
import {
    NOTIFICATION_CHANNEL_DEST_ICON_MAP,
    NOTIFICATION_CHANNEL_DEST_LABEL_MAP,
    NOTIFICATION_CHANNEL_DEST_ORDER,
    NOTIFICATION_EMAIL_RECIPIENT_KEY_PREFIX,
} from './constants'
import {
    NotificationChannelConfigType,
    NotificationChannelDestType,
    NotificationDestinationType,
    NotificationEmailRecipientType,
} from './types'

/**
 * A destination is identified by the (dest, configId) pair — config ids are only
 * unique within a provider, so `7` means different things for slack and webhook.
 */
export const getNotificationChannelKey = ({
    dest,
    configId,
}: Pick<NotificationChannelConfigType, 'dest' | 'configId'>) => `${dest}-${configId}`

export const getNotificationChannelStartIcon = (dest: NotificationChannelDestType) => (
    <Icon name={NOTIFICATION_CHANNEL_DEST_ICON_MAP[dest] ?? 'ic-email'} color={null} />
)

const getOptionFromConfig = (config: NotificationChannelConfigType): SelectPickerOptionType<string> => ({
    label: config.name,
    value: getNotificationChannelKey(config),
    startIcon: getNotificationChannelStartIcon(config.dest),
})

/**
 * Groups the flat config list by provider so the menu reads as
 * "Webhook > Google Chat", "Slack > #alerts", etc. `destOrder` both orders and
 * narrows the groups, so a caller can show only the email providers.
 */
export const getNotificationChannelGroupedOptions = (
    configs: NotificationChannelConfigType[],
    destOrder: NotificationChannelDestType[] = NOTIFICATION_CHANNEL_DEST_ORDER,
) =>
    destOrder.reduce<{ label: string; options: SelectPickerOptionType<string>[] }[]>((acc, dest) => {
        const options = configs.filter((config) => config.dest === dest).map(getOptionFromConfig)

        if (options.length) {
            acc.push({ label: NOTIFICATION_CHANNEL_DEST_LABEL_MAP[dest], options })
        }

        return acc
    }, [])

/**
 * A typed email address carries only the address; a channel carries the config
 * it was picked from. That difference is what tells the two apart everywhere.
 */
export const isNotificationEmailRecipient = (
    destination: NotificationDestinationType,
): destination is NotificationEmailRecipientType => 'recipient' in destination

/** Unique select-option value for either kind of destination. */
export const getNotificationDestinationKey = (destination: NotificationDestinationType) =>
    isNotificationEmailRecipient(destination)
        ? `${NOTIFICATION_EMAIL_RECIPIENT_KEY_PREFIX}${destination.recipient}`
        : getNotificationChannelKey(destination)

/** How a destination reads in a chip or a selected option. */
export const getNotificationDestinationLabel = (destination: NotificationDestinationType) =>
    isNotificationEmailRecipient(destination) ? destination.recipient : destination.name

export const getNotificationDestinationIcon = (destination: NotificationDestinationType) =>
    getNotificationChannelStartIcon(
        isNotificationEmailRecipient(destination) ? NotificationChannelDestType.SES : destination.dest,
    )
