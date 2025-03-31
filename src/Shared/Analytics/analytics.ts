import { get } from '@Common/API'
import { ROUTES } from '@Common/Constants'
import { ServerAnalyticsEventType } from './types'

export const handleSendAnalyticsEventToServer = async (eventType: ServerAnalyticsEventType) => {
    try {
        await get(`${ROUTES.DASHBOARD_EVENT}/${eventType}`)
    } catch {
        // Do nothing
    }
}
