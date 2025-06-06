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

import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import { JSONPath, JSONPathOptions } from 'jsonpath-plus'
import { compare as compareJSON, applyPatch, unescapePathComponent, deepClone } from 'fast-json-patch'
import { components } from 'react-select'
import * as Sentry from '@sentry/browser'
import moment from 'moment'
import { useLocation } from 'react-router-dom'
import YAML from 'yaml'
import { deepEquals } from '@rjsf/utils'
import {
    ERROR_EMPTY_SCREEN,
    SortingOrder,
    EXCLUDED_FALSY_VALUES,
    DISCORD_LINK,
    ZERO_TIME_STRING,
    TOAST_ACCESS_DENIED,
    UNCHANGED_ARRAY_ELEMENT_SYMBOL,
    DATE_TIME_FORMATS,
} from './Constants'
import { ServerErrors } from './ServerError'
import { AsyncOptions, AsyncState, DeploymentNodeType, UseSearchString } from './Types'
import {
    scrollableInterface,
    DATE_TIME_FORMAT_STRING,
    ToastManager,
    ToastVariantType,
    versionComparatorBySortOrder,
    WebhookEventNameType,
    AppType,
} from '../Shared'
import { ReactComponent as ArrowDown } from '@Icons/ic-chevron-down.svg'
import { ReactComponent as ICWebhook } from '@Icons/ic-webhook.svg'
import { ReactComponent as ICBranch } from '@Icons/ic-branch.svg'
import { ReactComponent as ICRegex } from '@Icons/ic-regex.svg'
import { ReactComponent as ICPullRequest } from '@Icons/ic-pull-request.svg'
import { ReactComponent as ICTag } from '@Icons/ic-tag.svg'
import { SourceTypeMap } from '@Common/Common.service'
import { getIsRequestAborted } from './API'

export function showError(serverError, showToastOnUnknownError = true, hideAccessError = false) {
    if (serverError instanceof ServerErrors && Array.isArray(serverError.errors)) {
        serverError.errors.map(({ userMessage, internalMessage }) => {
            const userMessageInLowercase = userMessage?.toLowerCase()

            if (
                serverError.code === 403 &&
                (userMessageInLowercase === ERROR_EMPTY_SCREEN.UNAUTHORIZED.toLowerCase() ||
                    userMessageInLowercase === ERROR_EMPTY_SCREEN.FORBIDDEN.toLowerCase())
            ) {
                if (!hideAccessError) {
                    ToastManager.showToast({
                        variant: ToastVariantType.notAuthorized,
                        description: TOAST_ACCESS_DENIED.SUBTITLE,
                    })
                }
            } else {
                ToastManager.showToast({
                    variant: ToastVariantType.error,
                    description: userMessage || internalMessage,
                })
            }
        })
    } else {
        if (serverError.code !== 403 && serverError.code !== 408 && !getIsRequestAborted(serverError)) {
            Sentry.captureException(serverError)
        }

        if (showToastOnUnknownError) {
            if (serverError.message) {
                ToastManager.showToast({
                    variant: ToastVariantType.error,
                    description: serverError.message,
                })
            } else {
                ToastManager.showToast({
                    variant: ToastVariantType.error,
                    description: 'Some Error Occurred',
                })
            }
        }
    }
}

interface ConditionalWrapper<T> {
    condition: boolean
    wrap: (children: T) => T
    children: T
}
export const ConditionalWrap: React.FC<ConditionalWrapper<any>> = ({ condition, wrap, children }) =>
    condition ? wrap(children) : <>{children}</>

export function sortCallback(key: string, a: any, b: any, isCaseSensitive?: boolean) {
    let x = a[key]
    let y = b[key]
    if (isCaseSensitive) {
        x = x.toLowerCase()
        y = y.toLowerCase()
    }
    if (x < y) {
        return -1
    }
    if (x > y) {
        return 1
    }
    return 0
}

export const stopPropagation = (event): void => {
    event.stopPropagation()
}

export const preventDefault = (event: SyntheticEvent): void => {
    event.preventDefault()
}

export function useThrottledEffect(callback, delay, deps = []) {
    // function will be executed only once in a given time interval.
    const lastRan = useRef(Date.now())

    useEffect(() => {
        const handler = setTimeout(
            () => {
                if (Date.now() - lastRan.current >= delay) {
                    callback()
                    lastRan.current = Date.now()
                }
            },
            delay - (Date.now() - lastRan.current),
        )

        return () => {
            clearTimeout(handler)
        }
    }, [delay, ...deps])
}

