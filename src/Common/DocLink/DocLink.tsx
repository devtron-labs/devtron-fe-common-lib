import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { DOCUMENTATION_HOME_PAGE, DOCUMENTATION_VERSION } from '..'
import { DocLinkProps } from './types'

export const appendUtmToUrl = (docLink: string) => `${docLink}?utm_source=product`

export const getDocumentationUrl = (docLink: string) =>
    `${DOCUMENTATION_HOME_PAGE}${DOCUMENTATION_VERSION}/${appendUtmToUrl(docLink)}`

export const DocLink = ({ docLink, docLinkText = 'Learn more', dataTestId, showEndIcon, onClick }: DocLinkProps) => (
    <Button
        component={ButtonComponentType.anchor}
        anchorProps={{
            href: getDocumentationUrl(docLink),
            target: '_blank',
            rel: 'noreferrer noopener',
        }}
        onClick={onClick}
        dataTestId={dataTestId}
        text={docLinkText}
        variant={ButtonVariantType.text}
        size={ComponentSizeType.medium}
        endIcon={showEndIcon && <Icon name="ic-open-in-new" color={null} />}
    />
)
