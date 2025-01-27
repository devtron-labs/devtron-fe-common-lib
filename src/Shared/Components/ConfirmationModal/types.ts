import { ReactElement, ReactNode, SyntheticEvent } from 'react'
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

interface CustomInputConfig {
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

type CustomInputConfigOrChildrenType =
    | {
          customInputConfig: CustomInputConfig
          children?: never
      }
    | {
          customInputConfig?: never
          children: ReactNode
      }
    | {
          customInputConfig?: never
          children?: never
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

export type ConfirmationModalProps<isConfig extends boolean = false> = {
    title: string
    subtitle: ReactNode
    dataTestId?: string
    /**
     * @default true
     */
    shouldCloseOnEscape?: boolean
} & ButtonConfigAndVariantType<isConfig> &
    CustomInputConfigOrChildrenType &
    (isConfig extends false
        ? {
              handleClose: (e?: SyntheticEvent) => void
              showConfirmationModal: boolean
          }
        : {})

export type ConfirmationModalBodyProps = Omit<ConfirmationModalProps, 'showConfirmationModal'>

export type DeleteComponentModalProps = {
    // Required Props
    title: string
    showConfirmationModal: boolean
    closeConfirmationModal: () => void
    onDelete: () => void

    // Optional Customization
    primaryButtonText?: string
    component?: string
    description?: ReactNode
    successToastMessage?: string
    isLoading?: boolean
    renderCannotDeleteConfirmationSubTitle?: ReactNode
    errorCodeToShowCannotDeleteDialog?: number
    reload?: () => void

    // Additional Configuration
    shouldStopPropagation?: boolean
    disabled?: boolean
    url?: string
    children?: ReactNode
}

export interface CannotDeleteModalProps
    extends Partial<Pick<DeleteComponentModalProps, 'title' | 'description' | 'component' | 'closeConfirmationModal'>> {
    showCannotDeleteDialogModal: boolean
}

export interface ForceDeleteConfirmationProps
    extends Partial<
        Pick<
            DeleteComponentModalProps,
            'title' | 'description' | 'onDelete' | 'showConfirmationModal' | 'closeConfirmationModal'
        >
    > {}