const colors = [
    'var(--Y500)',
    'var(--R600)',
    'var(--R700)',
    'var(--R500)',
    'var(--R400)',
    'var(--V700)',
    'var(--B500)',
    'var(--B400)',
    'var(--G500)',
    'var(--G700)',
]

export function getRandomColor(email: string): string {
    let sum = 0
    for (let i = 0; i < email.length; i++) {
        sum += email.charCodeAt(i)
    }
    return colors[sum % colors.length]
}

export const getAlphabetIcon = (str: string, rootClassName: string = '') => {
    if (!str) return null
    return (
        <span
            className={`${rootClassName} alphabet-icon__initial fs-13 icon-dim-20 flex cn-0 mr-8 dc__no-shrink`}
            style={{ backgroundColor: getRandomColor(str) }}
        >
            {str[0]}
        </span>
    )
}

export const getEmptyArrayOfLength = (length: number) => Array.from({ length })

export function noop(...args): any {}

export function not(e) {
    return !e
}

export const refresh = () => {
    window.location.reload()
}
export const reportIssue = () => {
    window.open(DISCORD_LINK)
}

export function useEffectAfterMount(cb, dependencies) {
    const justMounted = React.useRef(true)
    React.useEffect(() => {
        if (!justMounted.current) {
            return cb()
        }
        justMounted.current = false
    }, dependencies)
}

export function getCookie(sKey) {
    if (!sKey) {
        return null
    }
    return (
        document.cookie.replace(
            new RegExp(`(?:(?:^|.*;)\\s*${sKey.replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=\\s*([^;]*).*$)|^.*$`),
            '$1',
        ) || null
    )
}

export function handleUTCTime(ts: string, isRelativeTime = false) {
    let timestamp = ''
    try {
        if (ts && ts.length && ts !== ZERO_TIME_STRING) {
            const date = moment(ts)
            if (isRelativeTime) {
                timestamp = date.fromNow()
            } else {
                timestamp = date.format(DATE_TIME_FORMAT_STRING)
            }
        }
    } catch (error) {
        console.error('Error Parsing Date:', ts)
    }
    return timestamp
}

export const getFormattedUTCTimeForExport = (timeToConvert: string, fallback = '-') =>
    timeToConvert ? `${moment(timeToConvert).utc().format(DATE_TIME_FORMATS.TWELVE_HOURS_EXPORT_FORMAT)} (UTC)` : '-'

export function useSearchString(): UseSearchString {
    const location = useLocation()
    const queryParams: URLSearchParams = useMemo(() => {
        const queryParams = new URLSearchParams(location.search)
        return queryParams
    }, [location])

    const searchParams = Array.from(queryParams.entries()).reduce((agg, curr, idx) => {
        agg[curr[0]] = curr[1]
        return agg
    }, {})

    return { queryParams, searchParams }
}

export const closeOnEscKeyPressed = (e: any, actionClose: () => void) => {
    if (e.keyCode === 27 || e.key === 'Escape') {
        actionClose()
    }
}

export function useJsonYaml(value, tabSize = 4, language = 'json', shouldRun = false) {
    const [json, setJson] = useState('')
    const [yaml, setYaml] = useState('')
    const [nativeObject, setNativeObject] = useState(null)
    const [error, setError] = useState('')
    const yamlParseConfig = {
        prettyErrors: true,
    }

    useEffect(() => {
        if (!shouldRun) return
        let obj
        let jsonError = null
        let yamlError = null
        if (language === 'json') {
            try {
                obj = JSON.parse(value)
                jsonError = null
                yamlError = null
            } catch (err) {
                jsonError = err
                try {
                    obj = YAML.parse(value, yamlParseConfig)
                    jsonError = null
                    yamlError = null
                } catch (err2) {
                    yamlError = err2
                }
            }
        } else {
            try {
                obj = YAML.parse(value, yamlParseConfig)
                jsonError = null
                yamlError = null
            } catch (err) {
                yamlError = err
                try {
                    obj = JSON.parse(value)
                    jsonError = null
                    yamlError = null
                } catch (err2) {
                    jsonError = err2
                }
            }
        }
        if (jsonError || yamlError) {
            setError(language === 'json' ? jsonError.message : yamlError.message)
        }
        if (obj && typeof obj === 'object') {
            setJson(JSON.stringify(obj, null, tabSize))
            setYaml(YAML.stringify(obj, { indent: 2, lineWidth: 0 }))
            setNativeObject(obj)
            setError('')
        } else {
            setNativeObject(null)
            if (jsonError || yamlError) {
                setError(language === 'json' ? jsonError.message : yamlError.message)
            } else {
                setError('cannot parse to valid object')
            }
        }
    }, [value, tabSize, language, shouldRun])

    return [nativeObject, json, yaml, error]
}

