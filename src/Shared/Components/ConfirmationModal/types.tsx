import { FunctionComponent, ReactNode, SVGProps, SyntheticEvent } from 'react'
import { ButtonProps } from '../Button'

export enum ConfirmationModalVariantType {
    info = 'info',
    delete = 'delete',
    warning = 'warning',
    custom = 'custom',
}

interface CommonButtonProps extends Pick<ButtonProps, 'text'>, Partial<Pick<ButtonProps, 'startIcon' | 'endIcon'>> {
    onClick: (e?: SyntheticEvent) => void
}

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

type ButtonConfigAndVariantType =
    | {
          variant: Exclude<ConfirmationModalVariantType, ConfirmationModalVariantType.custom>
          Icon?: never
          buttonConfig: ButtonConfig<Pick<ButtonProps, 'isLoading' | 'disabled'>, Pick<ButtonProps, 'disabled'>>
      }
    | {
          variant: ConfirmationModalVariantType.custom
          Icon: FunctionComponent<SVGProps<SVGSVGElement>>
          buttonConfig: ButtonConfig<
              Pick<ButtonProps, 'isLoading' | 'disabled' | 'style'>,
              Pick<ButtonProps, 'disabled' | 'style'>
          >
      }

export type ConfirmationModalProps = {
    title: string
    subtitle: ReactNode
    handleClose: (e?: SyntheticEvent) => void
    showConfirmationModal: boolean
} & ButtonConfigAndVariantType &
    CustomInputConfigOrChildrenType

export type ConfirmationModalBodyProps = ButtonConfigAndVariantType &
    CustomInputConfigOrChildrenType &
    Pick<ConfirmationModalProps, 'title' | 'subtitle'>
