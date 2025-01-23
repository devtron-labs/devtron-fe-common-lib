import { renderToString } from 'react-dom/server'
import DOMPurify from 'dompurify'
import { linter } from '@codemirror/lint'
import { StreamLanguage } from '@codemirror/language'
import { json, jsonLanguage, jsonParseLinter } from '@codemirror/lang-json'
import { yaml, yamlLanguage } from '@codemirror/lang-yaml'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile'

import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'

import { SearchQuery } from '@codemirror/search'
import { EditorView, Extension, hoverTooltip } from '@uiw/react-codemirror'
import { MODES } from '@Common/Constants'
import {
    handleRefresh,
    jsonCompletion,
    jsonSchemaHover,
    jsonSchemaLinter,
    stateExtensions,
} from 'codemirror-json-schema'
import { yamlCompletion, yamlSchemaHover, yamlSchemaLinter } from 'codemirror-json-schema/yaml'
import { yamlParseLinter } from './Extensions'
import { CodeEditorProps, FindReplaceToggleButtonProps, GetCodeEditorHeightReturnType, HoverTexts } from './types'

// UTILS
export const getCodeEditorHeight = (height: CodeEditorProps['height']): GetCodeEditorHeightReturnType => {
    switch (height) {
        case '100%':
            return {
                codeEditorParentClassName: 'h-100',
                codeEditorClassName: 'h-100',
                codeEditorHeight: '100%',
            }
        case 'auto':
            return {
                codeEditorParentClassName: '',
                codeEditorClassName: '',
                codeEditorHeight: 'auto',
            }
        case 'fitToParent':
            return {
                codeEditorParentClassName: 'flex-grow-1 h-0 dc__overflow-hidden',
                codeEditorClassName: 'h-100',
                codeEditorHeight: '100%',
            }
        default:
            return {
                codeEditorParentClassName: '',
                codeEditorClassName: '',
                codeEditorHeight: `${height}px`,
            }
    }
}

export const getFindReplaceToggleButtonIconClass = ({
    iconType,
    isChecked,
}: Pick<FindReplaceToggleButtonProps, 'iconType' | 'isChecked'>) => {
    if (iconType === 'stroke') {
        return isChecked ? 'scb-5' : 'scn-7'
    }
    return isChecked ? 'fcb-5' : 'fcn-7'
}

export const getUpdatedSearchMatchesCount = (newQuery: SearchQuery, view: EditorView) => {
    const cursor = newQuery.getCursor(view.state)
    const updatedMatchesCount = { count: 0, current: 1 }
    const { from, to } = view.state.selection.main

    let item = cursor.next()
    while (newQuery.search !== '' && !item.done) {
        if ((item.value.from === from && item.value.to === to) || item.value.from < from) {
            updatedMatchesCount.current = updatedMatchesCount.count + 1
        }

        item = cursor.next()
        updatedMatchesCount.count += 1
    }

    return updatedMatchesCount
}

// DOM HELPERS
export const getFoldGutterElement = (open: boolean) => {
    const icon = document.createElement('span')
    icon.className = `flex h-100 ${!open ? 'is-closed' : ''}`
    const caretIcon = (
        <ICCaretDown
            className="icon-dim-12 scn-6 rotate"
            style={{ ['--rotateBy' as string]: !open ? '-90deg' : '0deg' }}
        />
    )

    icon.innerHTML = renderToString(caretIcon)
    return icon
}

const getHoverElement = (schemaURI: CodeEditorProps['schemaURI']) => (data: HoverTexts) => {
    const hoverContainer = document.createElement('div')
    const node = (
        <div className="code-editor__schema-tooltip dc__mxw-300 flexbox-col px-10 py-6 br-4 lh-18">
            {data.message && <p className="m-0">{data.message}</p>}
            {data.typeInfo && (
                <p
                    className="m-0"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(data.typeInfo.replace(/`([^`]+)`/g, '<code>$1</code>')),
                    }}
                />
            )}
            {schemaURI && (
                <a className="m-0 dc__w-fit-content" href={schemaURI} target="_blank" rel="noreferrer">
                    Source
                </a>
            )}
        </div>
    )

    hoverContainer.classList.add('dc__w-fit-content')
    hoverContainer.innerHTML = renderToString(node)
    return hoverContainer
}

export const getReadOnlyElement = () => {
    const dom = document.createElement('div')
    const node = (
        <div className="code-editor__read-only-tooltip py-6 px-10 br-4">
            <p className="m-0 fs-12 lh-18">Cannot edit in read-only editor</p>
        </div>
    )

    dom.innerHTML = renderToString(node)

    return dom
}

// EXTENSION UTILS
export const getLanguageExtension = (mode: CodeEditorProps['mode']): Extension => {
    switch (mode) {
        case MODES.JSON:
            return [json(), linter(jsonParseLinter())]
        case MODES.YAML:
            return [yaml(), linter(yamlParseLinter())]
        case MODES.SHELL:
            return StreamLanguage.define(shell)
        case MODES.DOCKERFILE:
            return StreamLanguage.define(dockerFile)
        default:
            return []
    }
}

export const getValidationSchema = ({
    mode,
    validatorSchema,
    schemaURI,
}: Pick<CodeEditorProps, 'schemaURI' | 'validatorSchema' | 'mode'>): Extension[] => {
    if (!Object.keys(validatorSchema).length) {
        return []
    }

    switch (mode) {
        case MODES.JSON:
            return [
                linter(jsonSchemaLinter(), {
                    needsRefresh: handleRefresh,
                }),
                jsonLanguage.data.of({
                    autocomplete: jsonCompletion(),
                }),
                hoverTooltip(
                    jsonSchemaHover({
                        formatHover: getHoverElement(schemaURI),
                    }),
                ),
                stateExtensions(validatorSchema),
            ]
        case MODES.YAML:
            return [
                linter(yamlSchemaLinter(), {
                    needsRefresh: handleRefresh,
                }),
                yamlLanguage.data.of({
                    autocomplete: yamlCompletion(),
                }),
                hoverTooltip(
                    yamlSchemaHover({
                        formatHover: getHoverElement(schemaURI),
                    }),
                ),
                stateExtensions(validatorSchema),
            ]
        default: {
            return []
        }
    }
}
