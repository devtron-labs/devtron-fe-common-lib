import { ReactNode } from 'react'

import { AppDetails } from '@Shared/types'

export interface AppStatusModalProps {
    title: ReactNode
    handleClose: () => void
    type: 'devtron-app' | 'external-apps' | 'stack-manager' | 'release'
    /**
     * If not given
     */
    handleShowConfigDriftModal?: () => void
    /**
     * If given would not poll for app details and resource tree, Polling for gitops timeline would still be done
     */
    appDetails?: AppDetails
}
