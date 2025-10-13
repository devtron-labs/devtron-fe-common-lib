import { URLS } from '@Common/Constants'
import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

export const ApplicationManagementIcon = () => (
    <Button
        dataTestId="redirect-to-devtron-apps"
        component={ButtonComponentType.link}
        size={ComponentSizeType.xs}
        variant={ButtonVariantType.borderLess}
        linkProps={{
            to: URLS.APPLICATION_MANAGEMENT_APP,
        }}
        ariaLabel="Application Management"
        showAriaLabelInTippy
        icon={<Icon name="ic-grid-view" color={null} />}
    />
)
