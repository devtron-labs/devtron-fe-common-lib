import { URLS } from '@Common/Constants'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonComponentType, ButtonVariantType } from '../../../../Shared/Components/Button'
import { Icon } from '../../../../Shared/Components/Icon'

export const InfrastructureManagementIcon = () => (
    <Button
        dataTestId="redirect-to-overview-btn"
        component={ButtonComponentType.link}
        size={ComponentSizeType.xs}
        variant={ButtonVariantType.borderLess}
        linkProps={{
            to: URLS.INFRASTRUCTURE_MANAGEMENT_RESOURCE_BROWSER,
        }}
        ariaLabel="Redirect to Infrastructure Management Overview"
        showAriaLabelInTippy={false}
        icon={<Icon name="ic-cloud" color={null} />}
    />
)