const MANIFEST_METADATA_REQUIRED_FIELDS: string[] = ['name', 'namespace', 'labels', 'annotations']

// Remove Auto-generated fields from kubernetes manifest
// input - jsonString
// output - jsonString
export function cleanKubeManifest(manifestJsonString: string): string {
    if (!manifestJsonString) {
        return manifestJsonString
    }

    try {
        const obj = JSON.parse(manifestJsonString)

        // 1 - delete status
        delete obj.status

        // 2 - delete all fields from metadata except some predefined
        const { metadata } = obj
        if (metadata) {
            for (const key in metadata) {
                if (!MANIFEST_METADATA_REQUIRED_FIELDS.includes(key)) {
                    delete metadata[key]
                }
            }
        }

        return JSON.stringify(obj)
    } catch (e) {
        return manifestJsonString
    }
}
const unsecureCopyToClipboard = (str: string) => {
    const listener = function (ev) {
        ev.preventDefault()
        ev.clipboardData.setData('text/plain', str)
    }
    document.addEventListener('copy', listener)
    document.execCommand('copy')
    document.removeEventListener('copy', listener)
}

/**
 * This is a promise<void> that will resolve if str is successfully copied
 * On HTTP (other than localhost) system clipboard is not supported, so it will use the unsecureCopyToClipboard function
 * @param str
 */
export function copyToClipboard(str: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (!str) {
            resolve()

            return
        }

        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard
                .writeText(str)
                .then(() => {
                    resolve()
                })
                .catch(() => {
                    ToastManager.showToast({
                        variant: ToastVariantType.error,
                        description: 'Failed to copy to clipboard',
                    })

                    reject()
                })
        } else {
            unsecureCopyToClipboard(str)

            resolve()
        }
    })
}

export function useAsync<T>(
    func: (...rest) => Promise<T>,
    dependencyArray: any[] = [],
    shouldRun = true,
    options: AsyncOptions = { resetOnChange: true },
): [boolean, T, any | null, () => void, React.Dispatch<any>, any[]] {
    const [state, setState] = useState<AsyncState<T>>({
        loading: true,
        result: null,
        error: null,
        dependencies: dependencyArray,
    })
    const mounted = useRef(true)
    const dependencies: any[] = useMemo(() => [...dependencyArray, shouldRun], [...dependencyArray, shouldRun])

    const reload = () => {
        async function call() {
            try {
                setState((state) => ({
                    ...state,
                    loading: true,
                }))
                const result = await func()
                if (mounted.current)
                    setState((state) => ({
                        ...state,
                        result,
                        error: null,
                        loading: false,
                    }))
            } catch (error: any) {
                if (mounted.current)
                    setState((state) => ({
                        ...state,
                        error,
                        loading: false,
                    }))
            }
        }
        return call()
    }

    useEffect(() => {
        if (!shouldRun) {
            setState((state) => ({ ...state, loading: false }))
            return
        }
        setState((state) => ({ ...state, dependencies: dependencyArray }))
        reload()
        return () =>
            setState((state) => ({
                ...state,
                loading: false,
                error: null,
                ...(options.resetOnChange ? { result: null } : {}),
            }))
    }, dependencies)

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])

    const setResult = (param) => {
        if (typeof param === 'function') {
            setState((state) => ({ ...state, result: param(state.result) }))
        } else {
            setState((state) => ({ ...state, result: param }))
        }
    }

    return [state.loading, state.result, state.error, reload, setResult, state.dependencies]
}

export const processDeployedTime = (lastDeployed, isArgoInstalled) => {
    if (lastDeployed) {
        return handleUTCTime(lastDeployed, true)
    }
    return isArgoInstalled ? '' : 'Not deployed'
}

/**
 * Appends search parameters to the url as a query string
 *
 * @param url URL to which the search params needs to be added
 * @param params Object for the search parameters
 */
