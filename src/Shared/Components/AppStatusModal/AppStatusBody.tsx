import { ComponentProps, ReactNode, useMemo } from 'react'

import { Tooltip } from '@Common/Tooltip'

import { ShowMoreText } from '../ShowMoreText'
import { AppStatus } from '../StatusComponent'
import { APP_STATUS_CUSTOM_MESSAGES } from './constants'
import { AppStatusModalProps } from './types'
import { getAppStatusMessageFromAppDetails } from './utils'

const InfoCardItem = ({ heading, value, isLast = false }: { heading: string; value: ReactNode; isLast?: boolean }) => (
    <div
        className={`py-12 px-16 flexbox dc__align-items-center dc__gap-16 ${!isLast ? 'border__secondary--bottom' : ''}`}
    >
        <Tooltip content={heading}>
            <h3 className="cn-9 fs-13 fw-4 lh-1-5 dc__truncate">{heading}</h3>
        </Tooltip>

        {typeof value === 'string' ? <ShowMoreText textClass="cn-9 fs-13 fw-4 lh-1-5" text={value} /> : value}
    </div>
)

export const AppStatusBody = ({ appDetails, type }: Pick<AppStatusModalProps, 'appDetails' | 'type'>) => {
    const message = useMemo(() => getAppStatusMessageFromAppDetails(appDetails), [appDetails])
    const customMessage = APP_STATUS_CUSTOM_MESSAGES[appDetails.resourceTree?.status?.toUpperCase()]

    const infoCardItems: (Omit<ComponentProps<typeof InfoCardItem>, 'isLast'> & { id: number })[] = [
        {
            id: 1,
            heading: type !== 'stack-manager' ? 'Application Status' : 'Status',
            value: <AppStatus status={appDetails.resourceTree?.status?.toUpperCase() || appDetails.appStatus} />,
        },
        message && {
            id: 2,
            heading: 'Message',
            value: message,
        },
        customMessage && {
            id: 3,
            heading: 'Message',
            value: customMessage,
        },
    ]

    return (
        <div className="flexbox-col dc__gap-16">
            {/* Info card */}
            <div className="flexbox-col br-8 border__primary bg__primary shadow__card--secondary">
                {infoCardItems.map((item, index) => (
                    <InfoCardItem
                        key={item.id}
                        heading={item.heading}
                        value={item.value}
                        isLast={index === infoCardItems.length - 1}
                    />
                ))}
            </div>
        </div>
    )
}
