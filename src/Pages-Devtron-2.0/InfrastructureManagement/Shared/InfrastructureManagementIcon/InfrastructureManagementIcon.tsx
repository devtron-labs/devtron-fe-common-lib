import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { ROUTER_URLS } from '@PagesDevtron2.0/index'

export const InfrastructureManagementIcon = () => (
    <Button
        dataTestId="redirect-to-overview-btn"
        component={ButtonComponentType.link}
        size={ComponentSizeType.xs}
        variant={ButtonVariantType.borderLess}
        linkProps={{
            to: ROUTER_URLS.INFRASTRUCTURE_MANAGEMENT_OVERVIEW,
        }}
        ariaLabel="Infrastructure Management"
        showAriaLabelInTippy
        icon={<Icon name="ic-infrastructure-management" color={null} />}
    />
)