export const getUrlWithSearchParams = <T extends string | number = string | number>(
    url: string,
    // FIXME: Need to fix this as the generic typing is incorrect
    params = {} as Partial<Record<T, any>>,
) => {
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach((key) => {
        if (!EXCLUDED_FALSY_VALUES.includes(params[key])) {
            if (Array.isArray(params[key])) {
                params[key].forEach((val) => {
                    searchParams.append(key, val)
                })
            } else {
                searchParams.set(key, params[key])
            }
        }
    })
    const queryString = searchParams.toString()
    return url + (queryString ? `?${queryString}` : '')
}

/**
 * Custom exception logger function for logging errors to sentry
 */
export const logExceptionToSentry: typeof Sentry.captureException = Sentry.captureException.bind(window)

export const customStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: '32px',
        boxShadow: 'none',
        border: 'none',
        cursor: 'pointer',
        background: 'transparent',
    }),
    indicatorSeparator: (base, state) => ({
        ...base,
        width: 0,
    }),
    valueContainer: (base, state) => ({
        ...base,
        padding: '0',
        fontSize: '13px',
        fontWeight: '600',
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: 'var(--N400)',
        padding: '0 8px',
        transition: 'all .2s ease',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
}

export const getFilteredChartVersions = (charts, selectedChartType) =>
    // Filter chart versions based on selected chart type
    charts
        .filter((item) => item?.chartType === selectedChartType.value)
        .sort((a, b) => versionComparatorBySortOrder(a?.chartVersion, b?.chartVersion))
        .map((item) => ({
            value: item?.chartVersion,
            label: item?.chartVersion,
            chartRefId: item.chartRefId,
        }))

/**
 * Removes nulls from the arrays in the provided object
 * @param {object} object from which we need to delete nulls in its arrays
 * @returns object after removing (in-place) the null items in arrays
 */
export const recursivelyRemoveSymbolFromArraysInObject = (object: object, symbol: symbol) => {
    // NOTE: typeof null === 'object'
    if (typeof object !== 'object' || !object) {
        return object
    }
    if (Array.isArray(object)) {
        return object.filter((item) => {
            recursivelyRemoveSymbolFromArraysInObject(item, symbol)
            return item !== symbol
        })
    }
    Object.keys(object).forEach((key) => {
        object[key] = recursivelyRemoveSymbolFromArraysInObject(object[key], symbol)
    })
    return object
}

const _joinObjects = (A: object, B: object) => {
    if (typeof A !== 'object' || typeof B !== 'object' || !B) {
        return
    }
    Object.keys(B).forEach((key) => {
        if (A[key] === undefined || A[key] === UNCHANGED_ARRAY_ELEMENT_SYMBOL) {
            A[key] = B[key]
            return
        }
        _joinObjects(A[key], B[key])
    })
}

/**
 * Merges the objects into one object
 * Works more like Object.assign; that doesn't deep copy
 * @param {object[]} objects list of js objects
 * @returns object after the merge
 */
export const joinObjects = (objects: object[]) => {
    const join = {}
    objects.forEach((object) => {
        _joinObjects(join, object)
    })
    return join
}

const buildObjectFromPathTokens = (index: number, tokens: string[], value: any) => {
    if (index === tokens.length) {
        return value
    }
    const key = tokens[index]
    const numberKey = Number(key)
    const isKeyNumber = !Number.isNaN(numberKey)
    return isKeyNumber
        ? [
              ...Array(numberKey).fill(UNCHANGED_ARRAY_ELEMENT_SYMBOL),
              buildObjectFromPathTokens(index + 1, tokens, value),
          ]
        : { [unescapePathComponent(key)]: buildObjectFromPathTokens(index + 1, tokens, value) }
}

/**
 * Builds an object from the provided path
 * @param {string} path JSON pointer path of the form /path/to/1/...
 * @param {any} value property value
 * @returns final object formed from the path
 */
export const buildObjectFromPath = (path: string, value: any) => {
    const parts = path.split('/')
    // NOTE: since the path has a leading / we need to delete the first element
    parts.splice(0, 1)
    return buildObjectFromPathTokens(0, parts, value)
}

/**
 * Returns the list of indices at which the regex matched
 * @param string the string to process
 * @param regex @RegExp
 * @returns array of indices where the @regex matched in @string
 */
export const getRegexMatchPositions = (string: string, regex: RegExp): number[] => {
    const pos = string.search(regex)
    if (pos < 0) {
        return []
    }
    const nextToken = string.slice(pos + 1)
    return [pos, ...getRegexMatchPositions(nextToken, regex).map((n) => n + pos + 1)]
}

/**
 * Returns all the substrings from 0th index to progressively next regex match position
 * Eg. Suppose a string is /path/to/folder then it will return [/path, /path/to, /path/to/folder]
 * @param strings list of strings
 * @param regex that matches the separators for the substrings
 * @returns set of substrings
 */
export const powerSetOfSubstringsFromStart = (strings: string[], regex: RegExp) =>
    strings.flatMap((key) => {
        const _keys = [key]
        const positions = getRegexMatchPositions(key, regex)
        positions.forEach((position) => {
            _keys.push(key.slice(0, position))
        })
        return _keys
    })

export const convertJSONPointerToJSONPath = (pointer: string) =>
    unescapePathComponent(
        pointer
            .replace(/\/([\*0-9]+)\//g, '[$1].')
            .replace(/\//g, '.')
            .replace(/\./, '$.'),
    )

export const flatMapOfJSONPaths = (
    paths: string[],
    json: object,
    resultType: JSONPathOptions['resultType'] = 'path',
): string[] => paths.flatMap((path) => JSONPath({ path, json, resultType }))

export const applyCompareDiffOnUneditedDocument = (uneditedDocument: object, editedDocument: object) => {
    const patch = compareJSON(uneditedDocument, editedDocument)
    return applyPatch(deepClone(uneditedDocument), patch).newDocument
}

/**
 * Returns a debounced variant of the function
 * @deprecated - It should use useRef instead, pls use useDebounce
 */
export const debounce = (func, timeout = 500) => {
    let timer

    return function (this, ...args) {
        const context = this
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            timer = null
            func.apply(context, args)
        }, timeout)
    }
}

export const useDebounce = <Callback extends (...args: any[]) => void>(cb: Callback, delay: number) => {
    const timeoutId = useRef<ReturnType<typeof setTimeout>>(null)

    return (...args: Parameters<Callback>) => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current)
        }
        timeoutId.current = setTimeout(() => cb(...args), delay)
    }
}

