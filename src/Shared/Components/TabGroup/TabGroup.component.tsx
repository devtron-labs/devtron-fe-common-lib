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
}: TabProps & Pick<TabGroupProps, 'size' | 'alignActiveBorderWithContainer' | 'hideTopPadding'>) => {
    const getClassNameBySize = () => {
        switch (size) {
            // TODO: Add more sizes config once design is available.
            default:
                return {
                    iconClassName: 'icon-dim-14',
                    tabClassName: 'fs-13 dc__no-decor',
                }
        }
    }
    const { iconClassName, tabClassName } = getClassNameBySize()

    const getTabComponent = () => {
        switch (tabType) {
            case 'link':
                return (
                    <Link className={tabClassName} {...props}>
                        {label}
                    </Link>
                )
            case 'navLink':
                return (
                    <NavLink className={`${tabClassName} tab-group__tab__nav-link`} {...props}>
                        {label}
                    </NavLink>
                )
            default:
                return (
                    <button type="button" className={`dc__unset-button-styles ${tabClassName}`} {...props}>
                        {label}
                    </button>
                )
        }
    }

    return (
        <li
            className={`tab-group__tab cursor flexbox dc__align-items-center dc__gap-6 lh-20 ${!hideTopPadding ? 'pt-8' : ''} ${alignActiveBorderWithContainer ? 'tab-group__tab--align-active-border pb-7' : 'pb-8'} ${active ? 'tab-group__tab--active cb-5 fw-6' : 'cn-9'}`}
        >
            {!showError && !showWarning && Icon && (
                <Icon
                    className={`${iconClassName} ${iconType === 'fill' ? 'tab-group__tab__icon--fill' : 'tab-group__tab__icon--stroke'} ${(active && (iconType === 'fill' ? 'fcb-5' : 'scb-5')) || ''}`}
                />
            )}
            {showError && <ICErrorExclamation className={iconClassName} />}
            {!showError && showWarning && <ICWarning className={iconClassName} />}
            {getTabComponent()}
            {badge !== null && <div className="tab-group__tab__badge bcn-1 flex fs-12 lh-18 cn-7">{badge}</div>}
            {showIndicator && <span className="tab-group__tab__indicator bcr-5 mt-12 dc__align-self-start" />}
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
        <ul role="tablist" className="tab-group flexbox dc__align-items-center dc__gap-16 p-0 m-0">
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
