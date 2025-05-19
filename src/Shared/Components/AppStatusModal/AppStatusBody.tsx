import { ComponentProps, ReactNode } from 'react'

import { getAIAnalyticsEvents } from '@Common/Helper'
import { Tooltip } from '@Common/Tooltip'
import { AppType } from '@Shared/types'

import { ErrorBar } from '../Error'
import { ShowMoreText } from '../ShowMoreText'
import { AppStatus, StatusType } from '../StatusComponent'
import AppStatusContent from './AppStatusContent'
import { APP_STATUS_CUSTOM_MESSAGES } from './constants'
import { AppStatusBodyProps } from './types'
import { getAppStatusMessageFromAppDetails } from './utils'

const InfoCardItem = ({ heading, value, isLast = false }: { heading: string; value: ReactNode; isLast?: boolean }) => (
    <div
        className={`py-12 px-16 dc__grid dc__column-gap-16 info-card-item ${!isLast ? 'border__secondary--bottom' : ''}`}
    >
        <Tooltip content={heading}>
            <h3 className="cn-9 fs-13 fw-4 lh-1-5 dc__truncate m-0 dc__no-shrink">{heading}</h3>
        </Tooltip>

        {typeof value === 'string' ? (
            <ShowMoreText
                key={`show-more-text-${value}`}
                containerClass="mw-720 pr-20"
                textClass="cn-9 fs-13 fw-4 lh-1-5"
                text={value}
            />
        ) : (
            value
        )}
    </div>
)

export const AppStatusBody = ({
    appDetails,
    type,
    handleShowConfigDriftModal,
    debugWithAIButton: ExplainWithAIButton,
}: AppStatusBodyProps) => {
    const appStatus = appDetails.resourceTree?.status?.toUpperCase() || appDetails.appStatus
    const message = getAppStatusMessageFromAppDetails(appDetails)
    const debugNode = appDetails.resourceTree?.nodes?.find(
        (node) => node.kind === 'Deployment' || node.kind === 'Rollout',
    )
    const debugObject = `${debugNode?.kind}/${debugNode?.name}`
    const customMessage =
        type === 'stack-manager'
            ? 'The installation will complete when status for all the below resources become HEALTHY.'
            : APP_STATUS_CUSTOM_MESSAGES[appStatus]

    const infoCardItems: (Omit<ComponentProps<typeof InfoCardItem>, 'isLast'> & { id: number })[] = [
        {
            id: 1,
            heading: type !== 'stack-manager' ? 'Application Status' : 'Status',
            value: (
                <div className="flexbox w-100 dc__content-space dc__gap-8">
                    {appStatus ? <AppStatus status={appStatus} /> : '--'}

                    {ExplainWithAIButton &&
                        appDetails.appStatus?.toLowerCase() !== StatusType.HEALTHY.toLowerCase() &&
                        (debugNode || message) && (
                            <ExplainWithAIButton
                                intelligenceConfig={{
                                    clusterId: appDetails.clusterId,
                                    metadata: {
                                        ...(debugNode ? { object: debugObject } : { message }),
                                        namespace: appDetails.namespace,
                                        status: debugNode?.health?.status ?? appDetails.appStatus,
                                    },
                                    prompt: `Debug ${message || 'error'} ${debugNode ? `of ${debugObject}` : ''} in ${appDetails.namespace}`,
                                    analyticsCategory: getAIAnalyticsEvents(
                                        'APP_STATUS',
                                        appDetails.appStatus as AppType,
                                    ),
                                }}
                            />
                        )}
                </div>
            ),
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
        <div className="flexbox-col px-20 dc__gap-16 dc__overflow-auto">
            {/* Info card */}
            <div className="flexbox-col pt-20">
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

            <ErrorBar appDetails={appDetails} useParentMargin={false} />

            <AppStatusContent appDetails={appDetails} handleShowConfigDriftModal={handleShowConfigDriftModal} />
        </div>
    )
}
