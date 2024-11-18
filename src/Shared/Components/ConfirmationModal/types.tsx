import { FunctionComponent, ReactNode, SVGProps } from 'react'
import { ButtonProps } from '../Button'

export enum ConfirmationModalVariantType {
    info = 'info',
    delete = 'delete',
    warning = 'warning',
    custom = 'custom',
}

interface CommonButtonProps
    extends Pick<ButtonProps, 'dataTestId' | 'onClick' | 'text'>,
        Partial<Pick<ButtonProps, 'startIcon' | 'endIcon'>> {}

interface CustomInputConfig {
    identifier: string
    confirmationKeyword: string
}

type ButtonConfig<PrimaryButtonConfig, SecondaryButtonConfig> =
    | {
          primaryButtonConfig: PrimaryButtonConfig & CommonButtonProps
          secondaryButtonConfig: SecondaryButtonConfig & CommonButtonProps
      }
    | {
          primaryButtonConfig: PrimaryButtonConfig & CommonButtonProps
          secondaryButtonConfig?: never
      }
    | {
          primaryButtonConfig?: never
          secondaryButtonConfig?: SecondaryButtonConfig & CommonButtonProps
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

export type ConfirmationModalProps = {
    title: ReactNode
    subtitle: ReactNode
    handleClose: (e?: any) => void
} & (
    | {
          variant: Exclude<ConfirmationModalVariantType, ConfirmationModalVariantType.custom>
          Icon?: never
          buttonConfig: ButtonConfig<Pick<ButtonProps, 'isLoading' | 'disabled'>, Pick<ButtonProps, 'disabled'>>
      }
    | {
          variant: ConfirmationModalVariantType.custom
          Icon: FunctionComponent<SVGProps<SVGSVGElement>>
          customInputConfig?: never
          children?: ReactNode
          buttonConfig: ButtonConfig<
              Pick<ButtonProps, 'isLoading' | 'disabled' | 'style'>,
              Pick<ButtonProps, 'disabled' | 'style'>
          >
      }
) &
    CustomInputConfigOrChildrenType
