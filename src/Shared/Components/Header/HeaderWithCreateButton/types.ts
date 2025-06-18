import { ActionMenuProps } from '@Shared/Components/ActionMenu'

import { PageHeaderType } from '../types'

export interface HeaderWithCreateButtonProps {
    headerName: string
    additionalHeaderInfo: PageHeaderType['additionalHeaderInfo']
}

export enum CreateActionMenuItems {
    CUSTOM_APP = 'create-custom-app',
    CHART_STORE = 'create-from-chart-store',
    JOB = 'create-job',
}

export type CreateActionMenuProps = ActionMenuProps<CreateActionMenuItems>