/**
 * Returns a capitalized string with first letter in uppercase and rest in lowercase
 */

export const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

//  * Sorts the relative dates based on the sorting direction
//  */
export const handleRelativeDateSorting = (dateStringA, dateStringB, sortOrder) => {
    // For date, we show relative date hence the logic for sorting is reversed here
    const dateA = new Date(dateStringA).getTime()
    const dateB = new Date(dateStringB).getTime()

    if (isNaN(dateA) && isNaN(dateB)) {
        return 0 // Both dates are invalid, consider them equal
    }
    if (isNaN(dateA)) {
        // dateA is invalid, move it to the end if sorting ASC, otherwise to the beginning
        return sortOrder === SortingOrder.ASC ? 1 : -1
    }
    if (isNaN(dateB)) {
        // dateB is invalid, move it to the end if sorting ASC, otherwise to the beginning
        return sortOrder === SortingOrder.ASC ? -1 : 1
    }
    return sortOrder === SortingOrder.ASC ? dateB - dateA : dateA - dateB
}

/**
 * Returns a stringified YAML with default indentation & line width
 */
export const YAMLStringify = (obj: object | unknown, option?: object) =>
    YAML.stringify(obj, { indent: 2, lineWidth: 0, ...option })

/**
 * compare Object Length of the object
 */
export const compareObjectLength = (objA: any, objB: any): boolean => {
    if (objA === objB) {
        return true
    }

    const isArrayA = Array.isArray(objA)
    const isArrayB = Array.isArray(objB)

    if ((isArrayA && !isArrayB) || (!isArrayA && isArrayB)) {
        return false
    }
    if (!isArrayA && !isArrayB) {
        return Object.keys(objA).length === Object.keys(objB).length
    }

    return objA.length === objB.length
}

/**
 * Return deep copy of the object
 */
export function deepEqual(configA: any, configB: any): boolean {
    return deepEquals(configA, configB)
}

export function shallowEqual(objA, objB) {
    if (objA === objB) {
        return true
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
        return false
    }

    // Test for A's keys different from B.
    const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB)
    for (let i = 0; i < keysA.length; i++) {
        if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false
        }
    }

    return true
}

