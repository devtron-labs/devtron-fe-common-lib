import { Fragment, useEffect, useRef, useState } from 'react'

import NoAppStatusImage from '@Images/no-artifact.webp'
import { abortPreviousRequests, getIsRequestAborted } from '@Common/API'
import { DISCORD_LINK } from '@Common/Constants'
import { Drawer } from '@Common/Drawer'
import { GenericEmptyState } from '@Common/EmptyState'
import { handleUTCTime, stopPropagation, useAsync } from '@Common/Helper'
import { DeploymentAppTypes, ImageType } from '@Common/Types'
import { ComponentSizeType } from '@Shared/constants'
import { AppType } from '@Shared/types'

import { APIResponseHandler } from '../APIResponseHandler'
import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'
import { PROGRESSING_DEPLOYMENT_STATUS } from '../DeploymentStatusBreakdown'
import { Icon } from '../Icon'
import { DeploymentStatus } from '../StatusComponent'
import { AppStatusBody } from './AppStatusBody'
import AppStatusModalTabList from './AppStatusModalTabList'
import { getAppDetails, getDeploymentStatusWithTimeline } from './service'
import { AppStatusModalProps, AppStatusModalTabType } from './types'
import { getEmptyViewImageFromHelmDeploymentStatus, getShowDeploymentStatusModal } from './utils'

import './AppStatusModal.scss'

