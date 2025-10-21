import { URLS } from '@Common/Constants'
import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

export const InfrastructureManagementIcon = () => (
    <Button
        dataTestId="redirect-to-overview-btn"
        component={ButtonComponentType.link}
        size={ComponentSizeType.xs}
        variant={ButtonVariantType.borderLess}
        linkProps={{
            to: URLS.INFRASTRUCTURE_MANAGEMENT_RESOURCE_BROWSER,
        }}
        ariaLabel="Infrastructure Management"
        showAriaLabelInTippy
        icon={<Icon name="ic-cloud" color={null} />}
    />
)
