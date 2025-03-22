import { API_STATUS_CODES, APIOptions, FALLBACK_REQUEST_TIMEOUT, Host, noop, ResponseType, ServerErrors } from '..'
import { CoreAPIConstructorParamsType, FetchAPIParamsType, FetchInTimeParamsType } from './types'
import { handleServerError } from './utils'

class CoreAPI {
    handleLogout: () => void

    handleRedirectToLicenseActivation?: () => void

    host: string

    timeout: number

    constructor({ handleLogout, host, timeout, handleRedirectToLicenseActivation }: CoreAPIConstructorParamsType) {
        this.handleLogout = handleLogout
        this.host = host || Host
        this.timeout = timeout || FALLBACK_REQUEST_TIMEOUT
        this.handleRedirectToLicenseActivation = handleRedirectToLicenseActivation || noop
    }

    private fetchAPI = async <K = object>({
        url,
        type,
        data,
        signal,
        preventAutoLogout = false,
        preventLicenseRedirect = false,
        shouldParseServerErrorForUnauthorizedUser = false,
        isMultipartRequest,
    }: FetchAPIParamsType<K>): Promise<ResponseType> => {
        const options: RequestInit = {
            method: type,
            signal,
            body: data ? JSON.stringify(data) : undefined,
        }
        // eslint-disable-next-line dot-notation
        options['credentials'] = 'include' as RequestCredentials
        return fetch(
            `${this.host}/${url}`,
            !isMultipartRequest
                ? options
                : ({
                      method: type,
                      body: data,
                  } as RequestInit),
        ).then(
            // eslint-disable-next-line consistent-return
            async (response) => {
                const isLicenseInvalid = response.headers.get('X-License-Status') === 'inValid'

                if (isLicenseInvalid && !preventLicenseRedirect) {
                    this.handleRedirectToLicenseActivation()

                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve({ code: API_STATUS_CODES.UNAUTHORIZED, status: 'Unauthorized', result: [] })
                        }, 1000)
                    })
                }

                const contentType = response.headers.get('Content-Type')
                if (response.status === API_STATUS_CODES.UNAUTHORIZED) {
                    if (preventAutoLogout) {
                        if (shouldParseServerErrorForUnauthorizedUser) {
                            await handleServerError(contentType, response)
                            // Won't reach here as handleServerError will throw an error
                            return null
                        }
                        throw new ServerErrors({
                            code: API_STATUS_CODES.UNAUTHORIZED,
                            errors: [
                                {
                                    code: API_STATUS_CODES.UNAUTHORIZED,
                                    internalMessage: 'Please login again',
                                    userMessage: 'Please login again',
                                },
                            ],
                        })
                    } else {
                        this.handleLogout()
                        // Using this way to ensure that the user is redirected to the login page
                        // and the component has enough time to get unmounted otherwise the component re-renders
                        // and try to access some property of a variable and log exception to sentry
                        // FIXME: Fix this later after analyzing impact
                        // eslint-disable-next-line no-return-await
                        return await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve({ code: API_STATUS_CODES.UNAUTHORIZED, status: 'Unauthorized', result: [] })
                            }, 1000)
                        })
                    }
                } else if (response.status >= 300 && response.status <= 599) {
                    // FIXME: Fix this later after analyzing impact
                    // eslint-disable-next-line no-return-await
                    return await handleServerError(contentType, response)
                } else {
                    if (contentType === 'application/json') {
                        return response.json().then((responseBody) => {
                            if (responseBody.code >= 300 && responseBody.code <= 599) {
                                // Test Code in Response Body, despite successful HTTP Response Code
                                throw new ServerErrors({ code: responseBody.code, errors: responseBody.errors })
                            } else {
                                // Successful Response. Expected Response Type {code, result, status}
                                return responseBody
                            }
                        })
                    }
                    if (contentType === 'octet-stream' || contentType === 'application/octet-stream') {
                        // used in getArtifact() API only
                        return response
                    }
                }
            },
            (error) => {
                // Network call fails. Handle Failed to Fetch
                const err = {
                    code: 0,
                    userMessage: error.message,
                    internalMessage: error.message,
                    moreInfo: error.message,
                }
                throw new ServerErrors({ code: 0, errors: [err] })
            },
        )
    }

    private fetchInTime = <T = object>({
        url,
        type,
        data,
        options,
        isMultipartRequest,
    }: FetchInTimeParamsType<T>): Promise<ResponseType> => {
        const controller = options?.abortControllerRef?.current ?? new AbortController()
        const signal = options?.abortControllerRef?.current?.signal || options?.signal || controller.signal
        const timeoutPromise: Promise<ResponseType> = new Promise((resolve, reject) => {
            const timeout = options?.timeout || this.timeout

            setTimeout(() => {
                controller.abort()
                if (options?.abortControllerRef?.current) {
                    // eslint-disable-next-line no-param-reassign
                    options.abortControllerRef.current = new AbortController()
                }

                // Note: This is not catered in case abortControllerRef is passed since
                // the API is rejected with abort signal from line 202
                // FIXME: Remove once signal is removed
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({
                    code: API_STATUS_CODES.REQUEST_TIMEOUT,
                    errors: [
                        {
                            code: API_STATUS_CODES.REQUEST_TIMEOUT,
                            internalMessage: 'Request cancelled',
                            userMessage: 'Request Cancelled',
                        },
                    ],
                })
            }, timeout)
        })
        return Promise.race([
            this.fetchAPI({
                url,
                type,
                data,
                signal,
                preventAutoLogout: options?.preventAutoLogout || false,
                preventLicenseRedirect: options?.preventLicenseRedirect || false,
                shouldParseServerErrorForUnauthorizedUser: options?.shouldParseServerErrorForUnauthorizedUser,
                isMultipartRequest,
            }),
            timeoutPromise,
        ]).catch((err) => {
            if (err instanceof ServerErrors) {
                throw err
            } else {
                // FIXME: Can be removed once signal is removed
                throw new ServerErrors({
                    code: API_STATUS_CODES.REQUEST_TIMEOUT,
                    errors: [
                        {
                            code: API_STATUS_CODES.REQUEST_TIMEOUT,
                            internalMessage: 'That took longer than expected.',
                            userMessage: 'That took longer than expected.',
                        },
                    ],
                })
            }
        })
    }

    post = <T = any, K = object>(
        url: string,
        data: K,
        options?: APIOptions,
        isMultipartRequest?: boolean,
    ): Promise<ResponseType<T>> => this.fetchInTime<K>({ url, type: 'POST', data, options, isMultipartRequest })

    put = <T = any, K = object>(url: string, data: K, options?: APIOptions): Promise<ResponseType<T>> =>
        this.fetchInTime<K>({ url, type: 'PUT', data, options })

    patch = <T = any, K = object>(url: string, data: K, options?: APIOptions): Promise<ResponseType<T>> =>
        this.fetchInTime<K>({ url, type: 'PATCH', data, options })

    get = <T = any>(url: string, options?: APIOptions): Promise<ResponseType<T>> =>
        this.fetchInTime({ url, type: 'GET', data: null, options })

    trash = <T = any, K = object>(url: string, data?: K, options?: APIOptions): Promise<ResponseType<T>> =>
        this.fetchInTime<K>({ url, type: 'DELETE', data, options })
}

export default CoreAPI
