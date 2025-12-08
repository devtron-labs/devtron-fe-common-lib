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

import { useEffect, useRef, useState } from 'react'

import Tooltip from '@Common/Tooltip/Tooltip'
import { Button, ButtonStyleType, ButtonVariantType } from '@Shared/Components/Button'

import { ReactComponent as Check } from '../../Assets/Icon/ic-check.svg'
import { ReactComponent as ICCopy } from '../../Assets/Icon/ic-copy.svg'
import { copyToClipboard, noop, stopPropagation } from '../Helper'
import { ClipboardProps } from './types'

/**
 * @param content - Content to be copied
 * @param copiedTippyText - Text to be shown in the tippy when the content is copied, default 'Copied!'
 * @param duration - Duration for which the tippy should be shown, default 1000
 * @param copyToClipboardPromise - the promise returned by copyToClipboard util function
 * @param rootClassName - additional classes to add to button
 * @param iconSize - size of svg icon to be shown, default 16 (icon-dim-16)
 */
export const ClipboardButton = ({
    content,
    initialTippyText = 'Copy',
    copiedTippyText = 'Copied!',
    duration = 1000,
    copyToClipboardPromise,
    rootClassName = '',
    iconSize = 16,
    handleSuccess,
    variant = 'default',
    size,
}: ClipboardProps) => {
    const [copied, setCopied] = useState<boolean>(false)
    const setCopiedFalseTimeoutRef = useRef<ReturnType<typeof setTimeout>>(-1)

    const handleTriggerCopy = () => {
        setCopied(true)

        setCopiedFalseTimeoutRef.current = setTimeout(() => {
            setCopied(false)

            setCopiedFalseTimeoutRef.current = -1
        }, duration)
    }

    const handleAwaitCopyToClipboardPromise = async (shouldRunCopy?: boolean) => {
        try {
            if (shouldRunCopy) {
                await copyToClipboard(content)
            } else {
                await copyToClipboardPromise
            }

            handleSuccess?.()
            handleTriggerCopy()
        } catch {
            noop()
        }
    }

    const handleCopyContent = async (e?: React.MouseEvent) => {
        if (e) {
            stopPropagation(e)
        }

        await handleAwaitCopyToClipboardPromise(true)
    }

    useEffect(() => {
        if (!copyToClipboardPromise) {
            return
        }

        handleAwaitCopyToClipboardPromise().catch(noop)
    }, [copyToClipboardPromise])

    useEffect(
        () => () => {
            if (setCopiedFalseTimeoutRef.current > -1) {
                clearTimeout(setCopiedFalseTimeoutRef.current)
            }
        },
        [],
    )

    const iconClassName = `icon-dim-${iconSize} dc__no-shrink`

    const ariaLabel = `Copy ${content}`

    const renderIcon = () => (
        <div className="flex">
            {copied ? <Check className={iconClassName} /> : <ICCopy className={iconClassName} />}
        </div>
    )

    const tooltipContent = copied ? copiedTippyText : initialTippyText

    if (variant === 'button--secondary') {
        return (
            <Button
                variant={ButtonVariantType.secondary}
                dataTestId="clippy-button"
                icon={renderIcon()}
                size={size}
                onClick={handleCopyContent}
                tooltipProps={{
                    content: tooltipContent,
                }}
                showTooltip
                ariaLabel={ariaLabel}
                style={ButtonStyleType.neutral}
            />
        )
    }

    return (
        <Tooltip content={tooltipContent} alwaysShowTippyOnHover>
            {/* TODO: semantically buttons should not be nested; fix later */}
            <button
                type="button"
                className={`dc__outline-none-imp p-0 flex dc__transparent--unstyled dc__no-border ${rootClassName}`}
                aria-label={ariaLabel}
                onClick={handleCopyContent}
            >
                {renderIcon()}
            </button>
        </Tooltip>
    )
}
