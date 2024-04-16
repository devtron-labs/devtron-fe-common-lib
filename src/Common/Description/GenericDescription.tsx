import { useState, useRef } from 'react'
import Tippy from '@tippyjs/react'
import ReactMde from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'
import { toast } from 'react-toastify'
import Markdown from '../Markdown/MarkDown'
import {
    DESCRIPTION_EMPTY_ERROR_MSG,
    DESCRIPTION_UNSAVED_CHANGES_MSG,
    DESCRIPTION_UPDATE_MSG,
    deepEqual,
    showError,
    toastAccessDenied,
} from '..'
import './genericDescription.scss'
import { ReactComponent as Edit } from '../../Assets/Icon/ic-pencil.svg'
import { GenericDescriptionProps } from './types'
import {
    DEFAULT_MARKDOWN_EDITOR_PREVIEW_MESSAGE,
    MARKDOWN_EDITOR_COMMANDS,
    MARKDOWN_EDITOR_COMMAND_TITLE,
    MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT,
} from '../Markdown/constant'
import { MDEditorSelectedTabType, MD_EDITOR_TAB } from './constant'
import { ReactComponent as HeaderIcon } from '../../Assets/Icon/ic-header.svg'
import { ReactComponent as BoldIcon } from '../../Assets/Icon/ic-bold.svg'
import { ReactComponent as ItalicIcon } from '../../Assets/Icon/ic-italic.svg'
import { ReactComponent as LinkIcon } from '../../Assets/Icon/ic-link.svg'
import { ReactComponent as StrikethroughIcon } from '../../Assets/Icon/ic-strikethrough.svg'
import { ReactComponent as CodeIcon } from '../../Assets/Icon/ic-code.svg'
import { ReactComponent as QuoteIcon } from '../../Assets/Icon/ic-quote.svg'
import { ReactComponent as ImageIcon } from '../../Assets/Icon/ic-image.svg'
import { ReactComponent as OrderedListIcon } from '../../Assets/Icon/ic-ordered-list.svg'
import { ReactComponent as UnorderedListIcon } from '../../Assets/Icon/ic-unordered-list.svg'
import { ReactComponent as CheckedListIcon } from '../../Assets/Icon/ic-checked-list.svg'

