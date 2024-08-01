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

import React, { useEffect, useReducer, useRef } from 'react'
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor'
import YAML from 'yaml'
import ReactGA from 'react-ga4'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { configureMonacoYaml } from 'monaco-yaml'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { ReactComponent as Info } from '../../Assets/Icon/ic-info-filled.svg'
import { ReactComponent as ErrorIcon } from '../../Assets/Icon/ic-error-exclamation.svg'
import { ReactComponent as WarningIcon } from '../../Assets/Icon/ic-warning.svg'
import './codeEditor.scss'
import 'monaco-editor'

import YamlWorker from '../../yaml.worker.js?worker'
import { YAMLStringify, cleanKubeManifest, useJsonYaml } from '../Helper'
import { useWindowSize } from '../Hooks'
import Select from '../Select/Select'
import RadioGroup from '../RadioGroup/RadioGroup'
import ClipboardButton from '../ClipboardButton/ClipboardButton'
import { Progressing } from '../Progressing'
import {
    CodeEditorComposition,
    CodeEditorHeaderComposition,
    CodeEditorHeaderInterface,
    CodeEditorInterface,
    CodeEditorThemesKeys,
    InformationBarProps,
} from './types'
import { CodeEditorReducer, initialState } from './CodeEditor.reducer'
import { MODES } from '../Constants'

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === MODES.YAML) {
            return new YamlWorker()
        }
        return new editorWorker()
    },
}

const CodeEditorContext = React.createContext(null)

function useCodeEditorContext() {
    const context = React.useContext(CodeEditorContext)
    if (!context) {
        throw new Error(`cannot be rendered outside the component`)
    }
    return context
}

/**
 * NOTE: once monaco editor mounts it doesn't update it's internal onChange state.
 * Since most of the time onChange methods are declared inside the render body of a component
 * we should use the latest references of onChange.
 * Please see: https://github.com/react-monaco-editor/react-monaco-editor/issues/704
 * Thus as a hack we are using this objects reference to call the latest onChange reference
 */
