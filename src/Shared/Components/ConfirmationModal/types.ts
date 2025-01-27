import { PropsWithChildren, ReactElement, ReactNode, SyntheticEvent } from 'react'
import { ButtonProps } from '../Button'

export enum ConfirmationModalVariantType {
    info = 'info',
    delete = 'delete',
    warning = 'warning',
    custom = 'custom',
}

type CommonButtonProps<isConfig extends boolean, isCustomVariant extends boolean> = Pick<ButtonProps, 'text'> &
    Partial<Pick<ButtonProps, 'startIcon' | 'endIcon' | 'disabled'>> &
    (isConfig extends false ? { onClick: (...args: Partial<Parameters<ButtonProps['onClick']>>) => void } : {}) &
    (isCustomVariant extends true ? Pick<ButtonProps, 'style'> : {})

interface ConfirmationConfigType {
    identifier: string
    confirmationKeyword: string
}

type ButtonConfig<isConfig extends boolean, isCustomVariant extends boolean> =
    | {
          primaryButtonConfig: Pick<ButtonProps, 'isLoading'> & CommonButtonProps<isConfig, isCustomVariant>
          secondaryButtonConfig: CommonButtonProps<isConfig, isCustomVariant>
      }
    | {
          primaryButtonConfig: Pick<ButtonProps, 'isLoading'> & CommonButtonProps<isConfig, isCustomVariant>
          secondaryButtonConfig?: never
      }
    | {
          primaryButtonConfig?: never
          secondaryButtonConfig?: CommonButtonProps<isConfig, isCustomVariant>
      }

type ButtonConfigAndVariantType<isConfig extends boolean> =
    | {
          variant: Exclude<ConfirmationModalVariantType, ConfirmationModalVariantType.custom>
          Icon?: never
          buttonConfig: ButtonConfig<isConfig, false>
      }
    | {
          variant: ConfirmationModalVariantType.custom
          Icon: ReactElement
          buttonConfig: ButtonConfig<isConfig, true>
      }

export type ConfirmationModalProps<isConfig extends boolean = false> = PropsWithChildren<{
    title: string
    subtitle: ReactNode
    /**
     * @default true
     */
    shouldCloseOnEscape?: boolean
    confirmationConfig?: ConfirmationConfigType
}> &
    ButtonConfigAndVariantType<isConfig> &
    (isConfig extends false
        ? {
              handleClose: (e?: SyntheticEvent) => void
              showConfirmationModal: boolean
          }
        : {})

export type ConfirmationModalBodyProps = Omit<ConfirmationModalProps, 'showConfirmationModal'>
