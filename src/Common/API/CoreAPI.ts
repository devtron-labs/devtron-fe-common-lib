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

import { API_STATUS_CODES, FALLBACK_REQUEST_TIMEOUT, Host, SERVICE_PATHS } from '@Common/Constants'
import { noop } from '@Common/Helper'
import { ServerErrors } from '@Common/ServerError'
import { APIOptions, ResponseType } from '@Common/Types'
import { INVALID_LICENSE_KEY } from '@Shared/constants'
import { ResponseHeaders } from '@Shared/types'

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

    /**
     * Constructs the final URL by detecting service paths and applying appropriate routing
     * @param url - The endpoint URL
     * @returns The final URL with correct base path
     */
    private constructUrl = (url: string): string => {
        // Check if URL starts with a known service path
        const isServicePath = Object.values(SERVICE_PATHS).some(
            (servicePath) => url.startsWith(`${servicePath}/`) || url.startsWith(`/${servicePath}/`),
        )

        // Check if it's a non-orchestrator service path
        const isNonOrchestratorService =
            isServicePath && !url.startsWith('orchestrator/') && !url.startsWith('/orchestrator/')

        if (isNonOrchestratorService) {
            // For service paths like 'athena/', use as-is but ensure single leading slash
            return url.startsWith('/') ? url : `/${url}`
        }
        // For orchestrator paths or relative paths, add Host prefix
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url
        return `${this.host}/${cleanUrl}`
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
        isProxyHost = false,
    }: FetchAPIParamsType<K>): Promise<ResponseType> => {
        const options: RequestInit = {
            method: type,
            signal,
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'Content-Type': 'application/json',
            },
        }
        // eslint-disable-next-line dot-notation
        options['credentials'] = 'include' as RequestCredentials
        return fetch(
            this.constructUrl(url),
            !isMultipartRequest
                ? options
                : ({
                      method: type,
                      body: data,
                  } as RequestInit),
        ).then(
            // eslint-disable-next-line consistent-return
            async (response) => {
                const isLicenseInvalid = response.headers.get(ResponseHeaders.LICENSE_STATUS) === INVALID_LICENSE_KEY

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

    /**
     * Merges multiple AbortSignals into a single AbortSignal that aborts
     * as soon as any of the input signals abort.
     *
     * This is useful when you want to race multiple async cancellation signals,
     * for example, to support both a global timeout and a user-triggered abort.
     *
     * @param signals - AbortSignals to merge.
     * @returns An AbortSignal that aborts if any input signal aborts.
     */
    private static mergeAbortSignals(...signals: (AbortSignal | undefined)[]): AbortSignal {
        const controller = new AbortController()

        // If any signal is already aborted, abort immediately and don't add listeners
        if (signals.some((s) => s?.aborted)) {
            controller.abort()
            return controller.signal
        }

        const onAbort = () => controller.abort()

        // Keep track of listeners for cleanup later
        const cleanupFns: (() => void)[] = []

        signals.forEach((signal) => {
            if (signal && !signal.aborted) {
                signal.addEventListener('abort', onAbort)
                cleanupFns.push(() => signal.removeEventListener('abort', onAbort))
            }
        })

        // Ensure cleanup happens when merged signal is aborted (by any means)
        controller.signal.addEventListener(
            'abort',
            () => {
                cleanupFns.forEach((fn) => fn())
            },
            // This ensures the listener is only run once
            { once: true },
        )

        return controller.signal
    }

    private fetchInTime = <T = object>({
        url,
        type,
        data,
        options,
        isMultipartRequest,
    }: FetchInTimeParamsType<T>): Promise<ResponseType> => {
        const controller = options?.abortControllerRef?.current ?? new AbortController()
        const timeoutSignal = controller.signal

        const mergedSignal = CoreAPI.mergeAbortSignals(options?.signal, timeoutSignal)

        const timeout = options?.timeout || this.timeout

        const timeoutPromise: Promise<ResponseType> = new Promise((_, reject) => {
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
                signal: mergedSignal,
                preventAutoLogout: options?.preventAutoLogout || false,
                preventLicenseRedirect: options?.preventLicenseRedirect || false,
                shouldParseServerErrorForUnauthorizedUser: options?.shouldParseServerErrorForUnauthorizedUser,
                isMultipartRequest,
                isProxyHost: options?.isProxyHost || false,
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

    setGlobalAPITimeout = (timeout: number) => {
        this.timeout = timeout || FALLBACK_REQUEST_TIMEOUT
    }
}

export default CoreAPI
