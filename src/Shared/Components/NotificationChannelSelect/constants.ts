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

import { IconsProps } from '@Shared/Components/Icon'

import { NotificationChannelDestType } from './types'

export const NOTIFICATION_CHANNEL_DEST_LABEL_MAP: Record<NotificationChannelDestType, string> = {
    [NotificationChannelDestType.SLACK]: 'Slack',
    [NotificationChannelDestType.WEBHOOK]: 'Webhook',
    [NotificationChannelDestType.SES]: 'Email (SES)',
    [NotificationChannelDestType.SMTP]: 'Email (SMTP)',
}

export const NOTIFICATION_CHANNEL_DEST_ICON_MAP: Record<NotificationChannelDestType, IconsProps['name']> = {
    [NotificationChannelDestType.SLACK]: 'ic-slack',
    [NotificationChannelDestType.WEBHOOK]: 'ic-webhook',
    [NotificationChannelDestType.SES]: 'ic-email',
    [NotificationChannelDestType.SMTP]: 'ic-email',
}

/**
 * Order the groups are rendered in. Webhook first since it is the destination
 * audit log rules are most commonly pointed at.
 */
export const NOTIFICATION_CHANNEL_DEST_ORDER: NotificationChannelDestType[] = [
    NotificationChannelDestType.WEBHOOK,
    NotificationChannelDestType.SLACK,
    NotificationChannelDestType.SES,
    NotificationChannelDestType.SMTP,
]

/**
 * Prefix that marks a select option as a typed email address rather than a
 * configured channel, so the two can share one option list.
 */
export const NOTIFICATION_EMAIL_RECIPIENT_KEY_PREFIX = 'email:'

/** The providers a typed email address can be delivered through. */
export const NOTIFICATION_EMAIL_AGENT_DEST_ORDER: NotificationChannelDestType[] = [
    NotificationChannelDestType.SES,
    NotificationChannelDestType.SMTP,
]

/**
 * Destinations offered when email addresses are typed in instead of picked:
 * the SES/SMTP accounts then belong to `NotificationEmailAgentSelect`, which
 * asks which account to deliver those addresses through, so offering them here
 * as well would ask the same question twice.
 */
export const NOTIFICATION_NON_EMAIL_DEST_ORDER: NotificationChannelDestType[] = NOTIFICATION_CHANNEL_DEST_ORDER.filter(
    (dest) => !NOTIFICATION_EMAIL_AGENT_DEST_ORDER.includes(dest),
)
