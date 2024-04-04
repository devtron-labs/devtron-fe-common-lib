import { updatePostHogEvent } from './service'
import { LOGIN_COUNT } from '../../../Common'

const millisecondsInDay = 86400000
export const getDateInMilliseconds = (days) => 1 + new Date().valueOf() + (days ?? 0) * millisecondsInDay

export const handlePostHogEventUpdate = async (e, eventName?: string): Promise<void> => {
    const payload = {
        eventType: eventName || e.target?.dataset.posthog,
        key: LOGIN_COUNT,
        value: '',
        active: true,
    }
    await updatePostHogEvent(payload)
}

export const setActionWithExpiry = (key: string, days: number): void => {
    localStorage.setItem(key, `${getDateInMilliseconds(days)}`)
}
