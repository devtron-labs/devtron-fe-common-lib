import { ServerErrors } from "./ServerError"
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/browser'
import { toastAccessDenied } from "./ToastBody"


export function showError(serverError, showToastOnUnknownError = true, hideAccessError = false) {
  if (serverError instanceof ServerErrors && Array.isArray(serverError.errors)) {
      serverError.errors.map(({ userMessage, internalMessage }) => {
          if (serverError.code === 403 && userMessage === 'unauthorized') {
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