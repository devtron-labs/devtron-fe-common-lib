import { ComponentProps } from 'react'

import { getAIAnalyticsEvents } from '@Common/Helper'
import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'
import { getAppDetailsURL } from '@Shared/Helpers'

import { Button, ButtonComponentType, ButtonVariantType } from '../Button'
import { DeploymentStatusDetailBreakdown } from '../CICDHistory'
import { DEPLOYMENT_STATUS_TEXT_MAP } from '../DeploymentStatusBreakdown'
import { ErrorBar } from '../Error'
import { Icon } from '../Icon'
import { ShowMoreText } from '../ShowMoreText'
import { AppStatus, DeploymentStatus, StatusType } from '../StatusComponent'
import AppStatusContent from './AppStatusContent'
import { APP_STATUS_CUSTOM_MESSAGES } from './constants'
import { AppStatusBodyProps, AppStatusModalTabType, InfoCardItemProps, StatusHeadingContainerProps } from './types'
import { getAppStatusMessageFromAppDetails } from './utils'

const InfoCardItem = ({ heading, value, isLast = false, alignCenter = false }: InfoCardItemProps) => (
    <div
        className={`py-12 px-16 dc__grid dc__column-gap-16 info-card-item ${alignCenter ? 'dc__align-items-center' : ''} ${!isLast ? 'border__secondary--bottom' : ''}`}
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

const StatusHeadingContainer = ({ children, type, appId, envId, actionItem }: StatusHeadingContainerProps) => (
    <div className="flexbox dc__content-space w-100">
        {children}

        <div className="flexbox dc__align-items-center dc__gap-8">
            {actionItem}
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
    </div>
)

export const AppStatusBody = ({
    appDetails,
    type,
    handleShowConfigDriftModal,
    deploymentStatusDetailsBreakdownData,
    selectedTab,
    debugWithAIButton: ExplainWithAIButton,
}: AppStatusBodyProps) => {
    const appStatus = appDetails.resourceTree?.status?.toUpperCase() || appDetails.appStatus

    const getAppStatusInfoCardItems = (): (Omit<ComponentProps<typeof InfoCardItem>, 'isLast'> & { id: string })[] => {
        const message = getAppStatusMessageFromAppDetails(appDetails)
        const customMessage =
            type === 'stack-manager'
                ? 'The installation will complete when status for all the below resources become HEALTHY.'
                : APP_STATUS_CUSTOM_MESSAGES[appStatus]

        const debugNode = appDetails.resourceTree?.nodes?.find(
            (node) => node.kind === 'Deployment' || node.kind === 'Rollout',
        )
        const debugObject = `${debugNode?.kind}/${debugNode?.name}`

        return [
            {
                id: 'app-status-row',
                heading: type !== 'stack-manager' ? 'Application Status' : 'Status',
                value: (
                    <StatusHeadingContainer
                        type={type}
                        appId={appDetails.appId}
                        envId={appDetails.environmentId}
                        actionItem={
                            ExplainWithAIButton &&
                            appStatus?.toLowerCase() !== StatusType.HEALTHY.toLowerCase() &&
                            (debugNode || message) ? (
                                <ExplainWithAIButton
                                    intelligenceConfig={{
                                        clusterId: appDetails.clusterId,
                                        metadata: {
                                            ...(debugNode ? { object: debugObject } : { message }),
                                            namespace: appDetails.namespace,
                                            status: debugNode?.health?.status ?? appStatus,
                                        },
                                        prompt: `Debug ${message || 'error'} ${debugNode ? `of ${debugObject}` : ''} in ${appDetails.namespace}`,
                                        analyticsCategory: getAIAnalyticsEvents('APP_STATUS', appDetails.appType),
                                    }}
                                />
                            ) : null
                        }
                    >
                        {appStatus ? <AppStatus status={appStatus} showAnimatedIcon /> : '--'}
                    </StatusHeadingContainer>
                ),
            },
            ...(message
                ? [
                      {
                          id: 'app-status-primary-message',
                          heading: 'Message',
                          value: message,
                      },
                  ]
                : []),
            ...(customMessage
                ? [
                      {
                          id: 'app-status-secondary-message',
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
                      id: 'deployment-status-row',
                      heading: 'Deployment Status',
                      value: (
                          <StatusHeadingContainer type={type} appId={appDetails.appId} envId={appDetails.environmentId}>
                              {deploymentStatusDetailsBreakdownData?.deploymentStatus ? (
                                  <DeploymentStatus
                                      status={deploymentStatusDetailsBreakdownData.deploymentStatus}
                                      message={
                                          DEPLOYMENT_STATUS_TEXT_MAP[
                                              deploymentStatusDetailsBreakdownData.deploymentStatus
                                          ]
                                      }
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
                <div className="flexbox-col br-8 border__primary bg__primary shadow__card--20">
                    {infoCardItems.map((item, index) => (
                        <InfoCardItem
                            key={item.id}
                            heading={item.heading}
                            value={item.value}
                            isLast={index === infoCardItems.length - 1}
                            alignCenter={item.heading !== 'Message'}
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
                    rootClassName="pb-20"
                    deploymentAppType={appDetails.deploymentAppType}
                />
            )}
        </div>
    )
}
