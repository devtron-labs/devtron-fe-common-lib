import { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { ReactComponent as ICErrorExclamation } from '@Icons/ic-error-exclamation.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'
import { ComponentSizeType } from '@Shared/constants'

import { TabGroupProps, TabProps } from './TabGroup.types'
import { getClassNameBySizeMap, getIconColorClassMap, tabGroupClassMap } from './TabGroup.utils'

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
    description,
}: TabProps & Pick<TabGroupProps, 'size' | 'alignActiveBorderWithContainer' | 'hideTopPadding'>) => {
    const { tabClassName, iconClassName, badgeClassName } = getClassNameBySizeMap({
        hideTopPadding,
        alignActiveBorderWithContainer,
    })[size]

    const getTabComponent = () => {
        const content = (
            <>
                <p className="m-0 flexbox dc__align-items-center dc__gap-6">
                    {showError && <ICErrorExclamation className={`${iconClassName}`} />}
                    {!showError && showWarning && <ICWarning className={`${iconClassName} warning-icon-y7`} />}
                    {!showError && !showWarning && Icon && (
                        <Icon className={`${iconClassName} ${getIconColorClassMap({ active })[iconType] || ''}`} />
                    )}
                    {label}
                    {badge !== null && (
                        <div className={`tab-group__tab__badge bcn-1 cn-7 fw-6 flex px-4 ${badgeClassName}`}>
                            {badge}
                        </div>
                    )}
                    {showIndicator && <span className="tab-group__tab__indicator bcr-5 mt-4 dc__align-self-start" />}
                </p>
                {description && (
                    <p className="m-0 fs-12 lh-16 fw-4 cn-7 flexbox dc__align-items-center dc__gap-4">
                        {Array.isArray(description)
                            ? description.map((desc, idx) => (
                                  <Fragment key={desc}>
                                      {!!idx && <span className="dc__bullet" />}
                                      {desc}
                                  </Fragment>
                              ))
                            : description}
                    </p>
                )}
            </>
        )

        switch (tabType) {
            case 'link':
                return (
                    <Link
                        className={`${tabClassName} dc__no-decor flexbox-col ${disabled ? 'cursor-not-allowed' : ''}`}
                        aria-disabled={disabled}
                        {...props}
                    >
                        {content}
                    </Link>
                )
            case 'navLink':
                return (
                    <NavLink
                        className={`${tabClassName} dc__no-decor flexbox-col tab-group__tab__nav-link ${disabled ? 'cursor-not-allowed' : ''}`}
                        aria-disabled={disabled}
                        {...props}
                    >
                        {content}
                    </NavLink>
                )
            case 'block':
                return (
                    <div
                        className={`flexbox-col fw-6 ${tabClassName} ${disabled ? 'cursor-not-allowed' : ''}`}
                        {...props}
                    >
                        {content}
                    </div>
                )
            default:
                return (
                    <button
                        type="button"
                        className={`dc__unset-button-styles flexbox-col ${tabClassName} ${disabled ? 'cursor-not-allowed' : ''}`}
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
            className={`tab-group__tab lh-20 ${active ? 'tab-group__tab--active cb-5 fw-6' : 'cn-9 fw-4'} ${alignActiveBorderWithContainer ? 'tab-group__tab--align-active-border' : ''} ${tabType === 'block' ? 'tab-group__tab--block' : 'cursor'}`}
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
    <div className="flexbox dc__align-items-center dc__content-space">
        <ul role="tablist" className={`tab-group flexbox dc__align-items-center p-0 m-0 ${tabGroupClassMap[size]}`}>
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
