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

import Tippy from '@tippyjs/react'
import moment from 'moment'

import { ReactComponent as BoldIcon } from '@Icons/ic-bold.svg'
import { ReactComponent as CheckedListIcon } from '@Icons/ic-checked-list.svg'
import { ReactComponent as CodeIcon } from '@Icons/ic-code.svg'
import { ReactComponent as HeaderIcon } from '@Icons/ic-header.svg'
import { ReactComponent as ImageIcon } from '@Icons/ic-image.svg'
import { ReactComponent as ItalicIcon } from '@Icons/ic-italic.svg'
import { ReactComponent as LinkIcon } from '@Icons/ic-link.svg'
import { ReactComponent as OrderedListIcon } from '@Icons/ic-ordered-list.svg'
import { ReactComponent as QuoteIcon } from '@Icons/ic-quote.svg'
import { ReactComponent as StrikethroughIcon } from '@Icons/ic-strikethrough.svg'
import { ReactComponent as UnorderedListIcon } from '@Icons/ic-unordered-list.svg'
import { DATE_TIME_FORMATS, ZERO_TIME_STRING } from '@Common/Constants'
import { logExceptionToSentry } from '@Common/Helper'
import { MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT, MARKDOWN_EDITOR_COMMAND_TITLE } from '@Common/Markdown/constant'

export const getParsedUpdatedOnDate = (updatedOn: string) => {
    if (!updatedOn || updatedOn === ZERO_TIME_STRING) {
        return ''
    }

    const _moment = moment(updatedOn)

    return _moment.isValid() ? _moment.format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT) : updatedOn
}

export const getEditorCustomIcon = (commandName: string): JSX.Element => {
    switch (commandName) {
        case MARKDOWN_EDITOR_COMMAND_TITLE.HEADER:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <HeaderIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.BOLD:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <BoldIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.ITALIC:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <ItalicIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.STRIKETHROUGH:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <StrikethroughIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.LINK:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <LinkIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.QUOTE:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <QuoteIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.CODE:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <CodeIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.IMAGE:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <ImageIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.UNORDERED_LIST:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <UnorderedListIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.ORDERED_LIST:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <OrderedListIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        case MARKDOWN_EDITOR_COMMAND_TITLE.CHECKED_LIST:
            return (
                <Tippy
                    className="default-tt"
                    arrow={false}
                    placement="bottom"
                    content={MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT[commandName]}
                >
                    <div className="flex">
                        <CheckedListIcon className="icon-dim-16 flex" />
                    </div>
                </Tippy>
            )
        default:
            logExceptionToSentry('Invalid command for MDE')
            return null
    }
}
