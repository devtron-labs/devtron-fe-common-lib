import { MouseEvent } from 'react'

import { DOCUMENTATION_HOME_PAGE } from '@Common/Constants'
import { Button, ButtonComponentType, ButtonVariantType, Icon } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { useIsSecureConnection } from '@Shared/Hooks'
import { SidePanelTab, useMainContext } from '@Shared/Providers'

import { DocLinkProps } from './types'
import { getDocumentationUrl } from './utils'

export const DocLink = <T extends boolean = false>({
    docLinkKey,
    text = 'Learn more',
    dataTestId,
    startIcon,
    showExternalIcon,
    onClick,
    fontWeight,
    size = ComponentSizeType.medium,
    variant = ButtonVariantType.text,
    isExternalLink,
    openInNewTab = false,
    fullWidth = false,
}: DocLinkProps<T>) => {
    // HOOKS
    const { isEnterprise, setSidePanelConfig, isLicenseDashboard } = useMainContext()
    const isSecureConnection = useIsSecureConnection()

    // CONSTANTS
    const documentationLink = getDocumentationUrl({
        docLinkKey,
        isEnterprise,
        isExternalLink,
        isLicenseDashboard,
    })

    // HANDLERS
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (
            isSecureConnection &&
            !isExternalLink &&
            !openInNewTab &&
            !e.metaKey &&
            !isLicenseDashboard &&
            documentationLink.startsWith(DOCUMENTATION_HOME_PAGE)
        ) {
            e.preventDefault()
            setSidePanelConfig((prev) => ({
                ...prev,
                state: SidePanelTab.DOCUMENTATION,
                docLink: documentationLink,
                reinitialize: true,
            }))
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
            startIcon={startIcon}
            endIcon={showExternalIcon && <Icon name="ic-open-in-new" color={null} />}
            fullWidth={fullWidth}
            fontWeight={fontWeight}
        />
    )
}
