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

import { useMemo, useState } from 'react'
import MDEditor, { commands } from '@uiw/react-md-editor'

import { ReactComponent as BoldIcon } from '@Icons/ic-bold.svg'
import { ReactComponent as CheckedListIcon } from '@Icons/ic-checked-list.svg'
import { ReactComponent as CodeIcon } from '@Icons/ic-code.svg'
import { ReactComponent as HeaderIcon } from '@Icons/ic-header.svg'
import { ReactComponent as ImageIcon } from '@Icons/ic-image.svg'
import { ReactComponent as ItalicIcon } from '@Icons/ic-italic.svg'
import { ReactComponent as LinkIcon } from '@Icons/ic-link.svg'
import { ReactComponent as OrderedListIcon } from '@Icons/ic-ordered-list.svg'
import { ReactComponent as Edit } from '@Icons/ic-pencil.svg'
import { ReactComponent as QuoteIcon } from '@Icons/ic-quote.svg'
import { ReactComponent as StrikethroughIcon } from '@Icons/ic-strikethrough.svg'
import { ReactComponent as UnorderedListIcon } from '@Icons/ic-unordered-list.svg'

import {
    AppThemeType,
    Button,
    ButtonStyleType,
    ButtonVariantType,
    ComponentSizeType,
    Icon,
    ToastManager,
    ToastVariantType,
    useTheme,
} from '../../Shared'
import Markdown from '../Markdown/MarkDown'
import { showError } from '..'
import { DESCRIPTION_EMPTY_ERROR_MSG, DESCRIPTION_UNSAVED_CHANGES_MSG } from './constant'
import { GenericDescriptionProps } from './types'
import { getParsedUpdatedOnDate } from './utils'

import './genericDescription.scss'

const extraCommands = [
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
    {
        ...commands.help,
        icon: (
            <div className="flex dc__no-shrink">
                <Icon name="ic-help-outline" color="N700" size={16} />
            </div>
        ),
    },
]

const GenericDescription = ({
    text,
    updatedBy,
    updatedOn,
    updateDescription,
    title,
    emptyStateConfig,
}: GenericDescriptionProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [modifiedValue, setModifiedValue] = useState(text || '')
    const [isEditView, setIsEditView] = useState(false)

    const [editorViewState, setEditorViewState] = useState<'write' | 'preview'>('write')

    const { appTheme } = useTheme()

    const _date = getParsedUpdatedOnDate(updatedOn)

    const myCommands = useMemo(
        () => [
            {
                ...commands.codeEdit,
                icon: <span className="fs-13 fw-6 lh-20">Write</span>,
                execute: (...props) => {
                    setEditorViewState('write')
                    return commands.codeEdit.execute(...props)
                },
            } satisfies typeof commands.codeEdit,
            {
                ...commands.codePreview,
                icon: <span className="fs-13 fw-6 lh-20">Preview</span>,
                execute: (...props) => {
                    setEditorViewState('preview')
                    return commands.codePreview.execute(...props)
                },
            } satisfies typeof commands.codePreview,
        ],
        [],
    )

    const handleCancel = () => {
        const isDescriptionModified = modifiedValue.trim() !== (text || '').trim()
        let isConfirmed = true

        if (isDescriptionModified) {
            // eslint-disable-next-line no-alert
            isConfirmed = window.confirm(DESCRIPTION_UNSAVED_CHANGES_MSG)
        }

        if (isConfirmed) {
            setModifiedValue(text)
            setIsEditView(false)
        }
    }

    const handleSave = async () => {
        const trimmedDescription = modifiedValue.trim()
        if (!trimmedDescription) {
            ToastManager.showToast({
                variant: ToastVariantType.error,
                description: DESCRIPTION_EMPTY_ERROR_MSG,
            })
            return
        }
        try {
            setIsLoading(true)
            await updateDescription(trimmedDescription)
        } catch (error) {
            showError(error)
        } finally {
            setIsLoading(false)
            setIsEditView(false)
        }
    }

    const handleWriteDescription = () => {
        setIsEditView(true)
    }

    if (!text && !isEditView) {
        const { img, subtitle } = emptyStateConfig || {}
        return (
            <div className="flexbox w-100 bg__primary br-8 dc__border-dashed--n3">
                <div className="flexbox-col p-24 dc__gap-12">
                    <div className="flexbox-col dc__gap-6">
                        <span className="fs-18 fw-6 cn-9">{title}</span>
                        {subtitle && <div className="fs-13 fw-4 lh-20 cn-8">{subtitle}</div>}
                    </div>
                    <Button
                        dataTestId="edit-description"
                        startIcon={<Icon name="ic-pencil" color={null} />}
                        onClick={handleWriteDescription}
                        text="Write"
                        variant={ButtonVariantType.secondary}
                        size={ComponentSizeType.medium}
                    />
                </div>
                {img && <img src={img} width="585px" height="243px" alt="release-note" className="br-8 bg__primary" />}
            </div>
        )
    }

    const renderMarkdown = (source: string) => (
        <Markdown markdown={source} breaks disableEscapedText className="mh-150 pt-8" />
    )

    return (
        <div
            data-testid="generic-description-wrapper"
            className={`flexbox-col markdown-editor__wrapper bg__primary ${isEditView ? 'br-4 border__primary' : ''}`}
        >
            {!isEditView ? (
                <div className="min-w-500 bg__primary br-4 dc__border-top dc__border-left dc__border-right w-100 dc__border-bottom">
                    <div className="pt-8 pb-8 pl-16 pr-16 dc__top-radius-4 flex bg__secondary dc__border-bottom h-36">
                        <div className="flexbox dc__gap-6 dc__align-items-center">
                            <UnorderedListIcon className="icon-dim-16" />
                            <div className="fw-6 lh-20 cn-9 fs-13">{title}</div>
                        </div>
                        {updatedBy && _date && (
                            <div className="flex left fw-4 cn-7 ml-8 fs-12 h-20">
                                Last updated by &nbsp;
                                <span className="dc__ellipsis-right dc__mxw-200">{updatedBy}</span>&nbsp;on {_date}
                            </div>
                        )}
                        <button
                            data-testid="description-edit-button"
                            type="button"
                            className="dc__align-right pencil-icon dc__transparent cursor flex fw-6 cn-7"
                            aria-label="Edit"
                            onClick={handleWriteDescription}
                        >
                            <Edit className="icon-dim-16 mr-4 scn-7" /> Edit
                        </button>
                    </div>

                    {renderMarkdown(text)}
                </div>
            ) : (
                <>
                    <MDEditor
                        value={modifiedValue}
                        onChange={setModifiedValue}
                        data-color-mode={appTheme === AppThemeType.dark ? 'dark' : 'light'}
                        commands={myCommands}
                        extraCommands={extraCommands}
                        preview={editorViewState === 'preview' ? 'preview' : 'edit'}
                        components={{
                            preview: renderMarkdown,
                        }}
                    />

                    <div className="flexbox dc__content-end pt-12 pb-12 dc__contain--paint">
                        <div className="form__buttons dc__gap-16 px-16">
                            <Button
                                dataTestId="description-edit-cancel-button"
                                text="Cancel"
                                disabled={isLoading}
                                onClick={handleCancel}
                                variant={ButtonVariantType.secondary}
                                style={ButtonStyleType.neutral}
                            />
                            <Button
                                dataTestId="description-edit-save-button"
                                text="Save"
                                isLoading={isLoading}
                                onClick={handleSave}
                                buttonProps={{
                                    type: 'submit',
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
export default GenericDescription
