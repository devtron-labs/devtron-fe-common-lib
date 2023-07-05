import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ServerErrors } from './ServerError'
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/browser'
import { toastAccessDenied } from './ToastBody'
import { ERROR_EMPTY_SCREEN, TOKEN_COOKIE_NAME } from './Constants'
import { ReactComponent as FormError } from '../Assets/Icon/ic-warning.svg'
import moment from 'moment';

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

export interface InputDetailType {
    label: string
    defaultValue: string
    placeholder: string
}

export interface RegistryTypeDetailType {
    value: string
    label: string
    desiredFormat: string
    placeholderText: string
    gettingStartedLink: string
    defaultRegistryURL: string
    registryURL: InputDetailType
    id: InputDetailType
    password: InputDetailType
}

export const REGISTRY_TYPE_MAP: Record<string, RegistryTypeDetailType> = {
    ecr: {
        value: 'ecr',
        label: 'ECR',
        desiredFormat: '(desired format: repo-name)',
        placeholderText: 'Eg. repo_name',
        gettingStartedLink: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/get-set-up-for-amazon-ecr.html',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: 'Eg. xxxxxxxxxxxx.dkr.ecr.region.amazonaws.com',
        },
        id: {
            label: 'Access key ID',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Secret access key',
            defaultValue: '',
            placeholder: '',
        },
    },
    'docker-hub': {
        value: 'docker-hub',
        label: 'Docker',
        desiredFormat: '(desired format: username/repo-name)',
        placeholderText: 'Eg. username/repo_name',
        gettingStartedLink: 'https://docs.docker.com/docker-hub/',
        defaultRegistryURL: 'docker.io',
        registryURL: {
            label: 'Registry URL',
            defaultValue: 'docker.io',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Password/Token (Recommended: Token)',
            defaultValue: '',
            placeholder: '',
        },
    },
    acr: {
        value: 'acr',
        label: 'Azure',
        desiredFormat: '(desired format: repo-name)',
        placeholderText: 'Eg. repo_name',
        gettingStartedLink:
            'https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL/Login Server',
            defaultValue: '',
            placeholder: 'Eg. xxx.azurecr.io',
        },
        id: {
            label: 'Username/Registry Name',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Password',
            defaultValue: '',
            placeholder: '',
        },
    },
    'artifact-registry': {
        value: 'artifact-registry',
        label: 'Artifact Registry (GCP)',
        desiredFormat: '(desired format: project-id/artifacts-repo/repo-name)',
        placeholderText: 'Eg. project-id/artifacts-repo/repo-name',
        gettingStartedLink: 'https://cloud.google.com/artifact-registry/docs/manage-repos?hl=en_US',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: 'Eg. region-docker.pkg.dev',
        },
        id: {
            label: 'Username',
            defaultValue: '_json_key',
            placeholder: '',
        },
        password: {
            label: 'Service Account JSON File',
            defaultValue: '',
            placeholder: 'Paste json file content here',
        },
    },
    gcr: {
        value: 'gcr',
        label: 'GCR',
        desiredFormat: '(desired format: project-id/repo-name)',
        placeholderText: 'Eg. project-id/repo_name',
        gettingStartedLink: 'https://cloud.google.com/container-registry/docs/quickstart',
        defaultRegistryURL: 'gcr.io',
        registryURL: {
            label: 'Registry URL',
            defaultValue: 'gcr.io',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '_json_key',
            placeholder: '',
        },
        password: {
            label: 'Service Account JSON File',
            defaultValue: '',
            placeholder: 'Paste json file content here',
        },
    },
    quay: {
        value: 'quay',
        label: 'Quay',
        desiredFormat: '(desired format: username/repo-name)',
        placeholderText: 'Eg. username/repo_name',
        gettingStartedLink: '',
        defaultRegistryURL: 'quay.io',
        registryURL: {
            label: 'Registry URL',
            defaultValue: 'quay.io',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Token',
            defaultValue: '',
            placeholder: '',
        },
    },
    other: {
        value: 'other',
        label: 'Other',
        desiredFormat: '',
        placeholderText: '',
        gettingStartedLink: '',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Password/Token',
            defaultValue: '',
            placeholder: '',
        },
    },
}

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

export function useThrottledEffect(callback, delay, deps = []) {
    //function will be executed only once in a given time interval.
    const lastRan = useRef(Date.now())

    useEffect(() => {
        const handler = setTimeout(function () {
            if (Date.now() - lastRan.current >= delay) {
                callback()
                lastRan.current = Date.now()
            }
        }, delay - (Date.now() - lastRan.current))

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

export const getAlphabetIcon = (str: string) => {
    if (!str) return null
    return (
        <span
            className="alphabet-icon__initial fs-13 icon-dim-20 flex cn-0 mr-8"
            style={{ backgroundColor: getRandomColor(str) }}
        >
            {str[0]}
        </span>
    )
}

export const getEmptyArrayOfLength = (length: number) => {
    return Array.from({ length })
}

export function noop(...args): any {}

export function not(e) {
    return !e
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
            new RegExp('(?:(?:^|.*;)\\s*' + sKey.replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'),
            '$1',
        ) || null
    )
}

export function getLoginInfo() {
    const argocdToken = getCookie(TOKEN_COOKIE_NAME)
    if (argocdToken) {
        const jwts = argocdToken.split('.')
        try {
            return JSON.parse(atob(jwts[1]))
        } catch (err) {
            console.error('error in setting user ', err)
            return null
        }
    }
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
            //check errors in all fields
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
        let _validator = validationSchema[name].validator
        if (_validator && typeof _validator === 'object') {
            if (!_validateSingleValidator(_validator, value)) {
                return _validator.error
            }
        }

        // multiple validators
        let _validators = validationSchema[name].validators
        if (_validators && typeof _validators === 'object' && Array.isArray(_validators)) {
            let errors = []
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
            let error = validateField(name, value)
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

function handleError(error: any): any[] {
    if (!error) {
        return []
    }

    if (!Array.isArray(error)) {
        return [error]
    }

    return error
}

export function CustomInput({
    name,
    value,
    error,
    onChange,
    onBlur = (e) => {},
    onFocus = (e) => {},
    label,
    type = 'text',
    disabled = false,
    autoComplete = 'off',
    labelClassName = '',
    placeholder = '',
    tabIndex = 1,
    dataTestid = '',
}) {
    return (
        <div className="flex column left top">
            <label className={`form__label ${labelClassName}`}>{label}</label>
            <input
                data-testid={dataTestid}
                type={type}
                name={name}
                autoComplete="off"
                className="form__input"
                onChange={(e) => {
                    e.persist()
                    onChange(e)
                }}
                onBlur={onBlur}
                onFocus={onFocus}
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                tabIndex={tabIndex}
            />
            {handleError(error).map((err) => (
                <div className="form__error">
                    <FormError className="form__icon form__icon--error" />
                    {err}
                </div>
            ))}
        </div>
    )
}

export function handleUTCTime(ts: string, isRelativeTime = false) {
  let timestamp = "";
  try {
      if (ts && ts.length) {
          let date = moment(ts);
          if (isRelativeTime) timestamp = date.fromNow();
          else timestamp = date.format("ddd DD MMM YYYY HH:mm:ss");
      }
  } catch (error) {
      console.error("Error Parsing Date:", ts);
  }
  return timestamp;
}
