import { Fragment, useEffect, useRef, useState } from 'react'

import NoAppStatusImage from '@Images/no-artifact.webp'
import { abortPreviousRequests, getIsRequestAborted } from '@Common/API'
import { DISCORD_LINK } from '@Common/Constants'
import { Drawer } from '@Common/Drawer'
import { GenericEmptyState } from '@Common/EmptyState'
import { stopPropagation, useAsync } from '@Common/Helper'
import { ComponentSizeType } from '@Shared/constants'

import { APIResponseHandler } from '../APIResponseHandler'
import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { AppStatusBody } from './AppStatusBody'
import { getAppDetails } from './service'
import { AppStatusModalProps } from './types'

import './AppStatusModal.scss'

const AppStatusModal = ({
    titleSegments,
    handleClose,
    type,
    appDetails: appDetailsProp,
    isConfigDriftEnabled,
    configDriftModal: ConfigDriftModal,
    appId,
    envId,
}: AppStatusModalProps) => {
    const [showConfigDriftModal, setShowConfigDriftModal] = useState(false)

    const abortControllerRef = useRef<AbortController>(new AbortController())
    const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const getAppDetailsWrapper = async () => {
        const response = await abortPreviousRequests(
            () => getAppDetails(appId, envId, abortControllerRef),
            abortControllerRef,
        )

        return response
    }

    const [
        areInitialAppDetailsLoading,
        fetchedAppDetails,
        fetchedAppDetailsError,
        reloadInitialAppDetails,
        setFetchedAppDetails,
    ] = useAsync(getAppDetailsWrapper, [appId, envId], type === 'release')

    const handleExternalSync = async () => {
        try {
            pollingTimeoutRef.current = setTimeout(
                async () => {
                    const response = await getAppDetailsWrapper()
                    setFetchedAppDetails(response)
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    handleExternalSync()
                },
                Number(window._env_.DEVTRON_APP_DETAILS_POLLING_INTERVAL) || 30000,
            )
        } catch {
            // Do nothing
        }
    }

    const areInitialAppDetailsLoadingWithAbortedError =
        areInitialAppDetailsLoading || getIsRequestAborted(fetchedAppDetailsError)

    const appDetails = type === 'release' ? fetchedAppDetails : appDetailsProp

    // Adding useEffect to initiate timer for external sync and clear it on unmount
    useEffect(() => {
        if (
            !areInitialAppDetailsLoading &&
            !fetchedAppDetailsError &&
            fetchedAppDetails &&
            !pollingTimeoutRef.current
        ) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handleExternalSync()
        }

        return () => {
            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current)
            }

            abortControllerRef.current.abort()
        }
    }, [areInitialAppDetailsLoading, fetchedAppDetails, fetchedAppDetailsError])

    const handleShowConfigDriftModal = isConfigDriftEnabled
        ? () => {
              setShowConfigDriftModal(true)
          }
        : null

    const handleCloseConfigDriftModal = () => {
        setShowConfigDriftModal(false)
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

    const renderContent = () => {
        if (!appDetails?.resourceTree) {
            return <GenericEmptyState image={NoAppStatusImage} title="Application status is not available" />
        }

        return (
            <>
                <AppStatusBody
                    appDetails={appDetails}
                    type={type}
                    handleShowConfigDriftModal={handleShowConfigDriftModal}
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

    return (
        <Drawer position="right" width="1024px" onClose={handleClose} onEscape={handleClose}>
            <div
                className="flexbox-col dc__content-space h-100 border__primary--left bg__modal--primary shadow__modal app-status-modal"
                onClick={stopPropagation}
            >
                <div className="flexbox-col px-20 border__primary--bottom dc__no-shrink">
                    <div className="flexbox py-12 dc__content-space">
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
                </div>

                <div className="flexbox-col flex-grow-1 dc__overflow-auto dc__gap-16 dc__content-space">
                    <APIResponseHandler
                        isLoading={areInitialAppDetailsLoadingWithAbortedError}
                        progressingProps={{
                            pageLoader: true,
                        }}
                        error={fetchedAppDetailsError}
                        errorScreenManagerProps={{
                            code: fetchedAppDetailsError?.code,
                            reload: reloadInitialAppDetails,
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
