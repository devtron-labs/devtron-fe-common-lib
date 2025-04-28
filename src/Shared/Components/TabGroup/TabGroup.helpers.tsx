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

import { LinkProps, NavLinkProps } from 'react-router-dom'

import { ReactComponent as ICErrorExclamation } from '@Icons/ic-error-exclamation.svg'
import { ReactComponent as ICWarning } from '@Icons/ic-warning.svg'

import { Icon } from '../Icon'
import { TabGroupProps, TabProps } from './TabGroup.types'
import { TAB_ICON_SIZE_MAP } from './TabGroup.utils'

export const getTabIcon = ({
    icon,
    showError,
    showWarning,
    className,
    size,
    active,
}: Pick<TabProps, 'showError' | 'showWarning' | 'icon' | 'active'> &
    Pick<TabGroupProps, 'size'> & { className: string }) => {
    if (showError) {
        return <ICErrorExclamation className={className} />
    }
    if (showWarning) {
        return <ICWarning className={`${className} warning-icon-y7`} />
    }
    if (typeof icon === 'string') {
        return <Icon name={icon} color={active ? 'B500' : 'N700'} size={TAB_ICON_SIZE_MAP[size]} />
    }
    if (icon) {
        const RenderIcon = icon
        return <RenderIcon className={`${className} tab-group__tab__icon`} />
    }
    return null
}

export const getTabBadge = (badge: TabProps['badge'], className: string) =>
    badge !== null && <div className={`tab-group__tab__badge bcn-1 cn-7 fw-6 flex px-4 ${className}`}>{badge}</div>

export const getTabIndicator = (showIndicator: TabProps['showIndicator']) =>
    showIndicator && <span className="tab-group__tab__indicator bcr-5 mt-4 dc__align-self-start" />

export const getTabDescription = (description: TabProps['description']) =>
    description && (
        <ul className="tab-group__tab__description m-0 p-0 fs-12 lh-16 fw-4 cn-7 flexbox dc__align-items-center dc__gap-4">
            {Array.isArray(description)
                ? description.map((desc, idx) => (
                      <li key={desc} className="flex dc__gap-4">
                          {!!idx && <span className="dc__bullet" />}
                          {desc}
                      </li>
                  ))
                : description}
        </ul>
    )

const replaceTrailingSlash = (pathname: string) => pathname.replace(/\/+$/, '')

export const getPathnameToMatch = (to: NavLinkProps['to'] | LinkProps['to'], currentPathname: string): string => {
    if (typeof to === 'string' || (to && typeof to === 'object' && 'pathname' in to)) {
        const pathname = typeof to === 'string' ? to : to.pathname || ''
        // handling absolute and relative paths
        return pathname.startsWith('/') ? pathname : `${replaceTrailingSlash(currentPathname)}/${pathname}`
    }
    return ''
}
