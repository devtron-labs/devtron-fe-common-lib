/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from 'react'
import Tippy from '@tippyjs/react'

import { ReactComponent as ICMediumPaintBucket } from '@IconsV2/ic-medium-paintbucket.svg'
import { handleAnalyticsEvent } from '@Shared/Analytics'
import { ComponentSizeType } from '@Shared/constants'
import { InstallationType } from '@Shared/types'

import { TippyCustomized, TippyTheme } from '../../../Common'
import { POSTHOG_EVENT_ONBOARDING } from '../../../Common/Constants'
import { useMainContext, useTheme, useUserEmail } from '../../Providers'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { ImageWithFallback } from '../ImageWithFallback'
import { InfoIconTippy } from '../InfoIconTippy'
import { HelpButton } from './HelpButton'
import { IframePromoButton } from './IframePromoButton'
import { ProfileMenu } from './ProfileMenu'
import { getServerInfo } from './service'
import { PageHeaderType, ServerInfo } from './types'
import { handlePostHogEventUpdate, setActionWithExpiry } from './utils'

import './pageHeader.scss'

const PageHeader = ({
    headerName,
    headerImage,
    additionalHeaderInfo,
    showTabs = false,
    renderHeaderTabs,
    isBreadcrumbs = false,
    breadCrumbs,
    renderActionButtons,
    onClose,
    tippyProps,
    closeIcon,
    docPath,
}: PageHeaderType) => {
    const {
        setLoginCount,
        setShowGettingStartedCard,
        sidePanelConfig,
        tempAppWindowConfig,
        featureAskDevtronExpert,
        AskDevtronButton,
    } = useMainContext()
    const { showSwitchThemeLocationTippy, handleShowSwitchThemeLocationTippyChange } = useTheme()

    const {
        isTippyCustomized,
        tippyRedirectLink,
        TippyIcon,
        tippyMessage,
        onClickTippyButton,
        additionalContent,
        tippyHeader,
    } = tippyProps || {}
    const { email } = useUserEmail()
    const [currentServerInfo, setCurrentServerInfo] = useState<{ serverInfo: ServerInfo; fetchingServerInfo: boolean }>(
        {
            serverInfo: undefined,
            fetchingServerInfo: false,
        },
    )

    const getCurrentServerInfo = async () => {
        try {
            const { result } = await getServerInfo(true, true)
            setCurrentServerInfo({
                serverInfo: result,
                fetchingServerInfo: false,
            })
        } catch {
            setCurrentServerInfo({
                serverInfo: currentServerInfo.serverInfo,
                fetchingServerInfo: false,
            })
            // eslint-disable-next-line no-console
            console.error('Error in fetching server info')
        }
    }

    const hideGettingStartedCard = (count?: string) => {
        setShowGettingStartedCard(false)
        if (count) {
            setLoginCount(+count)
        }
    }

    const handleCloseSwitchThemeLocationTippyChange = () => {
        handleShowSwitchThemeLocationTippyChange(false)
    }

    const handleProfileMenuButtonClick = () => {
        handleCloseSwitchThemeLocationTippyChange()
        setActionWithExpiry('clickedOkay', 1)
        hideGettingStartedCard()
    }

    const handleHelpButtonClick = async () => {
        if (
            !window._env_.K8S_CLIENT &&
            currentServerInfo.serverInfo?.installationType !== InstallationType.ENTERPRISE
        ) {
            await getCurrentServerInfo()
        }
        setActionWithExpiry('clickedOkay', 1)
        hideGettingStartedCard()
        await handlePostHogEventUpdate(POSTHOG_EVENT_ONBOARDING.HELP)
        handleAnalyticsEvent({
            category: 'Main Navigation',
            action: `Help Clicked`,
        })
    }

    const renderThemePreferenceLocationTippyContent = () => (
        <div className="px-16 pb-16 flexbox-col dc__gap-4">
            <h6 className="m-0 fs-14 fw-6 lh-20">Theme Preference</h6>
            <p className="m-0 fs-13 fw-4 lh-20">You can change your theme preference here</p>
        </div>
    )

    const renderLogoutHelpSection = () => (
        <>
            {AskDevtronButton &&
                featureAskDevtronExpert &&
                sidePanelConfig.state === 'closed' &&
                !tempAppWindowConfig.open && <AskDevtronButton />}

            <HelpButton
                serverInfo={currentServerInfo.serverInfo}
                fetchingServerInfo={currentServerInfo.fetchingServerInfo}
                onClick={handleHelpButtonClick}
                hideGettingStartedCard={hideGettingStartedCard}
                docPath={docPath}
            />
            {!window._env_.K8S_CLIENT && (
                <TippyCustomized
                    theme={TippyTheme.black}
                    className="w-250"
                    placement="bottom"
                    visible={showSwitchThemeLocationTippy}
                    Icon={ICMediumPaintBucket}
                    iconClass="icon-dim-40 dc__no-shrink"
                    iconSize={40}
                    additionalContent={renderThemePreferenceLocationTippyContent()}
                    showCloseButton
                    trigger="manual"
                    interactive
                    arrow
                    onClose={handleCloseSwitchThemeLocationTippyChange}
                    documentationLink={tippyRedirectLink}
                >
                    <div>
                        <ProfileMenu user={email} onClick={handleProfileMenuButtonClick} />
                    </div>
                </TippyCustomized>
            )}
        </>
    )

    const renderIframeButton = () => <IframePromoButton />

    return (
        <div
            className={`dc__page-header dc__content-space cn-9 bg__primary pl-20 pr-20 ${
                showTabs ? 'dc__page-header-tabs__height' : 'dc__page-header__height flex'
            }`}
        >
            <h1 className="dc__page-header__title dc__content-space flex fs-16 fw-6 lh-20 h-48">
                <div className="flex left">
                    {(headerImage || headerName || onClose) && (
                        <div className="flex left dc__gap-12">
                            {!!onClose && (
                                <Button
                                    dataTestId="page-header-close-button"
                                    ariaLabel="page-header-close-button"
                                    icon={closeIcon ?? <Icon name="ic-close-large" color={null} />}
                                    variant={ButtonVariantType.secondary}
                                    style={ButtonStyleType.negativeGrey}
                                    size={ComponentSizeType.xs}
                                    onClick={onClose}
                                    showAriaLabelInTippy={false}
                                />
                            )}
                            {(headerImage || headerName) && (
                                <div className="flex left dc__gap-8">
                                    {headerImage && (
                                        <ImageWithFallback
                                            imageProps={{
                                                className: 'dc__no-shrink icon-dim-24',
                                                height: 24,
                                                width: 24,
                                                src: headerImage,
                                                alt: 'header-image',
                                            }}
                                            fallbackImage={headerImage}
                                        />
                                    )}
                                    {headerName && (
                                        <span className="fw-6" data-testid="main-header">
                                            {headerName}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {additionalHeaderInfo && additionalHeaderInfo()}
                    {isBreadcrumbs && breadCrumbs()}
                    {tippyProps &&
                        (isTippyCustomized ? (
                            <InfoIconTippy
                                infoText={tippyMessage}
                                heading={headerName || tippyHeader}
                                iconClassName="icon-dim-20 ml-8 fcn-7"
                                documentationLink={tippyRedirectLink}
                                documentationLinkText="View Documentation"
                                additionalContent={additionalContent}
                            >
                                {TippyIcon && (
                                    <div className="flex">
                                        <TippyIcon className="icon-dim-20 ml- cursor fcn-5" />
                                    </div>
                                )}
                            </InfoIconTippy>
                        ) : (
                            <a
                                data-testid="learn-more-symbol"
                                className="dc__link flex"
                                target="_blank"
                                href={tippyRedirectLink}
                                onClick={onClickTippyButton}
                                rel="noreferrer"
                                aria-label="tippy-icon"
                            >
                                <Tippy
                                    className="default-tt "
                                    arrow={false}
                                    placement="top"
                                    content={<span style={{ display: 'block', width: '66px' }}> {tippyMessage} </span>}
                                >
                                    <div className="flex">
                                        <TippyIcon className="icon-dim-20 ml-8 cursor fcn-5" />
                                    </div>
                                </Tippy>
                            </a>
                        ))}
                </div>
                {showTabs && (
                    <div className="flex left dc__gap-8">
                        {renderIframeButton()}
                        {typeof renderActionButtons === 'function' && renderActionButtons()}
                        {renderLogoutHelpSection()}
                    </div>
                )}
            </h1>
            {showTabs && renderHeaderTabs()}
            {!showTabs && (
                <div className="flex left dc__gap-8">
                    {typeof renderActionButtons === 'function' && renderActionButtons()}
                    {renderIframeButton()}
                    {renderLogoutHelpSection()}
                </div>
            )}
        </div>
    )
}

export default PageHeader
