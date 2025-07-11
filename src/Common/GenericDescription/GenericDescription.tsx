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
import ReactMde from 'react-mde'

import { ReactComponent as Edit } from '@Icons/ic-pencil.svg'
import { ReactComponent as UnorderedListIcon } from '@Icons/ic-unordered-list.svg'

import {
    Button,
    ButtonStyleType,
    ButtonVariantType,
    ComponentSizeType,
    Icon,
    ToastManager,
    ToastVariantType,
} from '../../Shared'
import { DEFAULT_MARKDOWN_EDITOR_PREVIEW_MESSAGE, MARKDOWN_EDITOR_COMMANDS } from '../Markdown/constant'
import Markdown from '../Markdown/MarkDown'
import { deepEqual, showError } from '..'
import { DESCRIPTION_EMPTY_ERROR_MSG, DESCRIPTION_UNSAVED_CHANGES_MSG } from './constant'
import { GenericDescriptionProps, MDEditorSelectedTabType } from './types'
import { getEditorCustomIcon, getParsedUpdatedOnDate } from './utils'

import 'react-mde/lib/styles/css/react-mde-all.css'
import './genericDescription.scss'

const GenericDescription = ({
    text,
    updatedBy,
    updatedOn,
    tabIndex,
    updateDescription,
    title,
    minEditorHeight = 300,
    emptyStateConfig,
}: GenericDescriptionProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [editorView, setEditorView] = useState<
        MDEditorSelectedTabType.PREVIEW | MDEditorSelectedTabType.WRITE | 'previewSaved' | 'empty'
    >(text ? 'previewSaved' : 'empty')
    const [modifiedDescriptionText, setModifiedDescriptionText] = useState<string>(text)
    const isDescriptionModified = !deepEqual(text, modifiedDescriptionText)
    const mdeRef = useRef(null)

    useEffect(() => {
        setModifiedDescriptionText(text)
    }, [text])

    const _date = getParsedUpdatedOnDate(updatedOn)

    const validateDescriptionText = (description: string): boolean => {
        const descriptionLength = description.length
        if (!descriptionLength) {
            ToastManager.showToast({
                variant: ToastVariantType.error,
                description: DESCRIPTION_EMPTY_ERROR_MSG,
            })
        }
        return !!descriptionLength
    }

    const handleCancel = () => {
        let isConfirmed: boolean = true
        if (isDescriptionModified) {
            // eslint-disable-next-line no-alert
            isConfirmed = window.confirm(DESCRIPTION_UNSAVED_CHANGES_MSG)
        }
        if (isConfirmed) {
            setModifiedDescriptionText(text)
            setEditorView(text ? 'previewSaved' : 'empty')
        }
    }

    const handleSave = async () => {
        const trimmedDescription = modifiedDescriptionText.trim()
        const isValidate = validateDescriptionText(trimmedDescription)
        if (!isValidate) {
            return
        }
        try {
            setIsLoading(true)
            await updateDescription(trimmedDescription)
            // Explicitly updating the state, since the modified state gets corrupted
            setModifiedDescriptionText(trimmedDescription)
            setEditorView('previewSaved')
        } catch (error) {
            showError(error)
            setEditorView(MDEditorSelectedTabType.WRITE)
            setModifiedDescriptionText(text)
        } finally {
            setIsLoading(false)
        }
    }

    const handleWriteDescription = () => {
        setEditorView(MDEditorSelectedTabType.WRITE)
    }

    const handleTabChange = (tab: MDEditorSelectedTabType) => {
        setEditorView(tab)
    }

    if (editorView === 'empty') {
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

    return (
        <div className="cluster__body-details">
            <div data-testid="generic-description-wrapper" className="dc__overflow-hidden">
                {editorView === 'previewSaved' ? (
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
                            <div
                                data-testid="description-edit-button"
                                className="dc__align-right pencil-icon cursor flex fw-6 cn-7"
                                onClick={handleWriteDescription}
                            >
                                <Edit className="icon-dim-16 mr-4 scn-7" /> Edit
                            </div>
                        </div>
                        <ReactMde
                            classes={{
                                reactMde:
                                    'mark-down-editor-container dc__word-break pb-16 pt-8 mark-down-editor__no-border',
                                toolbar: 'mark-down-editor__hidden',
                                preview: 'mark-down-editor-preview dc__bottom-radius-4',
                                textArea: 'mark-down-editor__hidden',
                            }}
                            value={text}
                            selectedTab="preview"
                            minPreviewHeight={150}
                            generateMarkdownPreview={(markdown) =>
                                Promise.resolve(<Markdown markdown={markdown} breaks disableEscapedText />)
                            }
                        />
                    </div>
                ) : (
                    <div className="min-w-500">
                        <ReactMde
                            ref={mdeRef}
                            classes={{
                                reactMde: 'mark-down-editor-container dc__word-break',
                                toolbar: 'mark-down-editor-toolbar tab-description',
                                preview: 'mark-down-editor-preview pt-8',
                                textArea: 'mark-down-editor-textarea-wrapper',
                            }}
                            getIcon={(commandName: string) => getEditorCustomIcon(commandName)}
                            toolbarCommands={MARKDOWN_EDITOR_COMMANDS}
                            value={modifiedDescriptionText}
                            onChange={setModifiedDescriptionText}
                            minEditorHeight={minEditorHeight}
                            minPreviewHeight={150}
                            selectedTab={editorView}
                            onTabChange={handleTabChange}
                            generateMarkdownPreview={(markdown: string) =>
                                Promise.resolve(
                                    <Markdown markdown={markdown || DEFAULT_MARKDOWN_EDITOR_PREVIEW_MESSAGE} breaks />,
                                )
                            }
                            childProps={{
                                writeButton: {
                                    className: `tab-list__tab pointer fs-13 ${
                                        editorView === MDEditorSelectedTabType.WRITE && 'cb-5 fw-6 active active-tab'
                                    }`,
                                },
                                previewButton: {
                                    className: `tab-list__tab pointer fs-13 ${
                                        editorView === MDEditorSelectedTabType.PREVIEW && 'cb-5 fw-6 active active-tab'
                                    }`,
                                },
                                textArea: {
                                    tabIndex,
                                },
                            }}
                        />
                        {editorView === MDEditorSelectedTabType.WRITE && (
                            <div className="form cluster__description-footer pt-12 pb-12">
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
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
export default GenericDescription
