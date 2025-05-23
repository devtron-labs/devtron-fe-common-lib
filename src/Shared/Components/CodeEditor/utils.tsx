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

import { render } from 'react-dom'
import { renderToString } from 'react-dom/server'
import { json, jsonLanguage, jsonParseLinter } from '@codemirror/lang-json'
import { yaml, yamlLanguage } from '@codemirror/lang-yaml'
import { StreamLanguage } from '@codemirror/language'
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { linter } from '@codemirror/lint'
import { MergeView } from '@codemirror/merge'
import { SearchQuery } from '@codemirror/search'
import { Annotation, EditorView, Extension, hoverTooltip, Transaction } from '@uiw/react-codemirror'
import {
    handleRefresh,
    jsonCompletion,
    jsonSchemaHover,
    jsonSchemaLinter,
    stateExtensions,
} from 'codemirror-json-schema'
import DOMPurify from 'dompurify'
import * as YAML from 'yaml'

import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'
import { MODES } from '@Common/Constants'
import { debounce, noop, YAMLStringify } from '@Common/Helper'
import { Tooltip } from '@Common/Tooltip'
import { Icon } from '@Shared/Components'
import { yamlCompletion, yamlSchemaHover, yamlSchemaLinter } from 'codemirror-json-schema/yaml'

import { yamlParseLinter } from './Extensions'
import { CodeEditorProps, FindReplaceToggleButtonProps, GetCodeEditorHeightReturnType, HoverTexts } from './types'

const syncAnnotationA = Annotation.define<boolean>()
const syncAnnotationB = Annotation.define<boolean>()

// UTILS
export const parseValueToCode = (value: string, mode: string, tabSize: number) => {
    let obj = null

    try {
        obj = JSON.parse(value)
    } catch {
        try {
            obj = YAML.parse(value)
        } catch {
            noop()
        }
    }

    let final = value

    if (obj) {
        switch (mode) {
            case MODES.JSON:
                final = JSON.stringify(obj, null, tabSize)
                break
            case MODES.YAML:
                final = YAMLStringify(obj)
                break
            default:
                break
        }
    }

    return final
}

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

export const updateDiffMinimapValues = (view: MergeView, transactions: readonly Transaction[], side: 'a' | 'b') => {
    if (!view) {
        return
    }

    const syncAnnotation = side === 'a' ? syncAnnotationA : syncAnnotationB
    transactions.forEach((tr) => {
        if (!tr.changes.empty && !tr.annotation(syncAnnotation)) {
            const annotations: Annotation<any>[] = [syncAnnotation.of(true)]
            const userEvent = tr.annotation(Transaction.userEvent)

            if (userEvent) {
                annotations.push(Transaction.userEvent.of(userEvent))
            }

            const debouncedDispatch = debounce(
                () =>
                    view[side].dispatch({
                        changes: tr.changes,
                        annotations,
                    }),
                300,
            )

            debouncedDispatch()
        }
    })
}

export const getScanLimit = (lhsValue: string, value: string) => {
    const numberOfLines = Math.max((lhsValue ?? '').split('\n').length, (value ?? '').split('\n').length)

    if (numberOfLines <= 5000) {
        return 5000
    }

    if (numberOfLines <= 10000) {
        return 10000
    }

    if (numberOfLines <= 15000) {
        return 15000
    }

    if (numberOfLines <= 20000) {
        return 20000
    }

    return 500
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
        <div className="code-editor__schema-tooltip dc__mxw-300 flexbox-col px-10 py-6 br-4 fs-12 lh-18 text__white">
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
                <a
                    className="m-0 dc__w-fit-content code-editor__schema-tooltip__source"
                    href={schemaURI}
                    target="_blank"
                    rel="noreferrer"
                >
                    Source
                </a>
            )}
        </div>
    )

    hoverContainer.innerHTML = renderToString(node)
    return hoverContainer
}

export const getReadOnlyElement = () => {
    const dom = document.createElement('div')
    const node = (
        <div className="code-editor__read-only-tooltip py-6 px-10 br-4 text__white">
            <p className="m-0 fs-12 lh-18">Cannot edit in read-only editor</p>
        </div>
    )

    dom.innerHTML = renderToString(node)

    return dom
}

export const getRevertControlButton = () => {
    const dom = document.createElement('button')

    render(
        <Tooltip content="Revert this chunk" alwaysShowTippyOnHover>
            <div className="flex">
                <Icon name="ic-arrow-right" color="N600" size={20} />
            </div>
        </Tooltip>,
        dom,
    )

    return dom
}

// EXTENSION UTILS
export const getLanguageExtension = (mode: CodeEditorProps['mode'], disableLint = false): Extension => {
    switch (mode) {
        case MODES.JSON:
            return [json(), ...(!disableLint ? [linter(jsonParseLinter())] : [])]
        case MODES.YAML:
            return [yaml(), ...(!disableLint ? [linter(yamlParseLinter())] : [])]
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
    if (!Object.keys(validatorSchema ?? {}).length) {
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
