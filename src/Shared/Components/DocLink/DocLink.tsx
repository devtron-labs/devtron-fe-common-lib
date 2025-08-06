/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