export function useInterval(callback, delay) {
    const savedCallback = useRef(null)
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            const id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

export function useScrollable(options: scrollableInterface) {
    const targetRef = useRef(null)
    const raf_id = useRef(0)
    const wheelListener = useRef(null)
    const [scrollHeight, setScrollHeight] = useState(0)
    const [scrollTop, setScrollTop] = useState(0)
    const [autoBottom, toggleAutoBottom] = useState(false)

    const target = useCallback((node) => {
        if (node === null) {
            return
        }
        targetRef.current = node
        wheelListener.current = node.addEventListener('wheel', handleWheel)
        raf_id.current = requestAnimationFrame(rAFCallback)
        return () => {
            node.removeEventListener('wheel', handleWheel)
            cancelAnimationFrame(raf_id.current)
        }
    }, [])

    function handleWheel(e) {
        if (e.deltaY < 0) {
            toggleAutoBottom(false)
        }
    }

    const [topScrollable, bottomScrollable] = useMemo(() => {
        if (!targetRef.current) {
            return [false, false]
        }

        let topScrollable = true
        const bottomScrollable = !(
            targetRef.current.scrollHeight - targetRef.current.scrollTop ===
            targetRef.current.clientHeight
        )
        if (scrollTop === 0) {
            topScrollable = false
        }

        if (!bottomScrollable && options.autoBottomScroll) {
            toggleAutoBottom(true)
        }
        return [topScrollable, bottomScrollable]
    }, [scrollHeight, scrollTop])

    useEffect(() => {
        if (options.autoBottomScroll) {
            toggleAutoBottom(true)
        } else {
            toggleAutoBottom(false)
        }
    }, [options.autoBottomScroll])

    useThrottledEffect(
        () => {
            if (!autoBottom || !targetRef.current) {
                return
            }
            targetRef.current.scrollBy({
                top: scrollHeight,
                left: 0,
            })
        },
        500,
        [scrollHeight, autoBottom],
    )

    function scrollToTop(e) {
        targetRef.current.scrollBy({
            top: -1 * scrollTop,
            left: 0,
            behavior: 'smooth',
        })
        if (options.autoBottomScroll) {
            toggleAutoBottom(false)
        }
    }

    function scrollToBottom(e) {
        toggleAutoBottom(true)
        targetRef.current.scrollBy({
            top: scrollHeight,
            left: 0,
            behavior: 'smooth',
        })
    }

    function rAFCallback() {
        if (!targetRef.current) {
            return
        }

        setScrollHeight(targetRef.current.scrollHeight)
        setScrollTop(targetRef.current.scrollTop)
        raf_id.current = requestAnimationFrame(rAFCallback)
    }

    return [target, topScrollable ? scrollToTop : null, bottomScrollable ? scrollToBottom : null]
}

function useDelayedEffect(callback, delay, deps = []) {
    const timeoutRef = useRef(null)
    useEffect(() => {
        timeoutRef.current = setTimeout(callback, delay)
        return () => clearTimeout(timeoutRef.current)
    }, deps)
}

export function useKeyDown() {
    const [keys, setKeys] = useState([])
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown)
        document.addEventListener('keyup', onKeyUp)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.removeEventListener('keyup', onKeyUp)
        }
    }, [keys])

    // another hook just to reset the key becayse Meta key on mac ignores all other keyUps while MetaKey is pressed.
    useDelayedEffect(clearKeys, 500, [keys.join('+')])

    function clearKeys() {
        if (keys.length) {
            setKeys([])
        }
    }

    const onKeyDown = ({ key }) => {
        setKeys((k) => Array.from(new Set(k).add(key)))
    }
    const onKeyUp = ({ key }) => {
        setKeys((ks) => ks.filter((k) => k !== key))
    }

    return keys
}

export const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <ArrowDown className="icon-dim-20 icon-n6" />
    </components.DropdownIndicator>
)

export function mapByKey<T = Map<any, any>>(arr: any[], id: string): T {
    if (!Array.isArray(arr)) {
        console.error(arr, 'is not array')
        return new Map() as T
    }
    return arr.reduce((agg, curr) => agg.set(curr[id], curr), new Map())
}

export function asyncWrap(promise): any[] {
    return promise.then((result) => [null, result]).catch((err) => [err])
}

export const prefixZeroIfSingleDigit = (value: number = 0) => (value > 0 && value < 10 ? `0${value}` : value)

