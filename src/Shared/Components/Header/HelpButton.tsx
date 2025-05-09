import { useRef, useState } from 'react'
import ReactGA from 'react-ga4'
import { SliderButton } from '@typeform/embed-react'

import { ComponentSizeType } from '@Shared/constants'
import { useMainContext } from '@Shared/Providers'

import { ActionMenu, ActionMenuItemType, ActionMenuProps } from '../ActionMenu'
import { ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { HelpButtonProps, HelpMenuItems, InstallationType } from './types'
import { getHelpActionMenuOptions } from './utils'

export const HelpButton = ({ serverInfo, handleGettingStartedClick, onClick }: HelpButtonProps) => {
    // STATES
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)

    // HOOKS
    const { currentServerInfo, handleOpenLicenseInfoDialog, licenseData } = useMainContext()

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

    const handleActionMenuClick: ActionMenuProps['onClick'] = (item) => {
        switch (item.value) {
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
            <ActionMenu
                alignment="end"
                width={220}
                options={getHelpActionMenuOptions({
                    isTrial: licenseData?.isTrial ?? false,
                    isEnterprise,
                    isOSSHelm: serverInfo?.installationType !== InstallationType.OSS_HELM,
                })}
                onClick={handleActionMenuClick}
                onOpen={setIsActionMenuOpen}
                buttonProps={{
                    dataTestId: 'page-header-help-button',
                    text: 'Help',
                    variant: ButtonVariantType.borderLess,
                    style: ButtonStyleType.neutral,
                    size: ComponentSizeType.medium,
                    startIcon: <Icon name="ic-help-outline" color={null} />,
                    endIcon: (
                        <div
                            className="rotate"
                            style={{ ['--rotateBy' as string]: isActionMenuOpen ? '180deg' : '0deg' }}
                        >
                            <Icon name="ic-caret-down-small" color={null} />
                        </div>
                    ),
                    onClick,
                }}
            />
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

// {serverInfo?.installationType === InstallationType.OSS_HELM && (
//     <div className="help-card__update-option fs-11 fw-6 mt-4">
//         {fetchingServerInfo ? (
//             <span className="dc__loading-dots">Checking current version</span>
//         ) : (
//             <span>version {serverInfo?.currentVersion || ''}</span>
//         )}
//         <br />
//         <NavLink to={URLS.STACK_MANAGER_ABOUT}>Check for Updates</NavLink>
//     </div>
// )}