const _onChange = {
    onChange: null
}

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
        theme = '',
        loading,
        customLoader,
        focus,
        validatorSchema,
        chartVersion,
        isKubernetes = true,
        cleanData = false,
        onBlur,
        onFocus,
    }) => {
        if (cleanData) {
            value = cleanKubeManifest(value)
            defaultValue = cleanKubeManifest(defaultValue)
        }

        const editorRef = useRef(null)
        const monacoRef = useRef(null)
        const { width, height: windowHeight } = useWindowSize()
        const memoisedReducer = React.useCallback(CodeEditorReducer, [])
        const [state, dispatch] = useReducer(memoisedReducer, initialState({ mode, theme, value, diffView, noParsing }))
        const [, json, yamlCode, error] = useJsonYaml(state.code, tabSize, state.mode, !state.noParsing)
        const [, originalJson, originlaYaml] = useJsonYaml(defaultValue, tabSize, state.mode, !state.noParsing)
        monaco.editor.defineTheme(CodeEditorThemesKeys.vsDarkDT, {
            base: 'vs-dark',
            inherit: true,
            rules: [
                // @ts-ignore
                { background: '#0B0F22' },
            ],
            colors: {
                'editor.background': '#0B0F22',
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

        monaco.editor.defineTheme(CodeEditorThemesKeys.deleteDraft, {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'diffEditor.insertedTextBackground': '#ffd4d1',
                'diffEditor.removedTextBackground': '#ffffff33',
            },
        })

        monaco.editor.defineTheme(CodeEditorThemesKeys.unpublished, {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'diffEditor.insertedTextBackground': '#eaf1dd',
                'diffEditor.removedTextBackground': '#ffffff33',
            },
        })

        function editorDidMount(editor, monaco) {
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

            editorRef.current = editor
            monacoRef.current = monaco
        }

        useEffect(() => {
            if (!validatorSchema) {
                return
            }
            const config = configureMonacoYaml(monaco, {
                enableSchemaRequest: true,
                isKubernetes,
                schemas: [
                    {
                        uri: `https://github.com/devtron-labs/devtron/tree/main/scripts/devtron-reference-helm-charts/reference-chart_${chartVersion}/schema.json`, // id of the first schema
                        fileMatch: ['*'], // associate with our model
                        schema: validatorSchema,
                    },
                ],
            })
            return () => {
                config.dispose()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [validatorSchema, chartVersion])
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

        /**
         * NOTE: Please see @_onChange variable
         */
        _onChange.onChange = onChange

        const setCode = (value: string) => {
            dispatch({ type: 'setCode', value })
            _onChange.onChange?.(value)
        }

        useEffect(() => {
            if (noParsing) {
                setCode(value)

                return
            }
            let obj
            if (value === state.code) {
                return
            }
            try {
                obj = JSON.parse(value)
            } catch (err) {
                try {
                    obj = YAML.parse(value)
                } catch (err) {}
            }
            let final = value
            if (obj) {
                final = state.mode === 'json' ? JSON.stringify(obj, null, tabSize) : YAMLStringify(obj)
            }
            setCode(final)
        }, [value, noParsing])

        useEffect(() => {
            dispatch({ type: 'setDiff', value: diffView })
        }, [diffView])

        useEffect(() => {
            if (focus) {
                editorRef.current.focus()
            }
        }, [focus])

        function handleOnChange(newValue, e) {
            setCode(newValue)
        }

        function handleLanguageChange(mode: 'json' | 'yaml') {
            dispatch({ type: 'changeLanguage', value: mode })
            setCode(mode === 'json' ? json : yamlCode)
        }

        const options: monaco.editor.IEditorConstructionOptions = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly,
            lineDecorationsWidth,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: {
                enabled: false,
            },
            scrollbar: {
                alwaysConsumeMouseWheel: false,
                vertical: inline ? 'hidden' : 'auto',
            },
            lineNumbers(lineNumber) {
                return `<span style="padding-right:6px">${lineNumber}</span>`
            },
        }

        const diffViewOptions: monaco.editor.IDiffEditorConstructionOptions = {
            ...options,
            useInlineViewWhenSpaceIsLimited: false,
        }

        return (
            <CodeEditorContext.Provider value={{ dispatch, state, handleLanguageChange, error, defaultValue, height }}>
                {children}
                {loading ? (
                    <CodeEditorPlaceholder customLoader={customLoader} />
                ) : (
                    <>
                        {shebang && <div className="shebang">{shebang}</div>}
                        {state.diffMode ? (
                            <MonacoDiffEditor
                                original={
                                    noParsing ? defaultValue : state.mode === 'json' ? originalJson : originlaYaml
                                }
                                value={state.code}
                                language={state.mode}
                                onChange={handleOnChange}
                                options={diffViewOptions}
                                theme={state.theme.toLowerCase().split(' ').join('-')}
                                editorDidMount={editorDidMount}
                                height={height}
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
                                height={height}
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
    const { defaultValue } = useCodeEditorContext()
    return (
        <div className={className || 'code-editor__header flex right'}>
            {children}
            {!hideDefaultSplitHeader && defaultValue && <SplitPane />}
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
        <WarningIcon className="code-editor__information-info-icon" />
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
    return <ClipboardButton content={state.code} rootClassName="bcn-1" iconSize={20} />
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
            <div className="diff-icon" />
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

CodeEditor.LanguageChanger = LanguageChanger
CodeEditor.ThemeChanger = ThemeChanger
CodeEditor.ValidationError = ValidationError
CodeEditor.Clipboard = Clipboard
CodeEditor.Header = Header
CodeEditor.Warning = Warning
CodeEditor.ErrorBar = ErrorBar
CodeEditor.Information = Information

export default CodeEditor
