import { URLS } from '@Common/Constants'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonComponentType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'

export const InfrastructureManagementIcon = () => (
    <Button
        dataTestId="redirect-to-overview-btn"
        component={ButtonComponentType.link}
        size={ComponentSizeType.xs}
        variant={ButtonVariantType.borderLess}
        linkProps={{
            to: URLS.RESOURCE_BROWSER,
        }}
        ariaLabel="Redirect to Security Scans Overview"
        showAriaLabelInTippy={false}
        icon={<Icon name="ic-cloud" color={null} />}
    />
)
