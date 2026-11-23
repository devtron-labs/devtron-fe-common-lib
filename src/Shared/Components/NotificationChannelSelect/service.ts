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

import { get, ROUTES } from '../../../Common'
import { stringComparatorBySortOrder } from '../../Helpers'
import { NotificationChannelConfigsDTO, NotificationChannelConfigType, NotificationChannelDestType } from './types'

const DEST_TO_DTO_KEY_MAP: Record<NotificationChannelDestType, keyof NotificationChannelConfigsDTO> = {
    [NotificationChannelDestType.SLACK]: 'slackConfigs',
    [NotificationChannelDestType.WEBHOOK]: 'webhookConfigs',
    [NotificationChannelDestType.SES]: 'sesConfigs',
    [NotificationChannelDestType.SMTP]: 'smtpConfigs',
}

/**
 * Fetches every configured notification destination and flattens the four
 * provider-specific lists into a single list, so callers can render one picker
 * instead of four.
 */
export const getNotificationChannelConfigs = async (signal?: AbortSignal): Promise<NotificationChannelConfigType[]> => {
    const { result } = await get<NotificationChannelConfigsDTO>(`${ROUTES.NOTIFIER}/channel`, { signal })

    return Object.values(NotificationChannelDestType).flatMap((dest) =>
        (result?.[DEST_TO_DTO_KEY_MAP[dest]] ?? [])
            .map<NotificationChannelConfigType>(({ id, configName }) => ({
                configId: id,
                dest,
                name: configName || '',
            }))
            .sort((a, b) => stringComparatorBySortOrder(a.name, b.name)),
    )
}
