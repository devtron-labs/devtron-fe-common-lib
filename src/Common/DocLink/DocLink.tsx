import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { DocLinkProps } from './types'
import { getDocumentationUrl } from './utils'

export const DocLink = ({
    docLinkKey,
    text = 'Learn more',
    dataTestId,
    showExternalIcon,
    onClick,
    hideVersion = false,
}: DocLinkProps) => (
    <Button
        component={ButtonComponentType.anchor}
        anchorProps={{
            href: getDocumentationUrl({ docLinkKey, hideVersion }),
        }}
        onClick={onClick}
        dataTestId={dataTestId}
        text={text}
        variant={ButtonVariantType.text}
        size={ComponentSizeType.medium}
        endIcon={showExternalIcon && <Icon name="ic-open-in-new" color={null} />}
    />
)
