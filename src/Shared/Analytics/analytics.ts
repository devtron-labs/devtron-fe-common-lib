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

import ReactGA from 'react-ga4'
import { UaEventOptions } from 'react-ga4/types/ga4'

import { get } from '@Common/API'
import { ROUTES } from '@Common/Constants'

import { ServerAnalyticsEventType } from './types'

export const handleSendAnalyticsEventToServer = async (
    eventType: ServerAnalyticsEventType,
    preventLicenseRedirect?: boolean,
) => {
    try {
        await get(`${ROUTES.DASHBOARD_EVENT}/${eventType}`, { preventLicenseRedirect })
    } catch {
        // Do nothing
    }
}

export const handleAnalyticsEvent = ({ category, action }: Pick<UaEventOptions, 'category' | 'action'>) => {
    if (window._env_.GA_ENABLED && ReactGA?.event)
        ReactGA.event({
            category,
            action,
        })
}
