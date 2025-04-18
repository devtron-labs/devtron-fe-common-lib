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

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import MonacoEditor, { ChangeHandler, DiffEditorDidMount, EditorDidMount, MonacoDiffEditor } from 'react-monaco-editor'
import ReactGA from 'react-ga4'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { configureMonacoYaml } from 'monaco-yaml'

import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'
import { ReactComponent as ICCompare } from '@Icons/ic-compare.svg'
import { useTheme } from '@Shared/Providers'
import { ReactComponent as Info } from '../../Assets/Icon/ic-info-filled.svg'
import { ReactComponent as ErrorIcon } from '../../Assets/Icon/ic-error-exclamation.svg'
import './codeEditor.scss'
import 'monaco-editor'

import { cleanKubeManifest, useEffectAfterMount, useJsonYaml } from '../Helper'
import { useWindowSize } from '../Hooks'
import Select from '../Select/Select'
import RadioGroup from '../RadioGroup/RadioGroup'
import { ClipboardButton } from '../ClipboardButton/ClipboardButton'
import { Progressing } from '../Progressing'
import {
    CodeEditorComposition,
    CodeEditorHeaderComposition,
    CodeEditorHeaderInterface,
    CodeEditorInterface,
    CodeEditorThemesKeys,
    InformationBarProps,
} from './types'
import { CodeEditorReducer, initialState, parseValueToCode } from './CodeEditor.reducer'
import { DEFAULT_JSON_SCHEMA_URI, MODES } from '../Constants'
import { getCodeEditorThemeFromAppTheme } from './utils'

const CodeEditorContext = React.createContext(null)

function useCodeEditorContext() {
    const context = React.useContext(CodeEditorContext)
    if (!context) {
        throw new Error(`cannot be rendered outside the component`)
    }
    return context
}

const INITIAL_HEIGHT_WHEN_DYNAMIC_HEIGHT = 100

