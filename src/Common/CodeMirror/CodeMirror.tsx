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

import { useEffect, useMemo, useReducer, useRef } from 'react'
import CodeMirror, {
    Extension,
    hoverTooltip,
    ReactCodeMirrorProps,
    ReactCodeMirrorRef,
    basicSetup,
    BasicSetupOptions,
} from '@uiw/react-codemirror'
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
import { cleanKubeManifest, noop, useEffectAfterMount, useJsonYaml } from '@Common/Helper'
import { DEFAULT_JSON_SCHEMA_URI, MODES } from '@Common/Constants'

import { CodeEditorContextProps, CodeEditorProps, HoverTexts } from './types'
import { CodeEditorReducer, initialState, parseValueToCode } from './CodeEditor.reducer'
import { getCodeEditorThemeFromAppTheme } from './utils'
import { CodeEditorContext } from './CodeEditor.context'
import {
    Clipboard,
    CodeEditorPlaceholder,
    ErrorBar,
    Header,
    Information,
    ValidationError,
    Warning,
} from './CodeEditor.components'

import './codeEditor.scss'

export const CodeEditor = ({
    value: propValue,
    mode = MODES.JSON,
    noParsing = false,
    defaultValue: propDefaultValue = '',
    children,
    tabSize = 2,
    height = 450,
    shebang = '',
    onChange,
    readOnly,
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

    // REFS
    const codemirrorRef = useRef<ReactCodeMirrorRef>()

    // Cleaning KubeManifest
    const value = cleanData ? cleanKubeManifest(propValue) : propValue
    const defaultValue = cleanData ? cleanKubeManifest(propDefaultValue) : propDefaultValue

    // REDUCER
    const [state, dispatch] = useReducer(
        CodeEditorReducer,
        initialState({
            mode,
            theme,
            value,
            defaultValue,
            noParsing,
            tabSize,
            appTheme,
            diffView,
        }),
    )

    // ERROR
    const [, , , error] = useJsonYaml(state.code, tabSize, mode, !state.noParsing)

    const contextValue = useMemo<CodeEditorContextProps>(
        () => ({ dispatch, state, error, height }),
        [state, error, defaultValue],
    )

    useEffect(() => {
        // Change theme whenever `appTheme` changes
        dispatch({ type: 'setTheme', value: getCodeEditorThemeFromAppTheme(theme, appTheme) })
    }, [appTheme])

    // Setting codeEditor height to take '100%'
    useEffect(() => {
        if (codemirrorRef.current && height === '100%') {
            codemirrorRef.current.editor.parentElement.classList.add('h-100')
            codemirrorRef.current.editor.classList.add('h-100')
        }

        return () => {
            codemirrorRef.current.editor.parentElement.classList.remove('h-100')
            codemirrorRef.current.editor.classList.remove('h-100')
        }
    }, [height])

    // Toggle `state.diffMode` based on `diffView`
    useEffect(() => {
        dispatch({ type: 'setDiff', value: diffView })
    }, [diffView])

    const setCode = (newValue: string) => {
        dispatch({ type: 'setCode', value: newValue })
        // dispatch({ type: 'setDefaultCode', value: originalValue })
        onChange?.(newValue)
    }

    useEffectAfterMount(() => {
        if (noParsing) {
            setCode(value)
            return
        }

        if (value === state.code) {
            return
        }

        setCode(parseValueToCode(value, mode, tabSize))
    }, [value, defaultValue, noParsing])

    // CODEMIRROR PROPS
    const basicSetupOptions: BasicSetupOptions = {
        searchKeymap: !disableSearch,
    }

    const handleOnChange: ReactCodeMirrorProps['onChange'] = (newValue) => {
        setCode(newValue)
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

    return (
        <CodeEditorContext.Provider value={contextValue}>
            {children}
            {loading ? (
                <CodeEditorPlaceholder customLoader={customLoader} />
            ) : (
                <div>
                    {shebang && <div className="code-editor__shebang">{shebang}</div>}
                    {state.diffMode ? (
                        <div>DiffEditor Here</div>
                    ) : (
                        <CodeMirror
                            ref={codemirrorRef}
                            basicSetup={false}
                            value={value}
                            height={typeof height === 'number' ? `${height}px` : height}
                            readOnly={readOnly}
                            autoFocus={autoFocus}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleOnChange}
                            extensions={[
                                basicSetup(basicSetupOptions),
                                getLanguageExtension(),
                                lintGutter(),
                                getValidationSchema(),
                            ]}
                        />
                    )}
                </div>
            )}
        </CodeEditorContext.Provider>
    )
}

CodeEditor.ValidationError = ValidationError
CodeEditor.Clipboard = Clipboard
CodeEditor.Header = Header
CodeEditor.Warning = Warning
CodeEditor.ErrorBar = ErrorBar
CodeEditor.Information = Information
