import { ReactComponent as ICInfoFilled } from '@Icons/ic-info-filled.svg'
import { ReactComponent as ICError } from '@Icons/ic-error.svg'
import { ReactComponent as ICSuccess } from '@Icons/ic-success.svg'
import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'
import { ReactComponent as ICHelpOutline } from '@Icons/ic-help-outline.svg'
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
    help: <ICHelpOutline className="fcv-5" />,
    information: <ICInfoFilled />,
    success: <ICSuccess />,
    warning: <ICWarningY5 />,
}
