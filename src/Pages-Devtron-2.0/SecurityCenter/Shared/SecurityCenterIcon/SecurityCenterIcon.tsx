import { ComponentSizeType, URLS } from 'src'

import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'

export const SecurityCenterIcon = () => (
    <Button
        dataTestId="redirect-to-overview-btn"
        component={ButtonComponentType.link}
        size={ComponentSizeType.xs}
        icon={<Icon name="ic-shield-check" color={null} />}
        variant={ButtonVariantType.borderLess}
        linkProps={{
            to: URLS.SECURITY_CENTER_OVERVIEW,
        }}
        ariaLabel="Security Center"
        showAriaLabelInTippy
    />
)
