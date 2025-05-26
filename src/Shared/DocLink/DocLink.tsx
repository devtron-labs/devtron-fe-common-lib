import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { DocLinkProps } from './types'
import { getDocumentationUrl } from './utils'

export const DocLink = <T extends boolean = false>({
    docLinkKey,
    text = 'Learn more',
    dataTestId,
    showExternalIcon,
    onClick,
    size = ComponentSizeType.medium,
    variant = ButtonVariantType.text,
    isEnterprise = false,
    isExternalLink,
}: DocLinkProps<T>) => (
    <Button
        component={ButtonComponentType.anchor}
        anchorProps={{
            href: getDocumentationUrl({
                docLinkKey,
                isEnterprise,
                isExternalLink,
            }),
        }}
        onClick={onClick}
        dataTestId={dataTestId}
        text={text}
        variant={variant}
        size={size}
        endIcon={showExternalIcon && <Icon name="ic-open-in-new" color={null} />}
        fullWidth
    />
)
