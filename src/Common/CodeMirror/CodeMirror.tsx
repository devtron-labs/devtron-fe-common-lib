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

import { useEffect, useMemo, useReducer, useState } from 'react'
import CodeMirror, {
    Extension,
    hoverTooltip,
    ReactCodeMirrorProps,
    basicSetup,
    BasicSetupOptions,
    EditorState,
    Compartment,
} from '@uiw/react-codemirror'
import CodeMirrorMerge from 'react-codemirror-merge'
// eslint-disable-next-line import/no-extraneous-dependencies
import { StreamLanguage } from '@codemirror/language'
// eslint-disable-next-line import/no-extraneous-dependencies
import { linter, lintGutter } from '@codemirror/lint'
import { json as langJson, jsonLanguage } from '@codemirror/lang-json'
import { yaml as langYaml, yamlLanguage } from '@codemirror/lang-yaml'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile'
import {
    jsonSchemaHover,
    jsonSchemaLinter,
    jsonCompletion,
    handleRefresh,
    stateExtensions,
} from 'codemirror-json-schema'
import { yamlSchemaHover, yamlSchemaLinter, yamlCompletion } from 'codemirror-json-schema/yaml'

import { useTheme } from '@Shared/Providers'
import { getUniqueId } from '@Shared/Helpers'
import { cleanKubeManifest, noop, useEffectAfterMount, useJsonYaml } from '@Common/Helper'
import { DEFAULT_JSON_SCHEMA_URI, MODES } from '@Common/Constants'
import { Progressing } from '@Common/Progressing'

import { CodeEditorContextProps, CodeEditorProps, HoverTexts } from './types'
import { CodeEditorReducer, initialState, parseValueToCode } from './CodeEditor.reducer'
import { getCodeEditorThemeFromAppTheme } from './utils'
import { CodeEditorContext } from './CodeEditor.context'
import { Clipboard, ErrorBar, Header, Information, ValidationError, Warning } from './CodeEditor.components'

import './codeEditor.scss'

