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

import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import Tippy from '@tippyjs/react'

import { ReactComponent as ICCaretDownSmall } from '@Icons/ic-caret-down-small.svg'
import { ReactComponent as Close } from '@Icons/ic-close.svg'
import { ReactComponent as ICMediumPaintBucket } from '@IconsV2/ic-medium-paintbucket.svg'
import { InstallationType } from '@Shared/types'

import { getAlphabetIcon, TippyCustomized, TippyTheme } from '../../../Common'
import { MAX_LOGIN_COUNT, POSTHOG_EVENT_ONBOARDING } from '../../../Common/Constants'
import { SidePanelTab, useMainContext, useTheme, useUserEmail } from '../../Providers'
import GettingStartedCard from '../GettingStartedCard/GettingStarted'
import { Icon } from '../Icon'
import { InfoIconTippy } from '../InfoIconTippy'
import LogoutCard from '../LogoutCard'
import { HelpButton } from './HelpButton'
import { IframePromoButton } from './IframePromoButton'
import { getServerInfo } from './service'
import { PageHeaderType, ServerInfo } from './types'
import { getIsShowingLicenseData, handlePostHogEventUpdate, setActionWithExpiry } from './utils'

import './pageHeader.scss'

const PageHeader = ({
    headerName,
    additionalHeaderInfo,
    showTabs = false,
    renderHeaderTabs,
    isBreadcrumbs = false,
    breadCrumbs,
    renderActionButtons,
    showCloseButton = false,
    onClose,
    markAsBeta,
    tippyProps,
}: PageHeaderType) => {
    const {
        loginCount,
        setLoginCount,
        showGettingStartedCard,
        setShowGettingStartedCard,
        licenseData,
        setSidePanelConfig,
        sidePanelConfig,
    } = useMainContext()
    const { showSwitchThemeLocationTippy, handleShowSwitchThemeLocationTippyChange } = useTheme()

    const { isTippyCustomized, tippyRedirectLink, TippyIcon, tippyMessage, onClickTippyButton, additionalContent } =
        tippyProps || {}
    const [showLogOutCard, setShowLogOutCard] = useState(false)
    const { email } = useUserEmail()
    const [currentServerInfo, setCurrentServerInfo] = useState<{ serverInfo: ServerInfo; fetchingServerInfo: boolean }>(
        {
            serverInfo: undefined,
            fetchingServerInfo: false,
        },
    )
    const [expiryDate, setExpiryDate] = useState(0)

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

    useEffect(() => {
        setExpiryDate(+localStorage.getItem('clickedOkay'))
    }, [])

    const hideGettingStartedCard = (count?: string) => {
        setShowGettingStartedCard(false)
        if (count) {
            setLoginCount(+count)
        }
    }

    const handleCloseSwitchThemeLocationTippyChange = () => {
        handleShowSwitchThemeLocationTippyChange(false)
    }

    const onClickLogoutButton = () => {
        handleCloseSwitchThemeLocationTippyChange()
        setShowLogOutCard(!showLogOutCard)
        setActionWithExpiry('clickedOkay', 1)
        hideGettingStartedCard()
    }

    const onHelpButtonClick = async () => {
        if (
            !window._env_.K8S_CLIENT &&
            currentServerInfo.serverInfo?.installationType !== InstallationType.ENTERPRISE
        ) {
            await getCurrentServerInfo()
        }

        if (showLogOutCard) {
            setShowLogOutCard(false)
        }

        setActionWithExpiry('clickedOkay', 1)
        hideGettingStartedCard()
        await handlePostHogEventUpdate(POSTHOG_EVENT_ONBOARDING.HELP)
        ReactGA.event({
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

    const onAskButtonClick = () => {
        setSidePanelConfig((prev) => ({ ...prev, state: SidePanelTab.ASK_DEVTRON }))
    }

    const renderLogoutHelpSection = () => (
        <>
            {window._env_?.FEATURE_ASK_DEVTRON_EXPERT && sidePanelConfig.state === 'closed' && (
                <button
                    className="enable-svg-animation--hover flex dc__no-background p-2 dc__outline-none-imp dc__no-border"
                    onClick={onAskButtonClick}
                    type="button"
                    aria-label="Ask Devtron Expert"
                >
                    <Icon name="ic-devtron-ai" color={null} size={28} />
                </button>
            )}
            <HelpButton
                serverInfo={currentServerInfo.serverInfo}
                fetchingServerInfo={currentServerInfo.fetchingServerInfo}
                onClick={onHelpButtonClick}
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
                    <button
                        type="button"
                        data-testid="profile-button"
                        onClick={onClickLogoutButton}
                        className="dc__transparent flex p-4 dc__gap-4 br-18 bg__secondary border__secondary"
                    >
                        {getAlphabetIcon(email, 'm-0-imp h-24 w-24-imp')}
                        <ICCaretDownSmall
                            className={`scn-7 icon-dim-16 ${showLogOutCard ? 'dc__flip-180' : ''} dc__transition--transform`}
                        />
                    </button>
                </TippyCustomized>
            )}
        </>
    )

    const getExpired = (): boolean => {
        // Render Getting started tippy card if the time gets expired
        const now = new Date().valueOf()
        return now > expiryDate
    }

    const renderBetaTag = (): JSX.Element => (
        <span className="fs-12 fw-4 lh-18 pt-1 pb-1 pl-6 pr-6 ml-8 cn-9 bcy-5 br-4">Beta</span>
    )

    const showingLicenseBar = getIsShowingLicenseData(licenseData)

    const renderIframeButton = () => <IframePromoButton />

    return (
        <div
            className={`dc__page-header dc__content-space cn-9 bg__primary pl-20 pr-20 ${
                showTabs ? 'dc__page-header-tabs__height' : 'dc__page-header__height flex'
            }`}
        >
            <h1 className="dc__page-header__title dc__content-space  flex fs-16 fw-6 lh-20 h-48">
                <div className="flex left">
                    {showCloseButton && (
                        <button
                            className="dc__transparent flex mr-8"
                            type="button"
                            aria-label="close-button"
                            onClick={onClose}
                        >
                            <Close className="dc__page-header__close-icon icon-dim-24 cursor" />
                        </button>
                    )}
                    <span className="fw-6" data-testid="main-header">
                        {headerName}
                    </span>
                    {additionalHeaderInfo && additionalHeaderInfo()}
                    {isBreadcrumbs && breadCrumbs()}
                    {tippyProps &&
                        (isTippyCustomized ? (
                            <InfoIconTippy
                                infoText={tippyMessage}
                                heading={headerName}
                                iconClassName="icon-dim-20 ml-8 fcn-5"
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
                    {markAsBeta && renderBetaTag()}
                </div>
                {showTabs && (
                    <div className="flex left dc__gap-12">
                        {renderIframeButton()}
                        {typeof renderActionButtons === 'function' && renderActionButtons()}
                        {renderLogoutHelpSection()}
                    </div>
                )}
            </h1>
            {showTabs && renderHeaderTabs()}
            {!window._env_.K8S_CLIENT &&
                showGettingStartedCard &&
                loginCount >= 0 &&
                loginCount < MAX_LOGIN_COUNT &&
                getExpired() && (
                    <GettingStartedCard
                        className="w-300"
                        showHelpCard={false}
                        hideGettingStartedCard={hideGettingStartedCard}
                        loginCount={loginCount}
                    />
                )}
            {showLogOutCard && (
                <LogoutCard
                    className={`logout-card__more-option ${showingLicenseBar ? 'with-bar' : ''} mt-8`}
                    userFirstLetter={email}
                    setShowLogOutCard={setShowLogOutCard}
                    showLogOutCard={showLogOutCard}
                />
            )}
            {!showTabs && (
                <div className="flex left dc__gap-12">
                    {typeof renderActionButtons === 'function' && renderActionButtons()}
                    {renderIframeButton()}
                    {renderLogoutHelpSection()}
                </div>
            )}
        </div>
    )
}

export default PageHeader
