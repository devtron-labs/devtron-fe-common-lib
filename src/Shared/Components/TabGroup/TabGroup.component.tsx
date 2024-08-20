import { Link, NavLink } from 'react-router-dom'

import { ReactComponent as ICErrorExclamation } from '@Icons/ic-error-exclamation.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning-y6.svg'
import { checkNavLinkActiveState } from '@Shared/Helpers'
import { ComponentSizeType } from '@Shared/constants'

import { TabGroupProps, TabProps } from './TabGroup.types'
import './TabGroup.scss'

const Tab = ({
    label,
    props,
    tabType,
    active,
    icon: Icon,
    iconType = 'fill',
    size,
    badge = null,
    alignActiveBorderWithContainer,
    hideTopPadding,
    showIndicator,
    showError,
    showWarning,
}: TabProps & Pick<TabGroupProps, 'size' | 'alignActiveBorderWithContainer' | 'hideTopPadding'>) => {
    const getClassNameBySize = () => {
        switch (size) {
            case ComponentSizeType.medium:
                return {
                    tabClassName: `fs-12 ${!hideTopPadding ? 'pt-6' : ''} ${alignActiveBorderWithContainer ? 'pb-5' : 'pb-6'}`,
                }
            default:
                return {
                    tabClassName: `fs-13 ${!hideTopPadding ? 'pt-8' : ''} ${alignActiveBorderWithContainer ? 'pb-7' : 'pb-8'}`,
                }
        }
    }
    const { tabClassName } = getClassNameBySize()

    const getTabComponent = () => {
        const content = (
            <>
                {showError && <ICErrorExclamation className="icon-dim-14" />}
                {!showError && showWarning && <ICWarning className="icon-dim-14" />}
                {!showError && !showWarning && Icon && (
                    <Icon
                        className={`icon-dim-14 ${iconType === 'fill' ? 'tab-group__tab__icon--fill' : 'tab-group__tab__icon--stroke'} ${(active && (iconType === 'fill' ? 'fcb-5' : 'scb-5')) || ''}`}
                    />
                )}
                {label}
                {badge !== null && <div className="tab-group__tab__badge bcn-1 flex fs-12 lh-18 cn-7">{badge}</div>}
                {showIndicator && <span className="tab-group__tab__indicator bcr-5 mt-12 dc__align-self-start" />}
            </>
        )

        switch (tabType) {
            case 'link':
                return (
                    <Link
                        className={`${tabClassName} dc__no-decor flexbox dc__align-items-center dc__gap-6`}
                        {...props}
                    >
                        {content}
                    </Link>
                )
            case 'navLink':
                return (
                    <NavLink
                        className={`${tabClassName} dc__no-decor tab-group__tab__nav-link flexbox dc__align-items-center dc__gap-6`}
                        isActive={checkNavLinkActiveState(props.to)}
                        {...props}
                    >
                        {content}
                    </NavLink>
                )
            default:
                return (
                    <button
                        type="button"
                        className={`dc__unset-button-styles ${tabClassName} flexbox dc__align-items-center dc__gap-6`}
                        {...props}
                    >
                        {content}
                    </button>
                )
        }
    }

    return (
        <li
            className={`tab-group__tab cursor lh-20 ${active ? 'tab-group__tab--active cb-5 fw-6' : 'cn-9'} ${alignActiveBorderWithContainer ? 'tab-group__tab--align-active-border' : ''}`}
        >
            {getTabComponent()}
        </li>
    )
}

export const TabGroup = ({
    tabs = [],
    size = ComponentSizeType.large,
    rightComponent,
    alignActiveBorderWithContainer,
    hideTopPadding,
}: TabGroupProps) => (
    <div className="flexbox  dc__align-items-center dc__content-space">
        <ul
            role="tablist"
            className={`tab-group flexbox dc__align-items-center p-0 m-0 ${size === ComponentSizeType.large ? 'dc__gap-16' : 'dc__gap-12'}`}
        >
            {tabs.map(({ id, ...resProps }) => (
                <Tab
                    key={id}
                    id={id}
                    size={size}
                    alignActiveBorderWithContainer={alignActiveBorderWithContainer}
                    hideTopPadding={hideTopPadding}
                    {...resProps}
                />
            ))}
        </ul>
        {rightComponent || null}
    </div>
)
