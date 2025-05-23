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

import { useState } from 'react'
import DOMPurify from 'dompurify'

import { ClipboardButton, ConditionalWrap, copyToClipboard, Tooltip, YAMLStringify } from '@Common/index'

import { NO_DEFINED_DESCRIPTION } from './constants'
import { SuggestionsItemProps } from './types'

const SuggestionItem = ({
    variableName,
    description,
    variableValue,
    isRedacted,
    highlightText,
    showValueOnHover,
}: SuggestionsItemProps) => {
    const [copyToClipboardPromise, setCopyToClipboardPromise] = useState<ReturnType<typeof copyToClipboard>>(null)

    const clipboardContent = `@{{${variableName}}}`

    const handleCopyTrigger = () => {
        setCopyToClipboardPromise(copyToClipboard(clipboardContent))
    }

    const sanitiseVariableValue = (value): JSX.Element => {
        if (isRedacted) {
            return <i className="text__white fs-12 fw-6 lh-18 m-0">is sensitive & hidden</i>
        }

        const rootClassName = 'text__white fs-12 fw-6 lh-18 m-0'

        if (value === '') {
            return <p className={rootClassName}>&apos;&quot;&quot;&apos;</p>
        }
        if (typeof value === 'boolean') {
            return <p className={rootClassName}>{value ? 'true' : 'false'}</p>
        }
        if (typeof value === 'object') {
            return (
                <pre className={`${rootClassName} dc__transparent--unstyled border__primary`}>
                    {YAMLStringify(value)}
                </pre>
            )
        }
        return <p className={rootClassName}>{value}</p>
    }

    const highlightedText = (text: string): string => {
        if (highlightText === '') {
            return text
        }

        try {
            const regex = new RegExp(highlightText, 'gi')
            return text.replace(regex, (match) => `<span class="bcy-2">${match}</span>`)
        } catch {
            return text
        }
    }

    const renderDescription = (): JSX.Element => {
        if (description === NO_DEFINED_DESCRIPTION) {
            return <p className="m-0 fs-12 fw-4 lh-18">{description}</p>
        }

        return (
            <p
                className="m-0 fs-12 fw-4 lh-18 dc__word-break-all"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightedText(description)) }}
            />
        )
    }

    const renderVariableName = (): JSX.Element => (
        <p
            className="m-0 fs-13 fw-6 lh-20 cn-9 dc__ellipsis-right"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightedText(variableName)) }}
        />
    )

    const renderTooltip = (children) => (
        <Tooltip
            className="default-tt dc__word-break-all"
            content={
                <div className="mw-200 flex column dc__content-start dc__align-start mxh-140 dc__overflow-auto">
                    <div className="flex column dc__content-start dc__align-start">Value</div>
                    <div className="flex column dc__content-start dc__align-start">
                        {sanitiseVariableValue(variableValue)}
                    </div>
                </div>
            }
            placement="left"
            interactive
            alwaysShowTippyOnHover
            // Have to append to body because the parent is draggable
            appendTo={document.body}
        >
            {children}
        </Tooltip>
    )

    return (
        // TODO: conditional wrap is not required since handled through alwaysShowTippyOnHover in tooltip
        <ConditionalWrap condition={showValueOnHover} wrap={renderTooltip}>
            <div
                className="flexbox-col pt-8 pb-8 pl-12 pr-12 dc__align-self-stretch bg__primary dc__border-bottom-n1 dc__hover-n50"
                onClick={handleCopyTrigger}
                data-testid="suggestion-item"
            >
                <div className="flexbox dc__align-items-center dc__gap-8 dc__ellipsis-right">
                    {renderVariableName()}

                    <ClipboardButton
                        content={clipboardContent}
                        copiedTippyText={`Copied: ${clipboardContent}`}
                        copyToClipboardPromise={copyToClipboardPromise}
                    />
                </div>

                <div className="flexbox dc__align-items-center">{renderDescription()}</div>
            </div>
        </ConditionalWrap>
    )
}

export default SuggestionItem
