import { MouseEvent } from 'react'

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
    isEnterprise = false,
    isExternalLink,
    disableSidePanelOpen = false,
}: DocLinkProps<T>) => {
    // HOOKS
    const { setSidePanelConfig } = useMainContext()

    // CONSTANTS
    const documentationLink = getDocumentationUrl({
        docLinkKey,
        isEnterprise,
        isExternalLink,
    })

    // HANDLERS
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        setSidePanelConfig((prev) => ({ ...prev, open: true, docLink: documentationLink }))
        onClick?.(e)
    }

    return (
        <Button
            {...(isExternalLink || disableSidePanelOpen
                ? {
                      component: ButtonComponentType.anchor,
                      anchorProps: {
                          href: documentationLink,
                      },
                      onClick,
                  }
                : {
                      component: ButtonComponentType.button,
                      onClick: handleClick,
                  })}
            dataTestId={dataTestId}
            text={text}
            variant={variant}
            size={size}
            endIcon={showExternalIcon && <Icon name="ic-open-in-new" color={null} />}
            fullWidth
        />
    )
}
