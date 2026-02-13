import { BreadcrumbText } from '@Common/index'
import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { ROUTER_URLS } from '..'

export const getAutomationEnablementBreadcrumbConfig = () => ({
    'automation-and-enablement': {
        component: (
            <Button
                dataTestId="redirect-to-overview-btn"
                component={ButtonComponentType.link}
                size={ComponentSizeType.xs}
                variant={ButtonVariantType.borderLess}
                linkProps={{
                    to: ROUTER_URLS.JOBS,
                }}
                icon={<Icon name="ic-bot" color={null} />}
                ariaLabel="Automation & Enablement"
                showAriaLabelInTippy
            />
        ),
        linked: true,
    },
    job: null,
    list: { component: <BreadcrumbText heading="Jobs" isActive /> },
    appId: null,
})
