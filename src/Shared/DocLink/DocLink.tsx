import { MouseEvent } from 'react'

import { DOCUMENTATION_HOME_PAGE } from '@Common/Constants'
import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { useMainContext } from '@Shared/Providers'

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
    isExternalLink,
    openInNewTab = false,
    fullWidth = true,
}: DocLinkProps<T>) => {
    // HOOKS
    const { isEnterprise, setSidePanelConfig } = useMainContext()

    // CONSTANTS
    const documentationLink = getDocumentationUrl({
        docLinkKey,
        isEnterprise,
        isExternalLink,
    })

    // HANDLERS
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!isExternalLink && !openInNewTab && !e.metaKey && documentationLink.startsWith(DOCUMENTATION_HOME_PAGE)) {
            e.preventDefault()
            setSidePanelConfig((prev) => ({ ...prev, open: true, docLink: documentationLink }))
        }
        onClick?.(e)
    }

    return (
        <Button
            component={ButtonComponentType.anchor}
            anchorProps={{
                href: documentationLink,
            }}
            onClick={handleClick}
            dataTestId={dataTestId}
            text={text}
            variant={variant}
            size={size}
            endIcon={showExternalIcon && <Icon name="ic-open-in-new" color={null} />}
            fullWidth={fullWidth}
        />
    )
}
