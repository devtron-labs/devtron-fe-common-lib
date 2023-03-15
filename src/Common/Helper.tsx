import { ServerErrors } from './ServerError'
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/browser'
import { toastAccessDenied } from './ToastBody'
import { useEffect, useRef } from 'react'
import { ERROR_EMPTY_SCREEN } from './Constants'

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
