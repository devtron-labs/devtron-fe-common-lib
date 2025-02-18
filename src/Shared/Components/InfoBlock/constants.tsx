import { ReactComponent as ICInfoFilled } from '@Icons/ic-info-filled.svg'
import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICSuccess } from '@Icons/ic-success.svg'
import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'
import { ReactComponent as ICHelp } from '@Icons/ic-help.svg'
import { ComponentSizeType } from '@Shared/constants'
import { ButtonProps } from '../Button'
import { InfoBlockProps } from './types'

export const VARIANT_TO_BG_MAP: Record<InfoBlockProps['variant'], string> = {
    error: 'bcr-1 er-2',
    help: 'bcv-1 ev-2',
    information: 'bcb-1 eb-2',
    success: 'bcg-1 eg-2',
    warning: 'bcy-1 ey-2',
}

export const VARIANT_TO_ICON_MAP: Record<InfoBlockProps['variant'], InfoBlockProps['customIcon']> = {
    error: <ICError />,
    help: <ICHelp className="fcv-5" />,
    information: <ICInfoFilled />,
    success: <ICSuccess />,
    warning: <ICWarningY5 />,
}

export const CONTAINER_SIZE_TO_CLASS_MAP: Record<InfoBlockProps['size'], string> = {
    [ComponentSizeType.large]: 'px-12',
    [ComponentSizeType.medium]: 'px-8',
}

export const SIZE_TO_ICON_CLASS_MAP: Record<InfoBlockProps['size'], string> = {
    [ComponentSizeType.large]: 'icon-dim-20',
    [ComponentSizeType.medium]: 'icon-dim-18',
}

export const CONTAINER_SIZE_TO_BUTTON_SIZE: Record<InfoBlockProps['size'], ButtonProps['size']> = {
    [ComponentSizeType.large]: ComponentSizeType.medium,
    [ComponentSizeType.medium]: ComponentSizeType.small,
}
