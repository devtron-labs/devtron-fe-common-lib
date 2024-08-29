import { Link, NavLink } from 'react-router-dom'

import { ReactComponent as ICErrorExclamation } from '@Icons/ic-error-exclamation.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'
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
    disabled,
}: TabProps & Pick<TabGroupProps, 'size' | 'alignActiveBorderWithContainer' | 'hideTopPadding'>) => {
    const getClassNameBySize = () => {
        switch (size) {
            case ComponentSizeType.medium:
                return {
                    tabClassName: `fs-12 ${!hideTopPadding ? 'pt-6' : ''} ${alignActiveBorderWithContainer ? 'pb-5' : 'pb-6'}`,
                    iconClassName: 'icon-dim-14',
                    badgeClassName: 'fs-11 lh-18 tab-group__tab__badge--medium',
                }
            default:
                return {
                    tabClassName: `fs-13 ${!hideTopPadding ? 'pt-8' : ''} ${alignActiveBorderWithContainer ? 'pb-7' : 'pb-8'}`,
                    iconClassName: 'icon-dim-16',
                    badgeClassName: 'fs-12 lh-20',
                }
        }
    }
    const { tabClassName, iconClassName, badgeClassName } = getClassNameBySize()

    const getIconColorClass = () => {
        if (iconType === 'fill') {
            return `tab-group__tab__icon--fill ${active ? 'fcb-5' : 'fcn-7'}`
        }
        if (iconType === 'stroke') {
            return `tab-group__tab__icon--stroke ${active ? 'scb-5' : 'scn-7'}`
        }

        return ''
    }

    const getTabComponent = () => {
        const content = (
            <>
                {showError && <ICErrorExclamation className={`${iconClassName}`} />}
                {!showError && showWarning && <ICWarning className={`${iconClassName} warning-icon-y7`} />}
                {!showError && !showWarning && Icon && <Icon className={`${iconClassName} ${getIconColorClass()}`} />}
                {label}
                {badge !== null && (
                    <div className={`tab-group__tab__badge bcn-1 cn-7 flex px-4 ${badgeClassName}`}>{badge}</div>
                )}
                {showIndicator && <span className="tab-group__tab__indicator bcr-5 mt-4 dc__align-self-start" />}
            </>
        )

        switch (tabType) {
            case 'link':
                return (
                    <Link
                        className={`${tabClassName} dc__no-decor flexbox dc__align-items-center dc__gap-6 ${disabled ? 'cursor-not-allowed' : ''}`}
                        aria-disabled={disabled}
                        {...props}
                    >
                        {content}
                    </Link>
                )
            case 'navLink':
                return (
                    <NavLink
                        className={`${tabClassName} dc__no-decor tab-group__tab__nav-link flexbox dc__align-items-center dc__gap-6 ${disabled ? 'cursor-not-allowed' : ''}`}
                        aria-disabled={disabled}
                        {...props}
                    >
                        {content}
                    </NavLink>
                )
            default:
                return (
                    <button
                        type="button"
                        className={`dc__unset-button-styles ${tabClassName} flexbox dc__align-items-center dc__gap-6 ${disabled ? 'cursor-not-allowed' : ''}`}
                        disabled={disabled}
                        {...props}
                    >
                        {content}
                    </button>
                )
        }
    }

    return (
        <li
            className={`tab-group__tab cursor lh-20 ${active ? 'tab-group__tab--active cb-5 fw-6' : 'cn-9 fw-4'} ${alignActiveBorderWithContainer ? 'tab-group__tab--align-active-border' : ''}`}
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
