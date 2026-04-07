import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { ROUTER_URLS } from '@PagesDevtron2.0/index'

export const SecurityCenterIcon = () => (
    <Button
        dataTestId="redirect-to-overview-btn"
        component={ButtonComponentType.link}
        size={ComponentSizeType.xs}
        icon={<Icon name="ic-shield-check" color={null} />}
        variant={ButtonVariantType.borderLess}
        linkProps={{
            to: ROUTER_URLS.SECURITY_CENTER_OVERVIEW,
        }}
        ariaLabel="Security Center"
        showAriaLabelInTippy
    />
)
