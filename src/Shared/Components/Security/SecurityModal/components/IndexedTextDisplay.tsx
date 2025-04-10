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

import React from 'react'

import { ReactComponent as ICInfoOutline } from '@Icons/ic-info-outlined.svg'
import { ClipboardButton } from '@Common/index'

import { IndexedTextDisplayPropsType } from '../types'

const EmptyState: React.FC<{ href: string }> = ({ href }) => (
    <div className="flex flex-grow-1">
        <div className="flexbox-col dc__gap-8 dc__align-items-center fs-13 fw-6">
            <ICInfoOutline className="icon-dim-24 fcn-3" />
            <span>Code snippet is not available</span>
            {href && (
                <a href={href} rel="noopener noreferrer" target="_blank">
                    Go to file
                </a>
            )}
        </div>
    </div>
)

const IndexedTextDisplay: React.FC<IndexedTextDisplayPropsType> = ({ title, lines, link }) => (
    <div className="flexbox-col dc__align-self-stretch bg__primary dc__outline dc__border-radius-4-imp">
        <div className="flexbox pt-8 pb-8 pl-12 pr-12 dc__align-items-center dc__align-self-stretch dc__gap-4 dc__border-bottom-n1 bg__secondary mono">
            {link ? (
                <a className="mono" href={link} target="_blank" rel="noreferrer">
                    {title}
                </a>
            ) : (
                <span className="mono">{title}</span>
            )}
            <ClipboardButton content={title} />
        </div>

        <pre className="flexbox-col p-6 m-0 mh-150 bg__primary dc__no-border">
            {lines?.map((line) => (
                <div className="flexbox dc__gap-12 mono">
                    <span className={line.isCause ? 'cr-5' : ''}>{line.number}</span>
                    <span key={line.number}>{line.content}</span>
                </div>
            )) || <EmptyState href={link} />}
        </pre>
    </div>
)

export default IndexedTextDisplay
