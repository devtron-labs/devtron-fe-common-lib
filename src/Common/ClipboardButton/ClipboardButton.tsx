import React, { useState, useEffect, useCallback } from 'react'
import Tippy from '@tippyjs/react'
import { copyToClipboard, noop } from '../Helper'
import ClipboardProps from './types'
import { ReactComponent as ICCopy } from '../../Assets/Icon/ic-copy.svg'
import { ReactComponent as Check } from '../../Assets/Icon/ic-check.svg'

/**
 * @param content - Content to be copied
 * @param copiedTippyText - Text to be shown in the tippy when the content is copied, default 'Copied!'
 * @param duration - Duration for which the tippy should be shown, default 1000
 * @param trigger - To trigger the copy action outside the button, if set to true the content will be copied, use case being triggering the copy action from outside the component
 * @param setTrigger - Callback function to set the trigger outside the button
 */
export default function ClipboardButton({
    content,
    copiedTippyText = 'Copied!',
    duration = 1000,
    trigger = false,
    setTrigger = noop,
}: ClipboardProps) {
    const [copied, setCopied] = useState<boolean>(false)
    const [enableTippy, setEnableTippy] = useState<boolean>(false)

    const handleTextCopied = () => setCopied(true)
    const handleEnableTippy = () => setEnableTippy(true)
    const handleDisableTippy = () => setEnableTippy(false)
    const handleCopyContent = useCallback(() => copyToClipboard(content, handleTextCopied), [content])

    useEffect(() => {
        if (!copied) return

        const timeout = setTimeout(() => {
            setCopied(false)
            setTrigger(false)
        }, duration)

        return () => clearTimeout(timeout)
    }, [copied, duration, setTrigger])

    useEffect(() => {
        if (trigger) {
            setCopied(true)
            handleCopyContent()
        }
    }, [trigger, handleCopyContent])

    return (
        <div className="icon-dim-16 flex center">
            <Tippy
                className="default-tt"
                content={copied ? copiedTippyText : 'Copy'}
                placement="bottom"
                visible={copied || enableTippy}
            >
                <button
                    type="button"
                    className="dc__outline-none-imp p-0 flex bcn-0 dc__no-border"
                    onMouseEnter={handleEnableTippy}
                    onMouseLeave={handleDisableTippy}
                    onClick={handleCopyContent}
                >
                    {copied ? <Check className="icon-dim-16" /> : <ICCopy className="icon-dim-16" />}
                </button>
            </Tippy>
        </div>
    )
}
