import { matchPath } from 'react-router-dom'

import { BreadcrumbText, URLS, useBreadcrumb } from '@Common/index'
import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { APPLICATION_MANAGEMENT_BREADCRUMB_CONFIG } from './constants'
import { BreadcrumbAlias } from './types'

export const getApplicationManagementBreadcrumbs = (url: string): Parameters<typeof useBreadcrumb>[0] => {
    const cleanUrl = url.split('?')[0].split('#')[0]

    const alias: BreadcrumbAlias = {
        'application-management': {
            component: (
                <Button
                    dataTestId="redirect-to-overview-btn"
                    component={ButtonComponentType.link}
                    size={ComponentSizeType.xs}
                    icon={<Icon name="ic-grid-view" color={null} />}
                    variant={ButtonVariantType.borderLess}
                    linkProps={{
                        to: URLS.APPLICATION_MANAGEMENT_OVERVIEW,
                    }}
                    ariaLabel="Redirect to Application Management Overview"
                    showAriaLabelInTippy={false}
                />
            ),
            linked: true,
        },
    }

    APPLICATION_MANAGEMENT_BREADCRUMB_CONFIG.forEach(({ key, route, heading }) => {
        const isActive = !!matchPath(cleanUrl, { path: route, exact: true })
        alias[key] = {
            component: <BreadcrumbText isActive={isActive} heading={heading} />,
            linked: !isActive,
        }
    })

    return { alias }
}