export const throttle = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number = 300,
): ((...args: Parameters<T>) => void) => {
    let lastCall = 0

    return (...args: Parameters<T>) => {
        const now = Date.now()

        if (now - lastCall >= delay) {
            lastCall = now
            func(...args)
        }
    }
}

/**
 *
 * @param sourceType - SourceTypeMap
 * @param _isRegex - boolean
 * @param webhookEventName - WebhookEventNameType
 * @returns - Icon
 */
export const getBranchIcon = (sourceType, _isRegex?: boolean, webhookEventName?: string) => {
    if (sourceType === SourceTypeMap.WEBHOOK) {
        if (webhookEventName === WebhookEventNameType.PULL_REQUEST) {
            return <ICPullRequest className="scn-6" />
        }
        if (webhookEventName === WebhookEventNameType.TAG_CREATION) {
            return <ICTag className="scn-6" />
        }
        return <ICWebhook />
    }
    if (sourceType === SourceTypeMap.BranchRegex || _isRegex) {
        return <ICRegex className="fcn-6" />
    }
    return <ICBranch className="fcn-6" />
}

// TODO: Might need to expose sandbox and referrer policy
export const getSanitizedIframe = (iframeString: string) =>
    DOMPurify.sanitize(iframeString, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    })

/**
 * This method adds default attributes to iframe - title, loading ="lazy", width="100%", height="100%"
 */
export const getIframeWithDefaultAttributes = (iframeString: string, defaultName?: string): string => {
    const parentDiv = document.createElement('div')
    parentDiv.innerHTML = getSanitizedIframe(iframeString)

    const iframe = parentDiv.querySelector('iframe')
    if (iframe) {
        if (!iframe.hasAttribute('title') && !!defaultName) {
            iframe.setAttribute('title', defaultName)
        }

        if (!iframe.hasAttribute('loading')) {
            iframe.setAttribute('loading', 'lazy')
        }

        if (!iframe.hasAttribute('width')) {
            iframe.setAttribute('width', '100%')
        }

        if (!iframe.hasAttribute('height')) {
            iframe.setAttribute('height', '100%')
        }

        return parentDiv.innerHTML
    }

    return iframeString
}

export const getStageTitle = (stageType: DeploymentNodeType): string => {
    switch (stageType) {
        case DeploymentNodeType.PRECD:
            return 'Pre-deployment'
        case DeploymentNodeType.POSTCD:
            return 'Post-deployment'
        default:
            return 'Deployment'
    }
}
export const getGoLangFormattedDateWithTimezone = (dateFormat: string) => {
    const now = moment()
    const formattedDate = now.format(dateFormat)
    const timezone = now.format('Z').replace(/([+/-])(\d{2})[:.](\d{2})/, '$1$2$3')
    return formattedDate.replace('Z', timezone)
}

/**
 *
 * @returns SHA-256 hashed value
 */
export const getHashedValue = async (value: string): Promise<string | null> => {
    try {
        const encoder = new TextEncoder()
        const data = encoder.encode(value)
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)

        return Array.from(new Uint8Array(hashBuffer))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('')
    } catch (err) {
        logExceptionToSentry(err)
        return null
    }
}

export const getTTLInHumanReadableFormat = (ttl: number): string => {
    const absoluteTTL = Math.abs(ttl)
    // moment return 'a few seconds' so returning directly
    if (absoluteTTL <= 60) {
        return '1 minute'
    }
    const humanizedDuration = moment.duration(absoluteTTL, 'seconds').humanize(false)
    // Since moment.js return "a" or "an" for singular values so replacing with 1.
    return humanizedDuration.replace(/^(a|an) /, '1 ')
}

const getAppTypeCategory = (appType: AppType) => {
    switch (appType) {
        case AppType.DEVTRON_APP:
            return 'DA'
        case AppType.DEVTRON_HELM_CHART:
        case AppType.EXTERNAL_HELM_CHART:
            return 'HA'
        case AppType.EXTERNAL_ARGO_APP:
            return 'ACD'
        case AppType.EXTERNAL_FLUX_APP:
            return 'FCD'
        default:
            return 'DA'
    }
}

export const getAIAnalyticsEvents = (context: string, appType?: AppType) =>
    `AI_${appType ? `${getAppTypeCategory(appType)}_` : ''}${context}`

export const findRight = <T,>(arr: T[], predicate: (item: T) => boolean): T | null => {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
            return arr[i]
        }
    }

    return null
}
