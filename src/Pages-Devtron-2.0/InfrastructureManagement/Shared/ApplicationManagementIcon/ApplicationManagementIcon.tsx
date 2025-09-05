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
            to: URLS.APP_LIST,
        }}
        ariaLabel="Redirect to Devtron Apps"
        showAriaLabelInTippy={false}
        icon={<Icon name="ic-grid-view" color={null} />}
    />
)
