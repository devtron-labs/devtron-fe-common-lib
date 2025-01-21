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

import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import CodeMirror, {
    Extension,
    hoverTooltip,
    ReactCodeMirrorProps,
    basicSetup,
    BasicSetupOptions,
    Compartment,
} from '@uiw/react-codemirror'
import CodeMirrorMerge from 'react-codemirror-merge'
// eslint-disable-next-line import/no-extraneous-dependencies
import { StreamLanguage, foldGutter } from '@codemirror/language'
// eslint-disable-next-line import/no-extraneous-dependencies
import { search } from '@codemirror/search'
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
import { yamlSchemaHover, yamlCompletion, yamlSchemaLinter } from 'codemirror-json-schema/yaml'

import { useTheme } from '@Shared/Providers'
import { getUniqueId } from '@Shared/Helpers'
import { cleanKubeManifest, useEffectAfterMount } from '@Common/Helper'
import { DEFAULT_JSON_SCHEMA_URI, MODES } from '@Common/Constants'
import { Progressing } from '@Common/Progressing'

import { codeEditorFindReplace, readOnlyTooltip, yamlParseErrorLint } from './Extensions'
import { CodeEditorContextProps, CodeEditorProps } from './types'
import { CodeEditorReducer, initialState, parseValueToCode } from './CodeEditor.reducer'
import { getCodeEditorHeight, getFoldGutterElement, getHoverElement } from './utils'
import { CodeEditorContext } from './CodeEditor.context'
import { Clipboard, Container, ErrorBar, Header, Information, Warning } from './CodeEditor.components'
import { codeEditorTheme } from './CodeEditor.theme'

import './codeEditor.scss'

const CodeEditor = <DiffView extends boolean = false>({
    value: propValue,
    originalValue,
    modifiedValue,
    isOriginalModifiable = false,
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
    loading,
    customLoader,
    validatorSchema = {},
    schemaURI = DEFAULT_JSON_SCHEMA_URI,
    cleanData = false,
    onBlur,
    onFocus,
    autoFocus,
    disableSearch = false,
}: CodeEditorProps<DiffView>) => {
    // HOOKS
    const { appTheme } = useTheme()

    // REFS
    const codeMirrorParentDivRef = useRef<HTMLDivElement>()

    // Cleaning KubeManifest
    const _value = diffView ? modifiedValue : propValue
    const value = cleanData ? cleanKubeManifest(_value) : _value
    const lhsValue = cleanData ? cleanKubeManifest(originalValue) : originalValue

    // STATES
    const [codemirrorMergeKey, setCodemirrorMergeKey] = useState<string>()
    const [hasCodeEditorContainer, setHasCodeEditorContainer] = useState(false)

    // REDUCER
    const [state, dispatch] = useReducer(
        CodeEditorReducer,
        initialState({
            mode,
            value,
            lhsValue,
            noParsing,
            tabSize,
            diffView,
        }),
    )

    // CONTEXT VALUE
    const contextValue = useMemo<CodeEditorContextProps>(
        () => ({ dispatch, state, height, hasCodeEditorContainer }),
        [state, hasCodeEditorContainer],
    )

    // USE-EFFECTS
    useEffect(() => {
        // Toggle `state.diffMode` based on `diffView`
        dispatch({ type: 'setDiff', value: diffView })
    }, [diffView])

    // Re-mounting codemirror-merge is necessary because its extensions don't automatically update after being changed.
    // Bug reference: https://github.com/uiwjs/react-codemirror/issues/681#issuecomment-2341521112
    useEffect(
        () => {
            setCodemirrorMergeKey(getUniqueId())
        },
        // Include any props that modify codemirror-merge extensions directly, as a workaround for the unresolved bug.
        [readOnly, tabSize, disableSearch],
    )

    useEffect(() => {
        if (codeMirrorParentDivRef.current) {
            setHasCodeEditorContainer(
                codeMirrorParentDivRef.current.parentElement.classList.contains('code-editor__container'),
            )
        }
    }, [])

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
    const foldingCompartment = new Compartment()

    const basicSetupOptions: BasicSetupOptions = {
        searchKeymap: !disableSearch,
        foldGutter: false,
        drawSelection: false,
        tabSize,
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
                return []
        }
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
                    hoverTooltip(
                        jsonSchemaHover({
                            formatHover: getHoverElement(schemaURI),
                        }),
                    ),
                    stateExtensions(validatorSchema),
                ]
            case MODES.YAML:
                return [
                    yamlParseErrorLint(),
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

    // EXTENSIONS
    const foldConfig = foldGutter({
        markerDOM: getFoldGutterElement,
    })

    const baseExtensions: Extension[] = [
        basicSetup(basicSetupOptions),
        getLanguageExtension(),
        foldingCompartment.of(foldConfig),
        search({
            createPanel: codeEditorFindReplace,
        }),
    ]

    const extensions: Extension[] = [
        ...baseExtensions,
        ...(!state.diffMode ? [lintGutter(), ...getValidationSchema()] : []),
        readOnlyTooltip,
    ]

    const originalViewExtensions: Extension[] = [...baseExtensions, readOnlyTooltip]

    const modifiedViewExtensions: Extension[] = [...baseExtensions, readOnlyTooltip]

    const renderCodeEditor = () => {
        if (loading) {
            return (
                customLoader || (
                    <div
                        className="flex mh-250"
                        style={{ height: typeof height === 'number' ? `${height}px` : height }}
                    >
                        <Progressing pageLoader />
                    </div>
                )
            )
        }

        const { codeEditorClassName, codeEditorHeight, codeEditorParentClassName } = getCodeEditorHeight(height)

        return state.diffMode ? (
            <CodeMirrorMerge
                theme={codeEditorTheme(appTheme)}
                key={codemirrorMergeKey}
                className={`w-100 vertical-divider ${codeEditorParentClassName}`}
                gutter
                destroyRerender={false}
            >
                <CodeMirrorMerge.Original
                    basicSetup={false}
                    value={state.lhsCode}
                    readOnly={readOnly || !isOriginalModifiable}
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
            <div ref={codeMirrorParentDivRef} className={`w-100 ${codeEditorParentClassName}`}>
                {shebang && <div className="code-editor__shebang">{shebang}</div>}
                <CodeMirror
                    theme={codeEditorTheme(appTheme)}
                    className={codeEditorClassName}
                    basicSetup={false}
                    value={state.code}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    height={codeEditorHeight}
                    minHeight="250px"
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

CodeEditor.Clipboard = Clipboard
CodeEditor.Header = Header
CodeEditor.Warning = Warning
CodeEditor.ErrorBar = ErrorBar
CodeEditor.Information = Information
CodeEditor.Container = Container

export default CodeEditor
