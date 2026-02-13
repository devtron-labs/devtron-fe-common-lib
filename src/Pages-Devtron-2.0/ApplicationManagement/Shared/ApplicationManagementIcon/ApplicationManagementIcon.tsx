import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { ROUTER_URLS } from '@PagesDevtron2.0/index'

export const ApplicationManagementIcon = () => (
    <Button
        dataTestId="redirect-to-devtron-apps"
        component={ButtonComponentType.link}
        size={ComponentSizeType.xs}
        variant={ButtonVariantType.borderLess}
        linkProps={{
            to: ROUTER_URLS.APPLICATION_MANAGEMENT_OVERVIEW,
        }}
        ariaLabel="Application Management"
        showAriaLabelInTippy
        icon={<Icon name="ic-application-management" color={null} />}
    />
)
