import React, { useEffect, useRef } from 'react'
import { ServerErrors } from './ServerError'
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/browser'
import { toastAccessDenied } from './ToastBody'
import { ERROR_EMPTY_SCREEN, TOKEN_COOKIE_NAME } from './Constants'

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