const AppStatusModal = ({
    titleSegments,
    handleClose,
    type,
    appDetails: appDetailsProp,
    processVirtualEnvironmentDeploymentData,
    handleUpdateDeploymentStatusDetailsBreakdownData,
    isConfigDriftEnabled,
    configDriftModal: ConfigDriftModal,
    appId,
    envId,
    initialTab,
    debugWithAIButton,
}: AppStatusModalProps) => {
    const [showConfigDriftModal, setShowConfigDriftModal] = useState(false)
    const [selectedTab, setSelectedTab] = useState<AppStatusModalTabType>(initialTab || null)

    const appDetailsAbortControllerRef = useRef<AbortController>(new AbortController())
    const appDetailsPollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const getAppDetailsWrapper = async () => {
        const response = await abortPreviousRequests(
            () =>
                getAppDetails({
                    appId,
                    envId,
                    abortControllerRef: appDetailsAbortControllerRef,
                }),
            appDetailsAbortControllerRef,
        )
        return response
    }

    const [
        areInitialAppDetailsLoading,
        fetchedAppDetails,
        fetchedAppDetailsError,
        reloadInitialAppDetails,
        setFetchedAppDetails,
    ] = useAsync(getAppDetailsWrapper, [], type === 'release')

    const appDetails = type === 'release' ? fetchedAppDetails : appDetailsProp

    const showDeploymentStatusModal = getShowDeploymentStatusModal({ type, appDetails })
    const deploymentStatusAbortControllerRef = useRef<AbortController>(new AbortController())
    const deploymentStatusPollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const getDeploymentStatusWrapper = async () => {
        const response = await abortPreviousRequests(
            () =>
                getDeploymentStatusWithTimeline({
                    abortControllerRef: deploymentStatusAbortControllerRef,
                    appId:
                        appDetails.appType === AppType.DEVTRON_HELM_CHART
                            ? appDetails.installedAppId
                            : appDetails.appId,
                    envId: appDetails.environmentId,
                    showTimeline:
                        selectedTab === AppStatusModalTabType.DEPLOYMENT_STATUS &&
                        appDetails.deploymentAppType !== DeploymentAppTypes.HELM &&
                        !appDetails.isVirtualEnvironment,
                    virtualEnvironmentConfig: appDetails.isVirtualEnvironment
                        ? {
                              processVirtualEnvironmentDeploymentData,
                              wfrId: appDetails.resourceTree?.wfrId,
                          }
                        : null,
                    isHelmApp: appDetails.appType === AppType.DEVTRON_HELM_CHART,
                }),
            deploymentStatusAbortControllerRef,
        )

        handleUpdateDeploymentStatusDetailsBreakdownData?.(response)

        return response
    }

    const [
        isDeploymentTimelineLoading,
        deploymentStatusDetailsBreakdownData,
        deploymentStatusDetailsBreakdownDataError,
        reloadDeploymentStatusDetailsBreakdownData,
        setDeploymentStatusDetailsBreakdownData,
    ] = useAsync(getDeploymentStatusWrapper, [showDeploymentStatusModal, selectedTab], !!showDeploymentStatusModal, {
        resetOnChange: false,
    })

    const handleAppDetailsExternalSync = async () => {
        appDetailsPollingTimeoutRef.current = setTimeout(
            async () => {
                try {
                    const response = await getAppDetailsWrapper()
                    setFetchedAppDetails(response)
                } catch {
                    // Do nothing
                }
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                handleAppDetailsExternalSync()
            },
            Number(window._env_.DEVTRON_APP_DETAILS_POLLING_INTERVAL) || 30000,
        )
    }

    const handleDeploymentStatusExternalSync = async () => {
        const isDeploymentInProgress = PROGRESSING_DEPLOYMENT_STATUS.includes(
            deploymentStatusDetailsBreakdownData?.deploymentStatus,
        )

        const pollingIntervalFromFlag =
            Number(
                appDetails.appType !== AppType.DEVTRON_HELM_CHART
                    ? window._env_.DEVTRON_APP_DETAILS_POLLING_INTERVAL
                    : window._env_.HELM_APP_DETAILS_POLLING_INTERVAL,
            ) || 30000

        deploymentStatusPollingTimeoutRef.current = setTimeout(
            async () => {
                try {
                    const response = await getDeploymentStatusWrapper()
                    setDeploymentStatusDetailsBreakdownData(response)
                } catch {
                    // Do nothing
                }
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                handleDeploymentStatusExternalSync()
            },
            isDeploymentInProgress ? 10000 : pollingIntervalFromFlag,
        )
    }

    const areInitialAppDetailsLoadingWithAbortedError =
        areInitialAppDetailsLoading || getIsRequestAborted(fetchedAppDetailsError)

    const isDeploymentStatusLoadingWithAbortedError =
        isDeploymentTimelineLoading || getIsRequestAborted(deploymentStatusDetailsBreakdownDataError)

    const isTimelineRequiredAndLoading =
        selectedTab === AppStatusModalTabType.DEPLOYMENT_STATUS && isDeploymentStatusLoadingWithAbortedError

    // Adding useEffect to initiate timer for external sync and clear it on unmount
    useEffect(() => {
        if (
            !areInitialAppDetailsLoading &&
            !fetchedAppDetailsError &&
            fetchedAppDetails &&
            !appDetailsPollingTimeoutRef.current
        ) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handleAppDetailsExternalSync()
        }
    }, [areInitialAppDetailsLoading, fetchedAppDetails, fetchedAppDetailsError])

    useEffect(() => {
        if (
            !isDeploymentTimelineLoading &&
            !deploymentStatusDetailsBreakdownDataError &&
            deploymentStatusDetailsBreakdownData &&
            !deploymentStatusPollingTimeoutRef.current
        ) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handleDeploymentStatusExternalSync()
        }
    }, [isDeploymentTimelineLoading, deploymentStatusDetailsBreakdownData, deploymentStatusDetailsBreakdownDataError])

    const handleClearDeploymentStatusTimeout = () => {
        if (deploymentStatusPollingTimeoutRef.current) {
            clearTimeout(deploymentStatusPollingTimeoutRef.current)
            deploymentStatusPollingTimeoutRef.current = null
        }
    }

    useEffect(
        () => () => {
            if (appDetailsPollingTimeoutRef.current) {
                clearTimeout(appDetailsPollingTimeoutRef.current)
            }

            handleClearDeploymentStatusTimeout()

            appDetailsAbortControllerRef.current.abort()
            deploymentStatusAbortControllerRef.current.abort()
        },
        [],
    )

    const handleShowConfigDriftModal = isConfigDriftEnabled
        ? () => {
              setShowConfigDriftModal(true)
          }
        : null

    const handleCloseConfigDriftModal = () => {
        handleClose()
        setShowConfigDriftModal(false)
    }

    const handleSelectTab = async (updatedTab: AppStatusModalTabType) => {
        handleClearDeploymentStatusTimeout()
        setSelectedTab(updatedTab)
    }

    if (showConfigDriftModal) {
        return (
            <ConfigDriftModal
                appId={appDetails.appId}
                envId={+appDetails.environmentId}
                handleCloseModal={handleCloseConfigDriftModal}
            />
        )
    }

    const filteredTitleSegments = (titleSegments || []).filter((segment) => !!segment)

    const getEmptyStateMessage = () => {
        if (!selectedTab) {
            return 'Status is not available'
        }

        if (selectedTab === AppStatusModalTabType.APP_STATUS) {
            if (!appDetails?.resourceTree) {
                return 'Application status is not available'
            }
            return ''
        }

        if (!deploymentStatusDetailsBreakdownData || !getShowDeploymentStatusModal({ type, appDetails })) {
            return 'Deployment status is not available'
        }

        return ''
    }

    const renderContent = () => {
        const emptyStateMessage = getEmptyStateMessage()

        if (emptyStateMessage) {
            return <GenericEmptyState image={NoAppStatusImage} title={emptyStateMessage} />
        }

        // Empty states for helm based deployment status
        if (
            selectedTab === AppStatusModalTabType.DEPLOYMENT_STATUS &&
            appDetails.deploymentAppType === DeploymentAppTypes.HELM
        ) {
            return (
                <GenericEmptyState
                    image={getEmptyViewImageFromHelmDeploymentStatus(
                        deploymentStatusDetailsBreakdownData.deploymentStatus,
                    )}
                    title={
                        <div className="flexbox dc__gap-4 dc__align-items-center">
                            <span className="fs-13 lh-20">Deployment status:</span>
                            <DeploymentStatus status={deploymentStatusDetailsBreakdownData.deploymentStatus} hideIcon />
                        </div>
                    }
                    subTitle={`Triggered at ${handleUTCTime(deploymentStatusDetailsBreakdownData.deploymentTriggerTime)} by ${deploymentStatusDetailsBreakdownData.triggeredBy}`}
                    imageType={ImageType.Large}
                />
            )
        }

        return (
            <>
                <AppStatusBody
                    appDetails={appDetails}
                    type={type}
                    handleShowConfigDriftModal={handleShowConfigDriftModal}
                    deploymentStatusDetailsBreakdownData={deploymentStatusDetailsBreakdownData}
                    selectedTab={selectedTab}
                    debugWithAIButton={debugWithAIButton}
                />

                {type === 'stack-manager' && (
                    <div className="bg__primary flexbox dc__align-items-center dc__content-space dc__border-top py-16 px-20 fs-13 fw-6">
                        <span className="fs-13 fw-6">Facing issues in installing integration?</span>

                        <Button
                            dataTestId="chat-with-support-button"
                            component={ButtonComponentType.anchor}
                            anchorProps={{
                                href: DISCORD_LINK,
                                target: '_blank',
                                rel: 'noreferrer noopener',
                            }}
                            startIcon={<Icon name="ic-chat-circle-dots" color={null} />}
                            text="Chat with support"
                        />
                    </div>
                )}
            </>
        )
    }

    const timelineError =
        selectedTab === AppStatusModalTabType.DEPLOYMENT_STATUS ? deploymentStatusDetailsBreakdownDataError : null

    const bodyErrorData = fetchedAppDetailsError || timelineError
    const bodyErrorReload = fetchedAppDetailsError
        ? reloadInitialAppDetails
        : reloadDeploymentStatusDetailsBreakdownData

    return (
        <Drawer position="right" width="1024px" onClose={handleClose} onEscape={handleClose}>
            <div
                className="flexbox-col dc__content-space h-100 border__primary--left bg__modal--primary shadow__modal app-status-modal"
                onClick={stopPropagation}
            >
                <div className="app-status-modal__header pt-12 flexbox-col px-20 dc__gap-12 border__primary--bottom dc__no-shrink">
                    <div className="flexbox dc__content-space">
                        <h2 className="m-0 dc__truncate fs-16 fw-6 lh-1-5 dc__gap-4">
                            {filteredTitleSegments.map((segment, index) => (
                                <Fragment key={segment}>
                                    {segment}
                                    {index !== titleSegments.length - 1 && <span className="cn-6 fs-16 fw-4">/</span>}
                                </Fragment>
                            ))}
                        </h2>

                        <Button
                            dataTestId="close-modal-header-icon-button"
                            variant={ButtonVariantType.borderLess}
                            style={ButtonStyleType.negativeGrey}
                            size={ComponentSizeType.xs}
                            icon={<Icon name="ic-close-large" color={null} />}
                            ariaLabel="Close modal"
                            showAriaLabelInTippy={false}
                            onClick={handleClose}
                        />
                    </div>

                    {!areInitialAppDetailsLoadingWithAbortedError && !fetchedAppDetailsError && !!appDetails && (
                        <AppStatusModalTabList
                            handleSelectTab={handleSelectTab}
                            appDetails={appDetails}
                            type={type}
                            selectedTab={selectedTab}
                            deploymentStatusDetailsBreakdownData={deploymentStatusDetailsBreakdownData}
                        />
                    )}
                </div>

                <div className="flexbox-col flex-grow-1 dc__overflow-auto dc__gap-16 dc__content-space">
                    <APIResponseHandler
                        isLoading={areInitialAppDetailsLoadingWithAbortedError || isTimelineRequiredAndLoading}
                        progressingProps={{
                            pageLoader: true,
                        }}
                        error={bodyErrorData}
                        errorScreenManagerProps={{
                            code: bodyErrorData?.code,
                            reload: bodyErrorReload,
                        }}
                    >
                        {renderContent()}
                    </APIResponseHandler>
                </div>
            </div>
        </Drawer>
    )
}

export default AppStatusModal
