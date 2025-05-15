import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { DocLinkProps } from './types'
import { getDocumentationUrl } from './utils'

export const DocLink = ({ doc, text = 'Learn more', dataTestId, showExternalIcon, onClick }: DocLinkProps) => (
    <Button
        component={ButtonComponentType.anchor}
        anchorProps={{
            href: getDocumentationUrl(doc),
        }}
        onClick={onClick}
        dataTestId={dataTestId}
        text={text}
        variant={ButtonVariantType.text}
        size={ComponentSizeType.medium}
        endIcon={showExternalIcon && <Icon name="ic-open-in-new" color={null} />}
    />
)
