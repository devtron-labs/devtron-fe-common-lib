import { ComponentProps, ReactNode, useMemo } from 'react'

import { Tooltip } from '@Common/Tooltip'

import { ErrorBar } from '../Error'
import { ShowMoreText } from '../ShowMoreText'
import { AppStatus } from '../StatusComponent'
import AppStatusContent from './AppStatusContent'
import { APP_STATUS_CUSTOM_MESSAGES } from './constants'
import { AppStatusBodyProps } from './types'
import { getAppStatusMessageFromAppDetails } from './utils'

const InfoCardItem = ({ heading, value, isLast = false }: { heading: string; value: ReactNode; isLast?: boolean }) => (
    <div className={`py-12 px-16 flexbox dc__gap-16 ${!isLast ? 'border__secondary--bottom' : ''}`}>
        <Tooltip content={heading}>
            <h3 className="cn-9 fs-13 fw-4 lh-1-5 dc__truncate m-0 dc__no-shrink w-140">{heading}</h3>
        </Tooltip>

        {typeof value === 'string' ? (
            <ShowMoreText
                key={`show-more-text-${value}`}
                textClass="cn-9 fs-13 fw-4 lh-1-5"
                containerClass="pr-20"
                text={value}
            />
        ) : (
            value
        )}
    </div>
)

export const AppStatusBody = ({ appDetails, type, handleShowConfigDriftModal }: AppStatusBodyProps) => {
    const appStatus = appDetails.resourceTree?.status?.toUpperCase() || appDetails.appStatus
    const message = useMemo(() => getAppStatusMessageFromAppDetails(appDetails), [appDetails])
    const customMessage =
        type === 'stack-manager'
            ? 'The installation will complete when status for all the below resources become HEALTHY.'
            : APP_STATUS_CUSTOM_MESSAGES[appDetails.resourceTree?.status?.toUpperCase()]

    const infoCardItems: (Omit<ComponentProps<typeof InfoCardItem>, 'isLast'> & { id: number })[] = [
        {
            id: 1,
            heading: type !== 'stack-manager' ? 'Application Status' : 'Status',
            value: appStatus ? <AppStatus status={appStatus} /> : '--',
        },
        ...(message
            ? [
                  {
                      id: 2,
                      heading: 'Message',
                      value: message,
                  },
              ]
            : []),
        ...(customMessage
            ? [
                  {
                      id: 3,
                      heading: 'Message',
                      value: customMessage,
                  },
              ]
            : []),
    ]

    return (
        <div className="flexbox-col dc__gap-16 p-20 dc__overflow-auto">
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

            {/* TODO: Test */}
            <ErrorBar appDetails={appDetails} />

            <AppStatusContent appDetails={appDetails} handleShowConfigDriftModal={handleShowConfigDriftModal} />
        </div>
    )
}
