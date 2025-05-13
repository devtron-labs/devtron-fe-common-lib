import { ComponentProps, PropsWithChildren, ReactNode } from 'react'

import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'
import { getAppDetailsURL } from '@Shared/Helpers'

import { Button, ButtonComponentType, ButtonVariantType } from '../Button'
import { DeploymentStatusDetailBreakdown } from '../CICDHistory'
import { ErrorBar } from '../Error'
import { Icon } from '../Icon'
import { ShowMoreText } from '../ShowMoreText'
import { AppStatus, DeploymentStatus } from '../StatusComponent'
import AppStatusContent from './AppStatusContent'
import { APP_STATUS_CUSTOM_MESSAGES } from './constants'
import { AppStatusBodyProps, AppStatusModalTabType } from './types'
import { getAppStatusMessageFromAppDetails } from './utils'

const InfoCardItem = ({ heading, value, isLast = false }: { heading: string; value: ReactNode; isLast?: boolean }) => (
    <div
        className={`py-12 px-16 dc__grid dc__column-gap-16 info-card-item dc__align-items-center ${!isLast ? 'border__secondary--bottom' : ''}`}
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

const StatusHeadingContainer = ({
    children,
    type,
    appId,
    envId,
}: PropsWithChildren<Pick<AppStatusBodyProps, 'type'>> & { appId: number; envId?: number }) => (
    <div className="flexbox dc__content-space w-100">
        {children}
        {type === 'release' ? (
            <Button
                dataTestId="visit-app-details"
                component={ButtonComponentType.link}
                variant={ButtonVariantType.secondary}
                size={ComponentSizeType.xs}
                endIcon={<Icon name="ic-arrow-square-out" color={null} />}
                text="Visit app"
                linkProps={{
                    to: getAppDetailsURL(appId, envId),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                }}
            />
        ) : null}
    </div>
)

export const AppStatusBody = ({
    appDetails,
    type,
    handleShowConfigDriftModal,
    deploymentStatusDetailsBreakdownData,
    selectedTab,
}: AppStatusBodyProps) => {
    const appStatus = appDetails.resourceTree?.status?.toUpperCase() || appDetails.appStatus

    const getAppStatusInfoCardItems = (): (Omit<ComponentProps<typeof InfoCardItem>, 'isLast'> & { id: string })[] => {
        const message = getAppStatusMessageFromAppDetails(appDetails)
        const customMessage =
            type === 'stack-manager'
                ? 'The installation will complete when status for all the below resources become HEALTHY.'
                : APP_STATUS_CUSTOM_MESSAGES[appStatus]

        return [
            {
                id: `app-status-${1}`,
                heading: type !== 'stack-manager' ? 'Application Status' : 'Status',
                value: (
                    <StatusHeadingContainer type={type} appId={appDetails.appId} envId={appDetails.environmentId}>
                        {appStatus ? <AppStatus status={appStatus} showAnimatedIcon /> : '--'}
                    </StatusHeadingContainer>
                ),
            },
            ...(message
                ? [
                      {
                          id: `app-status-${2}`,
                          heading: 'Message',
                          value: message,
                      },
                  ]
                : []),
            ...(customMessage
                ? [
                      {
                          id: `app-status-${3}`,
                          heading: 'Message',
                          value: customMessage,
                      },
                  ]
                : []),
        ]
    }

    const infoCardItems: ReturnType<typeof getAppStatusInfoCardItems> =
        selectedTab === AppStatusModalTabType.APP_STATUS
            ? getAppStatusInfoCardItems()
            : [
                  {
                      id: `deployment-status-${1}`,
                      heading: 'Deployment Status',
                      value: (
                          <StatusHeadingContainer type={type} appId={appDetails.appId} envId={appDetails.environmentId}>
                              {deploymentStatusDetailsBreakdownData?.deploymentStatus ? (
                                  <DeploymentStatus
                                      status={deploymentStatusDetailsBreakdownData.deploymentStatus}
                                      showAnimatedIcon
                                  />
                              ) : (
                                  '--'
                              )}
                          </StatusHeadingContainer>
                      ),
                  },
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

            {selectedTab === AppStatusModalTabType.APP_STATUS ? (
                <AppStatusContent appDetails={appDetails} handleShowConfigDriftModal={handleShowConfigDriftModal} />
            ) : (
                <DeploymentStatusDetailBreakdown
                    deploymentStatusDetailsBreakdownData={deploymentStatusDetailsBreakdownData}
                    isVirtualEnvironment={appDetails.isVirtualEnvironment}
                    appDetails={appDetails}
                />
            )}
        </div>
    )
}
