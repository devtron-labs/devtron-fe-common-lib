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
    ReactGA.event({
        category,
        action,
    })
}
