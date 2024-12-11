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

import { marked, Tokens } from 'marked'
import DOMPurify from 'dompurify'
import { useEffect, useRef } from 'react'
import { MarkDownProps } from './Types'
import './markdown.scss'

const renderer = new marked.Renderer()

const MarkDown = ({ setExpandableIcon, markdown, className, breaks, disableEscapedText, ...props }: MarkDownProps) => {
    const mdeRef = useRef(null)

    const getHeight = () => {
        const editorHeight = mdeRef.current?.clientHeight
        const minHeight = 320
        const showExpandableViewIcon = editorHeight > minHeight
        if (typeof setExpandableIcon === 'function') {
            setExpandableIcon(showExpandableViewIcon)
        }
    }
    useEffect(() => {
        getHeight()
    }, [markdown])

    const renderTableRow = (row: Tokens.TableCell[]) => `
            <tr>
                ${row.map((rowCell) => `<td align="${rowCell.align}">${marked(rowCell.text)}</td>`).join('')}
            </tr>
        `

    renderer.listitem = ({ text, task, checked }: Tokens.ListItem) => {
        if (task) {
            return `<li style="list-style: none">
                        <input disabled type="checkbox" ${checked ? 'checked' : ''} class="dc__vertical-align-middle" style="margin: 0 0.2em 0.25em -1.4em">
                        ${marked(text)}
                    </li>`
        }
        return `<li>${marked(text)}</li>`
    }

    renderer.image = ({ href, title, text }: Tokens.Image) =>
        `<img src="${href}" alt="${text}" title="${title}" class="max-w-100">`

    renderer.table = ({ header, rows }: Tokens.Table) => `
        <div class="table-container">
            <table>
                <thead>
                    <tr>${header.map((headerCell) => `<th align="${headerCell.align}">${marked(headerCell.text)}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${rows.map((row) => renderTableRow(row)).join('')}
                </tbody>
            </table>
        </div>
        `

    renderer.heading = ({ text, depth }: Tokens.Heading) => {
        const escapedText = disableEscapedText ? '' : text.toLowerCase().replace(/[^\w]+/g, '-')

        return `
          <a name="${escapedText}" rel="noreferrer noopener" class="anchor" href="#${escapedText}">
                <h${depth} data-testid="deployment-template-readme-version">
              <span class="header-link"></span>
              ${text}
              </h${depth}>
            </a>`
    }

    marked.setOptions({
        renderer,
        gfm: true,
        ...(breaks && { breaks: true }),
    })

    const createMarkup = () => ({
        __html: DOMPurify.sanitize(marked(markdown) as string, { USE_PROFILES: { html: true } }),
    })

    return (
        <article
            {...props}
            ref={mdeRef}
            className={`markdown ${className}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={createMarkup()}
            data-testid="markdown-rendered-content"
        />
    )
}

export default MarkDown
