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

import { commands } from '@uiw/react-md-editor'

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

export const DESCRIPTION_EMPTY_ERROR_MSG = 'Readme cannot be empty. Please add some information or cancel the changes.'
export const DESCRIPTION_UNSAVED_CHANGES_MSG = 'Are you sure you want to discard your changes?'

export const TOOLBAR_SECONDARY_COMMANDS = [
    {
        ...commands.bold,
        icon: <BoldIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.italic,
        icon: <ItalicIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.strikethrough,
        icon: <StrikethroughIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.heading,
        icon: <HeaderIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.quote,
        icon: <QuoteIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.code,
        icon: <CodeIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.link,
        icon: <LinkIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.image,
        icon: <ImageIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.orderedListCommand,
        icon: <OrderedListIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.unorderedListCommand,
        icon: <UnorderedListIcon className="icon-dim-16 flex" />,
    },
    {
        ...commands.checkedListCommand,
        icon: <CheckedListIcon className="icon-dim-16 flex" />,
    },
]