const GenericDescription = ({
    isSuperAdmin,
    descriptionText,
    descriptionUpdatedBy,
    descriptionUpdatedOn,
    initialEditDescriptionView,
    tabIndex,
    updateDescription,
    releaseId,
}: GenericDescriptionProps) => {
    const [isEditDescriptionView, setEditDescriptionView] = useState<boolean>(initialEditDescriptionView)
    const [modifiedDescriptionText, setModifiedDescriptionText] = useState<string>(descriptionText)
    const [selectedTab, setSelectedTab] = useState<MDEditorSelectedTabType>(MD_EDITOR_TAB.WRITE)
    const isDescriptionModified: boolean = !deepEqual(descriptionText, modifiedDescriptionText)
    const mdeRef = useRef(null)

    const validateDescriptionText = (): boolean => {
        let isValid = true
        if (modifiedDescriptionText.length === 0) {
            toast.error(DESCRIPTION_EMPTY_ERROR_MSG)
            isValid = false
        }
        return isValid
    }

    const isAuthorized = (): boolean => {
        if (!isSuperAdmin) {
            toastAccessDenied()
            return false
        }
        return true
    }

    const toggleDescriptionView = () => {
        if (isAuthorized()) {
            let isConfirmed: boolean = true
            if (isDescriptionModified) {
                // eslint-disable-next-line no-alert
                isConfirmed = window.confirm(DESCRIPTION_UNSAVED_CHANGES_MSG)
            }
            if (isConfirmed) {
                setModifiedDescriptionText(descriptionText)
                setEditDescriptionView(!isEditDescriptionView)
                setSelectedTab(MD_EDITOR_TAB.WRITE)
            }
        }
    }

    const handleSave = (): void => {
        const isValidate = validateDescriptionText()
        if (!isValidate) {
            return
        }
        try {
            const payload = {
                id: releaseId,
                releaseNote: modifiedDescriptionText,
            }
            updateDescription(payload)
            toast.success(DESCRIPTION_UPDATE_MSG)
            setEditDescriptionView(true)
        } catch (error) {
            showError(error)
        }
    }

    // TODO: add commandName
    // eslint-disable-next-line consistent-return
    const editorCustomIcon = (commandName: string): JSX.Element => {
        // eslint-disable-next-line default-case
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
        }
    }

    return (
        <div className={`cluster__body-details ${initialEditDescriptionView ? 'pb-16 dc__overflow-scroll' : ''}`}>
            <div
                data-testid="cluster-note-wrapper"
                className={!isEditDescriptionView ? 'dc__overflow-auto' : 'dc__overflow-hidden'}
            >
                {isEditDescriptionView ? (
                    <div className="min-w-500 bcn-0 br-4 dc__border-top dc__border-left dc__border-right w-100 dc__border-bottom">
                        <div className="pt-8 pb-8 pl-16 pr-16 dc__top-radius-4 flex bc-n50 dc__border-bottom h-36 fs-13">
                            <div className="fw-6 lh-20 cn-9">Readme</div>
                            {descriptionUpdatedBy && descriptionUpdatedOn && (
                                <div className="flex left fw-4 cn-7 ml-8">
                                    Last updated by {descriptionUpdatedBy} on {descriptionUpdatedOn}
                                </div>
                            )}
                            <div
                                data-testid="description-edit-button"
                                className="dc__align-right pencil-icon cursor flex fw-6 cn-7"
                                onClick={toggleDescriptionView}
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
                            value={descriptionText}
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
                                reactMde: `mark-down-editor-container dc__word-break ${
                                    initialEditDescriptionView ? '' : 'create-app-description'
                                }`,
                                toolbar: 'mark-down-editor-toolbar tab-description',
                                preview: 'mark-down-editor-preview pt-8',
                                textArea: `mark-down-editor-textarea-wrapper ${
                                    initialEditDescriptionView ? '' : 'h-200-imp'
                                }`,
                            }}
                            getIcon={(commandName: string) => editorCustomIcon(commandName)}
                            toolbarCommands={MARKDOWN_EDITOR_COMMANDS}
                            value={modifiedDescriptionText}
                            onChange={setModifiedDescriptionText}
                            minEditorHeight={window.innerHeight - 165}
                            minPreviewHeight={150}
                            selectedTab={selectedTab}
                            onTabChange={setSelectedTab}
                            generateMarkdownPreview={(markdown: string) =>
                                Promise.resolve(
                                    <Markdown markdown={markdown || DEFAULT_MARKDOWN_EDITOR_PREVIEW_MESSAGE} breaks />,
                                )
                            }
                            childProps={{
                                writeButton: {
                                    className: `tab-list__tab pointer fs-13 ${
                                        selectedTab === MD_EDITOR_TAB.WRITE && 'cb-5 fw-6 active active-tab'
                                    }`,
                                },
                                previewButton: {
                                    className: `tab-list__tab pointer fs-13 ${
                                        selectedTab === MD_EDITOR_TAB.PREVIEW && 'cb-5 fw-6 active active-tab'
                                    }`,
                                },
                                textArea: {
                                    tabIndex,
                                },
                            }}
                        />
                        {initialEditDescriptionView && (
                            <div className="form cluster__description-footer pt-12 pb-12">
                                <div className="form__buttons pl-16 pr-16">
                                    <button
                                        data-testid="description-edit-cancel-button"
                                        className="cta cancel flex h-36 mr-12"
                                        type="button"
                                        onClick={toggleDescriptionView}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        data-testid="description-edit-save-button"
                                        className="cta flex h-36"
                                        type="submit"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
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
