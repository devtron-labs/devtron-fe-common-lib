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

export { NOTIFICATION_CHANNEL_DEST_ICON_MAP, NOTIFICATION_CHANNEL_DEST_LABEL_MAP } from './constants'
export { default as NotificationChannelSelect } from './NotificationChannelSelect.component'
export { default as NotificationEmailAgentSelect } from './NotificationEmailAgentSelect.component'
export { getNotificationChannelConfigs } from './service'
export type {
    NotificationChannelConfigsDTO,
    NotificationChannelConfigType,
    NotificationChannelSelectProps,
    NotificationDestinationType,
    NotificationEmailAgentSelectProps,
    NotificationEmailRecipientType,
} from './types'
export { NotificationChannelDestType } from './types'
export {
    getNotificationChannelKey,
    getNotificationChannelStartIcon,
    getNotificationDestinationIcon,
    getNotificationDestinationKey,
    getNotificationDestinationLabel,
    isNotificationEmailRecipient,
} from './utils'