export const CodeEditor = ({
    value: propValue,
    originalValue,
    modifiedValue,
    mode = MODES.JSON,
    noParsing = false,
    children,
    tabSize = 2,
    height = 450,
    shebang = '',
    onChange,
    onOriginalValueChange,
    onModifiedValueChange,
    readOnly,
    placeholder,
    diffView,
    theme,
    loading,
    customLoader,
    validatorSchema,
    schemaURI = DEFAULT_JSON_SCHEMA_URI,
    cleanData = false,
    onBlur,
    onFocus,
    autoFocus,
    disableSearch = false,
}: CodeEditorProps) => {
    // HOOKS
    const { appTheme } = useTheme()

    // Cleaning KubeManifest
    const _value = diffView ? modifiedValue : propValue
    const value = cleanData ? cleanKubeManifest(_value) : _value
    const lhsValue = cleanData ? cleanKubeManifest(originalValue) : originalValue

    // STATES
    const [codemirrorMergeKey, setCodemirrorMergeKey] = useState<string>()

    // REDUCER
    const [state, dispatch] = useReducer(
        CodeEditorReducer,
        initialState({
            mode,
            theme,
            value,
            lhsValue,
            noParsing,
            tabSize,
            appTheme,
            diffView,
        }),
    )

    // ERROR
    const [, , , error] = useJsonYaml(state.code, tabSize, mode, !state.noParsing)

    // CONTEXT VALUE
    const contextValue = useMemo<CodeEditorContextProps>(() => ({ dispatch, state, error, height }), [state, error])

    // USE-EFFECTS
    useEffect(() => {
        // Change theme whenever `appTheme` changes
        dispatch({ type: 'setTheme', value: getCodeEditorThemeFromAppTheme(theme, appTheme) })
    }, [appTheme])

    // Toggle `state.diffMode` based on `diffView`
    useEffect(() => {
        dispatch({ type: 'setDiff', value: diffView })
    }, [diffView])

    // Re-mounting codemirror-merge is necessary because its extensions don't automatically update after being changed.
    // Bug reference: https://github.com/uiwjs/react-codemirror/issues/681#issuecomment-2341521112
    useEffect(
        () => {
            setCodemirrorMergeKey(getUniqueId())
        },
        // Include any props that modify codemirror-merge extensions directly, as a workaround for the unresolved bug.
        [readOnly, tabSize],
    )

    // METHODS
    const setCode = (codeValue: string) => {
        dispatch({ type: 'setCode', value: codeValue })
        if (state.diffMode) {
            onModifiedValueChange?.(codeValue)
        } else {
            onChange?.(codeValue)
        }
    }

    const setLhsCode = (codeValue: string) => {
        dispatch({ type: 'setLhsCode', value: codeValue })
        onOriginalValueChange?.(codeValue)
    }

    useEffectAfterMount(() => {
        if (value === state.code) {
            return
        }

        setCode(noParsing ? value : parseValueToCode(value, mode, tabSize))
    }, [value, noParsing])

    useEffectAfterMount(() => {
        if (lhsValue === state.lhsCode) {
            return
        }

        setLhsCode(noParsing ? lhsValue : parseValueToCode(lhsValue, mode, tabSize))
    }, [lhsValue, noParsing])

    // CODEMIRROR PROPS
    const compartment = new Compartment()

    const basicSetupOptions: BasicSetupOptions = {
        searchKeymap: !disableSearch,
    }

    const handleOnChange: ReactCodeMirrorProps['onChange'] = (newValue) => {
        setCode(newValue)
    }

    const handleLhsOnChange: ReactCodeMirrorProps['onChange'] = (newLhsValue) => {
        setLhsCode(newLhsValue)
    }

    const getLanguageExtension = () => {
        switch (mode) {
            case MODES.JSON:
                return langJson()
            case MODES.YAML:
                return langYaml()
            case MODES.SHELL:
                return StreamLanguage.define(shell)
            case MODES.DOCKERFILE:
                return StreamLanguage.define(dockerFile)
            default:
                return noop()
        }
    }

    const formatHover = (data: HoverTexts) => {
        const div = document.createElement('div')
        const node = `<div class="flexbox-col dc__gap-8 p-12">
                        <p class="m-0">${data.message}</p>
                        <div class="flexbox-col dc__gap-6">
                            <p class="m-0">${data.typeInfo}</p>
                            <a class="m-0" href="${schemaURI}" target="_blank">Source</a>
                        </div>
                    </div>`

        div.innerHTML = node
        return div
    }

    const getValidationSchema = (): Extension[] => {
        switch (mode) {
            case MODES.JSON:
                return [
                    linter(jsonSchemaLinter(), {
                        needsRefresh: handleRefresh,
                    }),
                    jsonLanguage.data.of({
                        autocomplete: jsonCompletion(),
                    }),
                    hoverTooltip(jsonSchemaHover()),
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
                            formatHover,
                        }),
                    ),
                    stateExtensions(validatorSchema),
                ]
            default: {
                return []
            }
        }
    }

    const extensions: Extension[] = [
        basicSetup(basicSetupOptions),
        getLanguageExtension(),
        ...(!state.diffMode ? [lintGutter(), getValidationSchema()] : []),
        compartment.of(EditorState.tabSize.of(tabSize)),
    ]

    const originalViewExtensions: Extension[] = [
        basicSetup(basicSetupOptions),
        getLanguageExtension(),
        compartment.of(EditorState.tabSize.of(tabSize)),
    ]

    const modifiedViewExtensions: Extension[] = [
        basicSetup(basicSetupOptions),
        getLanguageExtension(),
        compartment.of(EditorState.tabSize.of(tabSize)),
    ]

    const renderCodeEditor = () => {
        if (loading) {
            return (
                customLoader || (
                    <div className="flex" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
                        <Progressing pageLoader />
                    </div>
                )
            )
        }

        return state.diffMode ? (
            <CodeMirrorMerge
                key={codemirrorMergeKey}
                className={`vertical-divider ${height === '100%' ? 'h-100 dc__overflow-auto' : ''}`}
                style={{ height: typeof height === 'number' ? `${height}px` : undefined }}
                gutter
                destroyRerender={false}
            >
                <CodeMirrorMerge.Original
                    basicSetup={false}
                    value={state.lhsCode}
                    readOnly={readOnly}
                    onChange={handleLhsOnChange}
                    extensions={originalViewExtensions}
                />
                <CodeMirrorMerge.Modified
                    basicSetup={false}
                    value={state.code}
                    readOnly={readOnly}
                    onChange={handleOnChange}
                    extensions={modifiedViewExtensions}
                />
            </CodeMirrorMerge>
        ) : (
            <div className={height === '100%' ? 'h-100' : ''}>
                {shebang && <div className="code-editor__shebang">{shebang}</div>}
                <CodeMirror
                    className={height === '100%' ? 'h-100' : ''}
                    basicSetup={false}
                    value={state.code}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    height={typeof height === 'number' ? `${height}px` : height}
                    autoFocus={autoFocus}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleOnChange}
                    extensions={extensions}
                />
            </div>
        )
    }

    return (
        <CodeEditorContext.Provider value={contextValue}>
            {children}
            {renderCodeEditor()}
        </CodeEditorContext.Provider>
    )
}

CodeEditor.ValidationError = ValidationError
CodeEditor.Clipboard = Clipboard
CodeEditor.Header = Header
CodeEditor.Warning = Warning
CodeEditor.ErrorBar = ErrorBar
CodeEditor.Information = Information
