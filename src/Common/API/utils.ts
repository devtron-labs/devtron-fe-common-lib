import { ServerErrors } from '@Common/ServerError'
import { MutableRefObject } from 'react'
import { URLS } from '@Common/Constants'
import { RESPONSE_MESSAGES } from './constants'

export const handleServerError = async (contentType: string, response: Response) => {
    // Test for HTTP Status Code
    const code = response.status
    let status: string = response.statusText || RESPONSE_MESSAGES[code]
    const serverError = new ServerErrors({ code, errors: [] })
    if (contentType !== 'application/json') {
        // used for better debugging,
        status = `${RESPONSE_MESSAGES[code]}. Please try again.`
    } else {
        const responseBody = await response.json()
        if (responseBody.errors) {
            serverError.errors = responseBody.errors
        }
    }
    serverError.errors =
        serverError.errors.length > 0 ? serverError.errors : [{ code, internalMessage: status, userMessage: status }]
    throw serverError
}

/**
 * Aborts the previous request before triggering next request
 */
export const abortPreviousRequests = <T>(
    callback: () => Promise<T>,
    abortControllerRef: MutableRefObject<AbortController>,
): Promise<T> => {
    abortControllerRef.current.abort()
    // eslint-disable-next-line no-param-reassign
    abortControllerRef.current = new AbortController()
    return callback()
}

/**
 * Returns true if the error is due to a aborted request
 */
export const getIsRequestAborted = (error) =>
    // The 0 code is common for aborted and blocked requests
    error && error.code === 0 && error.message.search('abort|aborted') > -1

export const handleDashboardLogout = () => {
    const continueParam = `${window.location.pathname.replace(window.__BASE_URL__, '')}${window.location.search}`
    window.location.href = `${window.location.origin}${window.__BASE_URL__}${URLS.LOGIN_SSO}?continue=${continueParam}`
}
