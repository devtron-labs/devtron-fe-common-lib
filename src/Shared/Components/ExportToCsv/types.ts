import type { JSX } from 'react'

import { ServerErrors } from '@Common/ServerError'
import { APIOptions } from '@Common/Types'

import { ButtonProps } from '../Button'

type TriggerElementConfigType =
    | {
          buttonProps: ButtonProps
          showOnlyIcon?: boolean
          customButton?: never
          isExternalTrigger?: false
      }
    | {
          customButton: {
              content: JSX.Element
              className: string
          }
          buttonProps?: never
          showOnlyIcon?: false
          isExternalTrigger?: false
      }
    | {
          isExternalTrigger: true
          showOnlyIcon?: false
          buttonProps?: never
          customButton?: never
      }
    | {
          showOnlyIcon: true
          buttonProps?: never
          customButton?: never
          isExternalTrigger?: false
      }

export interface ExportToCsvProps<HeaderItemKeyType extends string> {
    headers: { label: string; key: HeaderItemKeyType }[]
    apiPromise: ({
        signal,
    }: Pick<APIOptions, 'signal'>) => Promise<Record<HeaderItemKeyType, string | number | boolean>[]>
    fileName: string
    /**
     * If nothing given will render a Button with "Export CSV" text
     */
    triggerElementConfig?: TriggerElementConfigType
    /**
     * @default false
     */
    disabled?: boolean
    /**
     * If not given would show default dialog
     */
    modalConfig?:
        | {
              hideDialog: false
              renderCustomModal?: (proceedWithDownload: (shouldProceed: boolean) => void) => JSX.Element
          }
        | {
              hideDialog: true
              renderCustomModal?: never
          }
    /**
     * If given, would trigger export on when this changes and has some value
     */
    downloadRequestId?: string | number
}

export interface ExportToCsvDialogProps {
    isLoading: boolean
    exportDataError: ServerErrors
    initiateDownload: () => void
    handleCancelRequest: () => void
}
