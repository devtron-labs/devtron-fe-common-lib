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

import { useState, cloneElement } from 'react'
import TippyJS from '@tippyjs/react'
import { TooltipProps } from './types'
import ShortcutKeyComboTooltipContent from './ShortcutKeyComboTooltipContent'
import './styles.scss'

const Tooltip = ({
    shortcutKeyCombo,
    alwaysShowTippyOnHover,
    // NOTE: if alwaysShowTippyOnHover or shortcutKeyCombo are being passed by user don't apply truncation logic at all
    showOnTruncate = alwaysShowTippyOnHover === undefined && shortcutKeyCombo === undefined,
    wordBreak = true,
    children: child,
    ...rest
}: TooltipProps) => {
    const [isTextTruncated, setIsTextTruncated] = useState(false)

    const handleMouseEnterEvent: React.MouseEventHandler = (event) => {
        const { currentTarget: node } = event
        const isTextOverflowing = node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight
        if (isTextOverflowing && !isTextTruncated) {
            setIsTextTruncated(true)
        } else if (!isTextOverflowing && isTextTruncated) {
            setIsTextTruncated(false)
        }
    }

    const showTooltipWhenShortcutKeyComboProvided =
        !!shortcutKeyCombo && (alwaysShowTippyOnHover === undefined || alwaysShowTippyOnHover)
    const showTooltipOnTruncate = showOnTruncate && isTextTruncated

    return showTooltipOnTruncate || showTooltipWhenShortcutKeyComboProvided || alwaysShowTippyOnHover ? (
        <TippyJS
            arrow={false}
            placement="top"
            // NOTE: setting the default maxWidth to empty string so that we can override using css
            maxWidth=""
            {...rest}
            {...(shortcutKeyCombo ? { content: <ShortcutKeyComboTooltipContent {...shortcutKeyCombo} /> } : {})}
            className={`${shortcutKeyCombo ? 'shortcut-keys__tippy' : 'default-tt'} ${wordBreak ? 'dc__word-break' : ''} dc__mxw-200 ${rest.className ?? ''}`}
        >
            {cloneElement(child, { ...child.props, onMouseEnter: handleMouseEnterEvent })}
        </TippyJS>
    ) : (
        cloneElement(child, { ...child.props, onMouseEnter: handleMouseEnterEvent })
    )
}

export default Tooltip
