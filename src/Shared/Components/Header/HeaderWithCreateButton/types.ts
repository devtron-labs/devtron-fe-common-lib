import { ActionMenuProps } from '@Shared/Components/ActionMenu'

export interface HeaderWithCreateButtonProps {
    headerName: string
}

export enum CreateActionMenuItems {
    CUSTOM_APP = 'create-custom-app',
    CHART_STORE = 'create-from-chart-store',
    JOB = 'create-job',
}

export type CreateActionMenuProps = ActionMenuProps<CreateActionMenuItems>