const CodeEditor: React.FC<CodeEditorInterface> & CodeEditorComposition = React.memo(
    ({
        value,
        mode = MODES.JSON,
        noParsing = false,
        defaultValue = '',
        children,
        tabSize = 2,
        lineDecorationsWidth = 0,
        height = 450,
        inline = false,
        shebang = '',
        onChange,
        readOnly,
        diffView,
        theme,
        loading,
        customLoader,
        focus,
        validatorSchema,
        schemaURI = DEFAULT_JSON_SCHEMA_URI,
        isKubernetes = true,
        cleanData = false,
        onBlur,
        onFocus,
        adjustEditorHeightToContent = false,
        disableSearch = false,
        originalEditable = false,
    }) => {
        const { appTheme } = useTheme()

        if (cleanData) {
            value = cleanKubeManifest(value)
            defaultValue = cleanKubeManifest(defaultValue)
        }

        const editorRef = useRef(null)
        const monacoRef = useRef(null)
        const { width, height: windowHeight } = useWindowSize()
        const memoisedReducer = React.useCallback(CodeEditorReducer, [])
        const [state, dispatch] = useReducer(
            memoisedReducer,
            initialState({
                mode,
                theme,
                value,
                defaultValue,
                diffView,
                noParsing,
                tabSize,
                appTheme,
            }),
        )
        const [, json, yamlCode, error] = useJsonYaml(state.code, tabSize, state.mode, !state.noParsing)
        const [, originalJson, originalYaml] = useJsonYaml(state.defaultCode, tabSize, state.mode, !state.noParsing)
        const [contentHeight, setContentHeight] = useState(
            adjustEditorHeightToContent ? INITIAL_HEIGHT_WHEN_DYNAMIC_HEIGHT : height,
        )
        // TODO: upgrade to 0.56.2 to remove this
        const onChangeRef = useRef(onChange)
        onChangeRef.current = onChange
        monaco.editor.defineTheme(CodeEditorThemesKeys.vsDarkDT, {
            base: 'vs-dark',
            inherit: true,
            rules: [
                // @ts-ignore
                { background: '#181920' },
            ],
            colors: {
                'editor.background': '#181920',
            },
        })

        monaco.editor.defineTheme(CodeEditorThemesKeys.networkStatusInterface, {
            base: 'vs-dark',
            inherit: true,
            rules: [
                // @ts-ignore
                { background: '#1A1A1A' },
            ],
            colors: {
                'editor.background': '#1A1A1A',
            },
        })

        useEffect(() => {
            dispatch({ type: 'setTheme', value: getCodeEditorThemeFromAppTheme(theme, appTheme) })
        }, [appTheme])

        useEffect(() => {
            const rule = !disableSearch
                ? null
                : monaco.editor.addKeybindingRule({
                      command: null,
                      keybinding: monaco.KeyCode.KeyF | monaco.KeyMod.CtrlCmd,
                  })
            return () => {
                rule?.dispose()
            }
        }, [disableSearch])

        const editorDidMount: EditorDidMount = (editor) => {
            if (
                mode === MODES.YAML &&
                editor &&
                typeof editor.getModel === 'function' &&
                typeof editor.getModel().updateOptions === 'function'
            ) {
                editor.getModel().updateOptions({ tabSize: 2 })
            }

            if (editor) {
                if (typeof editor.onDidFocusEditorWidget === 'function' && typeof onFocus === 'function') {
                    editor.onDidFocusEditorWidget(onFocus)
                }

                if (typeof editor.onDidBlurEditorWidget === 'function' && typeof onBlur === 'function') {
                    editor.onDidBlurEditorWidget(onBlur)
                }
            }

            if (adjustEditorHeightToContent && editor) {
                editor.onDidContentSizeChange(() => {
                    setContentHeight(editor.getContentHeight())
                })
                setContentHeight(editor.getContentHeight())
            }

            editorRef.current = editor
            monacoRef.current = monaco
        }

        const diffEditorDidMount: DiffEditorDidMount = (editor, monaco) => {
            const originalEditor = editor.getOriginalEditor()
            const modifiedEditor = editor.getModifiedEditor()

            if (adjustEditorHeightToContent) {
                originalEditor.onDidContentSizeChange(() => {
                    setContentHeight(
                        Math.max(
                            typeof contentHeight === 'number' ? contentHeight : Number.MIN_SAFE_INTEGER,
                            originalEditor.getContentHeight(),
                        ),
                    )
                })

                modifiedEditor.onDidContentSizeChange(() => {
                    setContentHeight(
                        Math.max(
                            typeof contentHeight === 'number' ? contentHeight : Number.MIN_SAFE_INTEGER,
                            modifiedEditor.getContentHeight(),
                        ),
                    )
                })

                setContentHeight(Math.max(originalEditor.getContentHeight(), modifiedEditor.getContentHeight()))
            }
            if (originalEditable) {
                originalEditor.onDidChangeModelContent(() => {
                    codeEditorOnChange(modifiedEditor.getValue(), originalEditor.getValue())
                })
            }

            editorRef.current = editor
            monacoRef.current = monaco
        }

        const editorHeight = useMemo(() => {
            if (!adjustEditorHeightToContent) {
                return height
            }
            return contentHeight
        }, [height, contentHeight, adjustEditorHeightToContent])

        useEffect(() => {
            if (!validatorSchema) {
                return
            }
            const config = configureMonacoYaml(monaco, {
                enableSchemaRequest: true,
                isKubernetes,
                schemas: [
                    {
                        uri: schemaURI,
                        fileMatch: ['*'], // associate with our model
                        schema: validatorSchema,
                    },
                ],
            })
            return () => {
                config.dispose()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [validatorSchema, schemaURI])
        useEffect(() => {
            if (!editorRef.current) {
                return
            }
            editorRef.current.updateOptions({ readOnly })
        }, [readOnly])

        useEffect(() => {
            if (!editorRef.current) {
                return
            }
            editorRef.current.layout()
        }, [width, windowHeight])

        const setCode = (value: string, originalValue: string) => {
            dispatch({ type: 'setCode', value })
            dispatch({ type: 'setDefaultCode', value: originalValue })
            onChangeRef.current?.(value, originalValue)
        }

        useEffectAfterMount(() => {
            if (noParsing) {
                setCode(value, defaultValue)

                return
            }

            if (value === state.code) {
                return
            }

            setCode(parseValueToCode(value, state.mode, tabSize), parseValueToCode(defaultValue, state.mode, tabSize))
        }, [value, defaultValue, noParsing])

        useEffect(() => {
            dispatch({ type: 'setDiff', value: diffView })
        }, [diffView])

        useEffect(() => {
            if (focus) {
                editorRef.current.focus()
            }
        }, [focus])

        const codeEditorOnChange = (newValue: string, newOriginalValue: string) => {
            setCode(newValue, newOriginalValue)
        }

        const handleOnChange: ChangeHandler = (newValue) => {
            codeEditorOnChange(newValue, editorRef.current?.getOriginalEditor?.().getValue?.() ?? '')
        }

        function handleLanguageChange(mode: 'json' | 'yaml') {
            dispatch({ type: 'changeLanguage', value: mode })
            setCode(mode === 'json' ? json : yamlCode, mode === 'json' ? originalJson : originalYaml)
        }

        const options: monaco.editor.IEditorConstructionOptions = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly,
            lineDecorationsWidth,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            ...(adjustEditorHeightToContent
                ? {
                      overviewRulerLanes: adjustEditorHeightToContent ? 0 : 1,
                  }
                : {}),
            minimap: {
                enabled: false,
            },
            scrollbar: {
                alwaysConsumeMouseWheel: false,
                vertical: inline ? 'hidden' : 'auto',
                ...(adjustEditorHeightToContent
                    ? {
                          vertical: 'hidden',
                          verticalScrollbarSize: 0,
                          verticalSliderSize: 0,
                      }
                    : {}),
            },
            lineNumbers(lineNumber) {
                return `<span style="padding-right:6px">${lineNumber}</span>`
            },
        }

        const diffViewOptions: monaco.editor.IDiffEditorConstructionOptions = {
            ...options,
            originalEditable: originalEditable && !readOnly,
            useInlineViewWhenSpaceIsLimited: false,
        }

        return (
            <CodeEditorContext.Provider
                value={{ dispatch, state, handleLanguageChange, error, defaultValue, height: editorHeight }}
            >
                {children}
                {loading ? (
                    <CodeEditorPlaceholder customLoader={customLoader} />
                ) : (
                    <>
                        {shebang && <div className="code-editor-shebang">{shebang}</div>}
                        {state.diffMode ? (
                            <MonacoDiffEditor
                                original={state.defaultCode}
                                value={state.code}
                                language={state.mode}
                                onChange={handleOnChange}
                                options={diffViewOptions}
                                theme={state.theme.toLowerCase().split(' ').join('-')}
                                editorDidMount={diffEditorDidMount}
                                height={editorHeight}
                                width="100%"
                            />
                        ) : (
                            <MonacoEditor
                                language={state.mode}
                                value={state.code}
                                theme={state.theme.toLowerCase().split(' ').join('-')}
                                options={options}
                                onChange={handleOnChange}
                                editorDidMount={editorDidMount}
                                height={editorHeight}
                                width="100%"
                            />
                        )}
                    </>
                )}
            </CodeEditorContext.Provider>
        )
    },
)

const Header: React.FC<CodeEditorHeaderInterface> & CodeEditorHeaderComposition = ({
    children,
    className,
    hideDefaultSplitHeader,
}) => {
    const { defaultValue, state } = useCodeEditorContext()
    return (
        <div className="flexbox w-100 dc__border-bottom ">
            <div
                data-code-editor-header
                className={`code-editor__header flex-grow-1 bg__secondary ${className || 'px-16 pt-6 pb-5'} ${state.diffMode ? 'dc__grid-half vertical-divider' : ''}`}

            >
                {children}
                {!hideDefaultSplitHeader && defaultValue && <SplitPane />}
            </div>
            {state.diffMode ? <div className="bg__secondary px-15 dc__align-self-stretch" /> : null}
        </div>
    )
}

const ThemeChanger = ({}) => {
    const { readOnly, state, dispatch } = useCodeEditorContext()
    function handleChangeTheme(e) {
        dispatch({ type: 'setTheme', value: e.target.value })
    }

    const themes = ['vs', 'vs-dark']
    return (
        <Select onChange={handleChangeTheme} rootClassName="select-theme" value={state.theme} disabled={readOnly}>
            <Select.Button>
                <span className="dc__ellipsis-right">{state.theme}</span>
            </Select.Button>
            <Select.Search placeholder="select theme" />
            {themes.map((theme) => (
                <Select.Option name={theme} key={theme} value={theme}>
                    <span className="dc__ellipsis-right">{theme}</span>
                </Select.Option>
            ))}
        </Select>
    )
}

const LanguageChanger = ({}) => {
    const { readOnly, handleLanguageChange, state } = useCodeEditorContext()
    if (state.noParsing) {
        return null
    }
    return (
        <div className="code-editor__toggle flex left">
            <RadioGroup
                name="selectedTab"
                disabled={readOnly}
                initialTab={state.mode}
                className="flex left"
                onChange={(event) => {
                    ReactGA.event({
                        category: 'JSON-YAML Switch',
                        action: `${event.target.value} view`,
                    })
                    handleLanguageChange(event.target.value)
                }}
            >
                <RadioGroup.Radio value="json">JSON</RadioGroup.Radio>
                <RadioGroup.Radio value="yaml">YAML</RadioGroup.Radio>
            </RadioGroup>
        </div>
    )
}

const ValidationError = () => {
    const { error } = useCodeEditorContext()
    return error ? <div className="form__error">{error}</div> : null
}

const Warning: React.FC<InformationBarProps> = (props) => (
    <div className={`code-editor__warning ${props.className || ''}`}>
        <ICWarningY5 className="code-editor__information-info-icon" />
        {props.text}
        {props.children}
    </div>
)

const ErrorBar: React.FC<InformationBarProps> = (props) => (
    <div className={`code-editor__error ${props.className || ''}`}>
        <ErrorIcon className="code-editor__information-info-icon" />
        {props.text}
        {props.children}
    </div>
)

const Information: React.FC<InformationBarProps> = (props) => (
    <div className={`code-editor__information ${props.className || ''}`}>
        <Info className="code-editor__information-info-icon" />
        {props.text}
        {props.children}
    </div>
)

const Clipboard = () => {
    const { state } = useCodeEditorContext()
    return <ClipboardButton content={state.code} iconSize={16} />
}

const SplitPane = ({}) => {
    const { state, dispatch, readOnly } = useCodeEditorContext()
    function handleToggle(e) {
        if (readOnly) {
            return
        }
        dispatch({ type: 'setDiff', value: !state.diffMode })
    }
    return (
        <div className="code-editor__split-pane flex pointer" onClick={handleToggle}>
            <ICCompare className="icon-dim-20 mr-4" />
            {state.diffMode ? 'Hide comparison' : 'Compare with default'}
        </div>
    )
}
// TODO: CodeEditor should be composed of CodeEditorPlaceholder
const CodeEditorPlaceholder = ({ className = '', style = {}, customLoader }): JSX.Element => {
    const { height } = useCodeEditorContext()

    if (customLoader) {
        return customLoader
    }

    return (
        <div className={`code-editor code-editor--placeholder disabled ${className}`} style={{ ...style }}>
            <div className="flex" style={{ height: height || '100%' }}>
                <div className="flex">
                    <Progressing pageLoader />
                </div>
            </div>
        </div>
    )
}

const Container = ({
    children,
    flexExpand,
    overflowHidden,
}: {
    children: React.ReactNode
    flexExpand?: boolean
    overflowHidden?: boolean
}) => (
    <div
        data-code-editor-container
        className={`code-editor__container w-100 dc__border br-4
        ${flexExpand ? 'flex-grow-1 flexbox-col' : ''} ${overflowHidden ? 'dc__overflow-hidden' : ''}`}
    >
        {children}
    </div>
)

CodeEditor.LanguageChanger = LanguageChanger
CodeEditor.ThemeChanger = ThemeChanger
CodeEditor.ValidationError = ValidationError
CodeEditor.Clipboard = Clipboard
CodeEditor.Header = Header
CodeEditor.Warning = Warning
CodeEditor.ErrorBar = ErrorBar
CodeEditor.Information = Information
CodeEditor.Container = Container

export default CodeEditor
