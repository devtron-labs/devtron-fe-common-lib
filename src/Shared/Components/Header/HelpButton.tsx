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

import { useEffect, useRef, useState } from 'react'
import Tippy from '@tippyjs/react'
import { SliderButton } from '@typeform/embed-react'

import { DOCUMENTATION_HOME_PAGE, MAX_LOGIN_COUNT, URLS } from '@Common/Constants'
import { handleAnalyticsEvent } from '@Shared/Analytics'
import { ComponentSizeType } from '@Shared/constants'
import { useIsSecureConnection } from '@Shared/Hooks'
import { AppThemeType, SidePanelTab, useMainContext, useTheme } from '@Shared/Providers'
import { InstallationType } from '@Shared/types'

import { ActionMenu } from '../ActionMenu'
import { Button, ButtonComponentType, ButtonVariantType } from '../Button'
import GettingStartedCard from '../GettingStartedCard/GettingStarted'
import { Icon } from '../Icon'
import { HelpButtonActionMenuProps, HelpButtonProps, HelpMenuItems } from './types'
import { getHelpActionMenuOptions } from './utils'

const CheckForUpdates = ({
    serverInfo,
    fetchingServerInfo,
}: Pick<HelpButtonProps, 'serverInfo' | 'fetchingServerInfo'>) => (
    <div className="bg__menu--secondary flex column left px-10 py-6">
        {fetchingServerInfo ? (
            <p className="m-0 dc__loading-dots fs-13 fw-4 cn-7">Checking version</p>
        ) : (
            <p className="m-0 fs-13 fw-4 cn-9">Version {serverInfo?.currentVersion || ''}</p>
        )}
        <Button
            dataTestId="check-for-updates-link"
            component={ButtonComponentType.link}
            variant={ButtonVariantType.text}
            size={ComponentSizeType.medium}
            linkProps={{
                to: URLS.STACK_MANAGER_ABOUT,
            }}
            text="Check for updates"
        />
    </div>
)

export const HelpButton = ({
    serverInfo,
    fetchingServerInfo,
    onClick,
    hideGettingStartedCard,
    docPath,
}: HelpButtonProps) => {
    // STATES
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
    const [expiryDate, setExpiryDate] = useState(0)

    // HOOKS
    const {
        handleOpenLicenseInfoDialog,
        licenseData,
        setGettingStartedClicked,
        isEnterprise,
        setSidePanelConfig,
        loginCount,
        showGettingStartedCard,
        setShowUpgradeToOSSPlusDialog,
    } = useMainContext()
    const { appTheme } = useTheme()
    const isSecureConnection = useIsSecureConnection()

    // REFS
    const typeFormSliderButtonRef = useRef(null)

    // HANDLERS
    const handleOpenAboutDevtron = () => {
        handleOpenLicenseInfoDialog()
    }

    const handleFeedbackClick = () => {
        typeFormSliderButtonRef.current?.open()
    }

    const handleGettingStartedClick = () => {
        setGettingStartedClicked(true)
    }

    const handleViewDocumentationClick: HelpButtonActionMenuProps['onClick'] = (_, e) => {
        // Opens documentation in side panel when clicked normally, or in a new tab when clicked with the meta/command key
        if (isSecureConnection && !e.metaKey) {
            e.preventDefault()
            setSidePanelConfig((prev) => ({
                ...prev,
                state: SidePanelTab.DOCUMENTATION,
                docLink: `${DOCUMENTATION_HOME_PAGE}${docPath ? `/${docPath}` : ''}`,
                reinitialize: true,
            }))
        }
    }

    const handleActionMenuClick: HelpButtonActionMenuProps['onClick'] = (item, e) => {
        handleAnalyticsEvent({
            category: 'Help Nav',
            action: `HELP_${item.id.toUpperCase().replace('-', '_')}`,
        })
        switch (item.id) {
            case HelpMenuItems.GETTING_STARTED:
                handleGettingStartedClick()
                break
            case HelpMenuItems.ABOUT_DEVTRON:
                handleOpenAboutDevtron()
                break
            case HelpMenuItems.GIVE_FEEDBACK:
                handleFeedbackClick()
                break
            case HelpMenuItems.VIEW_DOCUMENTATION:
                handleViewDocumentationClick(item, e)
                break
            case HelpMenuItems.UPGRADE_TO_OSS_PLUS:
                setShowUpgradeToOSSPlusDialog?.(true)
                break
            default:
        }
    }

    const getExpired = (): boolean => {
        // Render Getting started tippy card if the time gets expired
        const now = new Date().valueOf()
        return now > expiryDate
    }

    // USE-EFFECT
    useEffect(() => {
        setExpiryDate(+localStorage.getItem('clickedOkay'))
    }, [])

    // CONSTANTS
    const FEEDBACK_FORM_ID = `UheGN3KJ#source=${window.location.hostname}`

    const isGettingStartedVisible =
        showGettingStartedCard && loginCount >= 0 && loginCount < MAX_LOGIN_COUNT && getExpired()

    return (
        <>
            <ActionMenu<HelpMenuItems>
                id="page-header-help-action-menu"
                alignment="end"
                width={220}
                options={getHelpActionMenuOptions({
                    isTrialOrFreemium: (licenseData?.isTrial || licenseData?.isFreemium) ?? false,
                    isEnterprise,
                    docPath,
                })}
                onClick={handleActionMenuClick}
                onOpen={setIsActionMenuOpen}
                {...(serverInfo?.installationType === InstallationType.OSS_HELM
                    ? {
                          footerConfig: {
                              type: 'customNode',
                              value: (
                                  <CheckForUpdates serverInfo={serverInfo} fetchingServerInfo={fetchingServerInfo} />
                              ),
                          },
                      }
                    : {})}
            >
                <Tippy
                    placement="bottom"
                    content={<GettingStartedCard hideGettingStartedCard={hideGettingStartedCard} />}
                    visible={isGettingStartedVisible}
                    className={`br-8 ${
                        appTheme === AppThemeType.light
                            ? 'tippy-white-container default-white'
                            : 'tippy-black-container default-black'
                    } no-content-padding tippy-shadow`}
                    interactive
                >
                    <button
                        type="button"
                        data-testid="page-header-help-button"
                        className="dc__transparent p-6 br-6 dc__hover-n50 flex dc__gap-4 fs-13 lh-20 fw-6 cn-9"
                        onClick={onClick}
                    >
                        <Icon name="ic-help-outline" color="N900" size={20} />
                        <span>Help</span>
                        <Icon name="ic-caret-down-small" color={null} rotateBy={isActionMenuOpen ? 180 : 0} />
                    </button>
                </Tippy>
            </ActionMenu>
            {isEnterprise && (
                <SliderButton
                    ref={typeFormSliderButtonRef}
                    className="dc__hide-section"
                    id={FEEDBACK_FORM_ID}
                    autoClose={2000}
                >
                    This button is hidden on UI (opening type-form via ref)
                </SliderButton>
            )}
        </>
    )
}
