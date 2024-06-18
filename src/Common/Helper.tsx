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
import { components } from 'react-select'
import * as Sentry from '@sentry/browser'
import * as jsonpatch from 'fast-json-patch'
import { JSONPath } from 'jsonpath-plus'
import moment from 'moment'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import YAML from 'yaml'
import { ERROR_EMPTY_SCREEN, SortingOrder, TOKEN_COOKIE_NAME, EXCLUDED_FALSY_VALUES, DISCORD_LINK, ZERO_TIME_STRING } from './Constants'
import { ServerErrors } from './ServerError'
import { toastAccessDenied } from './ToastBody'
import { AsyncOptions, AsyncState, UseSearchString } from './Types'
import { scrollableInterface } from '../Shared'
import { DATE_TIME_FORMAT_STRING } from '../Shared'
import { ReactComponent as ArrowDown } from '../Assets/Icon/ic-chevron-down.svg'

toast.configure({
    autoClose: 3000,
    hideProgressBar: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    closeOnClick: false,
    newestOnTop: true,
    toastClassName: 'devtron-toast',
    bodyClassName: 'devtron-toast__body',
})

export function showError(serverError, showToastOnUnknownError = true, hideAccessError = false) {
    if (serverError instanceof ServerErrors && Array.isArray(serverError.errors)) {
        serverError.errors.map(({ userMessage, internalMessage }) => {
            if (
                serverError.code === 403 &&
                (userMessage === ERROR_EMPTY_SCREEN.UNAUTHORIZED || userMessage === ERROR_EMPTY_SCREEN.FORBIDDEN)
            ) {
                if (!hideAccessError) {
                    toastAccessDenied()
                }
            } else {
                toast.error(userMessage || internalMessage)
            }
        })
    } else {
        if (serverError.code !== 403 && serverError.code !== 408) {
            Sentry.captureException(serverError)
        }

        if (showToastOnUnknownError) {
            if (serverError.message) {
                toast.error(serverError.message)
            } else {
                toast.error('Some Error Occurred')
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
    '#FFB900',
    '#D83B01',
    '#B50E0E',
    '#E81123',
    '#B4009E',
    '#5C2D91',
    '#0078D7',
    '#00B4FF',
    '#008272',
    '#107C10',
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
            className={`${rootClassName} alphabet-icon__initial fs-13 icon-dim-20 flex cn-0 mr-8`}
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

export function useForm(stateSchema, validationSchema = {}, callback) {
    const [state, setState] = useState(stateSchema)
    const [disable, setDisable] = useState(true)
    const [isDirty, setIsDirty] = useState(false)

    // Disable button in initial render.
    useEffect(() => {
        setDisable(true)
    }, [])

    // For every changed in our state this will be fired
    // To be able to disable the button
    useEffect(() => {
        if (isDirty) {
            setDisable(validateState(state))
        }
    }, [state, isDirty])

    // Used to disable submit button if there's an error in state
    // or the required field in state has no value.
    // Wrapped in useCallback to cached the function to avoid intensive memory leaked
    // in every re-render in component
    const validateState = useCallback(
        (state) => {
            // check errors in all fields
            const hasErrorInState = Object.keys(validationSchema).some((key) => {
                const isInputFieldRequired = validationSchema[key].required
                const stateValue = state[key].value // state value
                const stateError = state[key].error // state error
                return (isInputFieldRequired && !stateValue) || stateError
            })
            return hasErrorInState
        },
        [state, validationSchema],
    )

    function validateField(name, value): string | string[] {
        if (validationSchema[name].required) {
            if (!value) {
                return 'This is a required field.'
            }
        }

        function _validateSingleValidator(validator, value) {
            if (value && !validator.regex.test(value)) {
                return false
            }
            return true
        }

        // single validator
        const _validator = validationSchema[name].validator
        if (_validator && typeof _validator === 'object') {
            if (!_validateSingleValidator(_validator, value)) {
                return _validator.error
            }
        }

        // multiple validators
        const _validators = validationSchema[name].validators
        if (_validators && typeof _validators === 'object' && Array.isArray(_validators)) {
            const errors = []
            _validators.forEach((_validator) => {
                if (!_validateSingleValidator(_validator, value)) {
                    errors.push(_validator.error)
                }
            })
            if (errors.length > 0) {
                return errors
            }
        }

        return ''
    }

    const handleOnChange = useCallback(
        (event) => {
            setIsDirty(true)

            const { name, value } = event.target
            const error = validateField(name, value)
            setState((prevState) => ({
                ...prevState,
                [name]: { value, error },
            }))
        },
        [validationSchema],
    )

    const handleOnSubmit = (event) => {
        event.preventDefault()
        const newState = Object.keys(validationSchema).reduce((agg, curr) => {
            agg[curr] = { ...state[curr], error: validateField(curr, state[curr].value) }
            return agg
        }, state)
        if (!validateState(newState)) {
            callback(state)
        } else {
            setState({ ...newState })
        }
    }
    return { state, disable, handleOnChange, handleOnSubmit }
}

export function handleUTCTime(ts: string, isRelativeTime = false) {
    let timestamp = ''
    try {
        if (ts && ts.length) {
            const date = moment(ts)
            if (isRelativeTime) {
                if (ts !== ZERO_TIME_STRING) {
                    timestamp = date.fromNow()
                }
            } else {
                timestamp = date.format(DATE_TIME_FORMAT_STRING)
            }
        }
    } catch (error) {
        console.error('Error Parsing Date:', ts)
    }
    return timestamp
}

export function useSearchString(): UseSearchString {
    const location = useLocation()
    const queryParams: URLSearchParams = useMemo(() => {
        const queryParams = new URLSearchParams(location.search)
        return queryParams
    }, [location])

    // const searchParams={}
    // for (let [key, value] of queryParams.entries()){
    //     searchParams[key]=value
    // }
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
const unsecureCopyToClipboard = (str, callback = noop) => {
    const listener = function (ev) {
        ev.preventDefault()
        ev.clipboardData.setData('text/plain', str)
    }
    document.addEventListener('copy', listener)
    document.execCommand('copy')
    document.removeEventListener('copy', listener)
    callback()
}

/**
 * It will copy the passed content to clipboard and invoke the callback function, in case of error it will show the toast message.
 * On HTTP system clipboard is not supported, so it will use the unsecureCopyToClipboard function
 * @param str
 * @param callback
 */
export function copyToClipboard(str, callback = noop) {
    if (!str) {
        return
    }

    if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard
            .writeText(str)
            .then(() => {
                callback()
            })
            .catch(() => {
                toast.error('Failed to copy to clipboard')
            })
    } else {
        unsecureCopyToClipboard(str, callback)
    }
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
export const getUrlWithSearchParams = (url: string, params: Record<string | number, any> = {}) => {
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
export const logExceptionToSentry = Sentry.captureException.bind(window)

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
        .map((item) => ({
            value: item?.chartVersion,
            label: item?.chartVersion,
            chartRefId: item.chartRefId,
        }))

function removeEmptyObjectKeysAndNullValues(obj, originaljsonCopy) {
    // It recursively removes empty object keys and empty array keys
    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            // Check if the array is empty
            if (obj[key].length !== 0) {
                obj[key].forEach((element, index) => {
                    if (element === null || (typeof element === 'object' && Object.keys(element).length === 0))
                        obj[key].splice(index, 1)
                    else removeEmptyObjectKeysAndNullValues(element, originaljsonCopy[key][index])
                })
            }
            if (obj[key].length === 0 && originaljsonCopy[key].length !== 0) {
                delete obj[key]
            }
        } else if (obj[key] && typeof obj[key] === 'object') {
            if (
                removeEmptyObjectKeysAndNullValues(obj[key], originaljsonCopy[key]) &&
                Object.keys(originaljsonCopy[key]).length !== 0
            ) {
                delete obj[key]
            }
        } else if (obj[key] === undefined) {
            delete obj[key]
        }
    }
    return Object.keys(obj).length === 0
}

export function getUnlockedJSON(json, jsonPathArray, removeParentKeysAndEmptyArrays = false) {
    if (!jsonPathArray.length) return { newDocument: json, removedPatches: [] }

    const jsonCopy = JSON.parse(JSON.stringify(json))
    const originaljsonCopy = JSON.parse(JSON.stringify(json))
    const removedPatches = []
    const patches = jsonPathArray.flatMap((jsonPath) => {
        const pathsToRemove = JSONPath({ path: jsonPath, json: jsonCopy, resultType: 'all' })
        // reversing patches to handle correct array index deletion
        pathsToRemove.reverse()
        return pathsToRemove.map((result) => {
            // storing removed patches to have functionality of undo
            removedPatches.push({ op: 'add', path: result.pointer, value: result.value })
            return { op: 'remove', path: result.pointer }
        })
    })
    const { newDocument } = jsonpatch.applyPatch(jsonCopy, patches)
    if (removeParentKeysAndEmptyArrays) removeEmptyObjectKeysAndNullValues(newDocument, originaljsonCopy)
    return { newDocument, removedPatches: removedPatches.reverse() }
}

export function getLockedJSON(json, jsonPathArray: string[]) {
    const jsonCopy = JSON.parse(JSON.stringify(json))
    const resultJson = {}
    jsonPathArray.forEach((jsonPath) => {
        const elements = JSONPath({ path: jsonPath, json: jsonCopy, resultType: 'all' })
        elements.forEach((element) => {
            const pathArray: string[] = JSONPath.toPathArray(element.path)
            const lastPath = pathArray.pop()
            let current = resultJson
            for (let i = 0; i < pathArray.length; i++) {
                const key = isNaN(Number(pathArray[i])) ? pathArray[i] : parseInt(pathArray[i])
                if (!current[key]) {
                    current[key] = isNaN(Number(pathArray[i + 1] ?? lastPath)) ? {} : []
                }
                current = current[key]
            }
            const key = isNaN(Number(lastPath)) ? lastPath : parseInt(lastPath)
            current[key] = element.value
        })
    })
    // eslint-disable-next-line dot-notation
    return resultJson['$']
}

/**
 * Returns a debounced variant of the function
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
    } else if (isNaN(dateA)) {
        // dateA is invalid, move it to the end if sorting ASC, otherwise to the beginning
        return sortOrder === SortingOrder.ASC ? 1 : -1
    } else if (isNaN(dateB)) {
        // dateB is invalid, move it to the end if sorting ASC, otherwise to the beginning
        return sortOrder === SortingOrder.ASC ? -1 : 1
    } else {
        return sortOrder === SortingOrder.ASC ? dateB - dateA : dateA - dateB
    }
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
    try {
        if (configA === configB) {
            return true
        }
        if ((configA && !configB) || (!configA && configB) || !compareObjectLength(configA, configB)) {
            return false
        }
        let isEqual = true
        for (const idx in configA) {
            if (!isEqual) {
                break
            } else if (typeof configA[idx] === 'object' && typeof configB[idx] === 'object') {
                isEqual = deepEqual(configA[idx], configB[idx])
            } else if (configA[idx] !== configB[idx]) {
                isEqual = false
            }
        }
        return isEqual
    } catch (err) {
        showError(err)
        return true
    }
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

export const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <ArrowDown className="icon-dim-20 icon-n5" />
        </components.DropdownIndicator>
    )
}

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
