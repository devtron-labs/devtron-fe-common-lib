import { useRef, useState } from 'react'
import ReactGA from 'react-ga4'
import { SliderButton } from '@typeform/embed-react'

import { URLS } from '@Common/Constants'
import { ComponentSizeType } from '@Shared/constants'
import { useMainContext } from '@Shared/Providers'

import { ActionMenu, ActionMenuItemType } from '../ActionMenu'
import { Button, ButtonComponentType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { HelpButtonActionMenuProps, HelpButtonProps, HelpMenuItems, InstallationType } from './types'
import { getHelpActionMenuOptions } from './utils'

const CheckForUpdates = ({
    serverInfo,
    fetchingServerInfo,
}: Pick<HelpButtonProps, 'serverInfo' | 'fetchingServerInfo'>) => (
    <div className="flex column left px-10 py-6">
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

export const HelpButton = ({ serverInfo, fetchingServerInfo, onClick }: HelpButtonProps) => {
    // STATES
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)

    // HOOKS
    const { currentServerInfo, handleOpenLicenseInfoDialog, licenseData, setGettingStartedClicked } = useMainContext()

    // REFS
    const typeFormSliderButtonRef = useRef(null)

    // CONSTANTS
    const FEEDBACK_FORM_ID = `UheGN3KJ#source=${window.location.hostname}`
    const isEnterprise = currentServerInfo?.serverInfo?.installationType === InstallationType.ENTERPRISE

    // HANDLERS
    const handleAnalytics = (option: ActionMenuItemType) => {
        ReactGA.event({
            category: 'Help Nav',
            action: `${option.label} Clicked`,
        })
    }

    const handleOpenAboutDevtron = () => {
        ReactGA.event({
            category: 'help-nav__about-devtron',
            action: 'ABOUT_DEVTRON_CLICKED',
        })
        handleOpenLicenseInfoDialog()
    }

    const handleFeedbackClick = () => {
        typeFormSliderButtonRef.current?.open()
    }

    const handleGettingStartedClick = () => {
        setGettingStartedClicked(true)
    }

    const handleActionMenuClick: HelpButtonActionMenuProps['onClick'] = (item) => {
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
            case HelpMenuItems.JOIN_DISCORD_COMMUNITY:
            case HelpMenuItems.VIEW_DOCUMENTATION:
            case HelpMenuItems.OPEN_NEW_TICKET:
            case HelpMenuItems.VIEW_ALL_TICKETS:
            case HelpMenuItems.CHAT_WITH_SUPPORT:
            case HelpMenuItems.RAISE_ISSUE_REQUEST:
                handleAnalytics(item)
                break
            default:
        }
    }

    return (
        <>
            <ActionMenu<HelpMenuItems>
                id="page-header-help-action-menu"
                alignment="end"
                width={220}
                options={getHelpActionMenuOptions({
                    isTrial: licenseData?.isTrial ?? false,
                    isEnterprise,
                })}
                onClick={handleActionMenuClick}
                onOpen={setIsActionMenuOpen}
                {...(serverInfo?.installationType === InstallationType.OSS_HELM
                    ? {
                          menuListFooterConfig: {
                              type: 'customNode',
                              value: (
                                  <CheckForUpdates serverInfo={serverInfo} fetchingServerInfo={fetchingServerInfo} />
                              ),
                          },
                      }
                    : {})}
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
