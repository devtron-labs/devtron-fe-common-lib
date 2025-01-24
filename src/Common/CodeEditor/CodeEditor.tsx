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
import {
    Extension,
    ReactCodeMirrorProps,
    basicSetup,
    BasicSetupOptions,
    Compartment,
    keymap,
} from '@uiw/react-codemirror'
import { foldGutter } from '@codemirror/language'
import { search } from '@codemirror/search'
import { lintGutter } from '@codemirror/lint'
import { vscodeKeymap } from '@replit/codemirror-vscode-keymap'

import { AppThemeType, useTheme } from '@Shared/Providers'
import { getUniqueId } from '@Shared/Helpers'
import { cleanKubeManifest, useEffectAfterMount } from '@Common/Helper'
import { DEFAULT_JSON_SCHEMA_URI, MODES } from '@Common/Constants'

import { codeEditorFindReplace, readOnlyTooltip } from './Extensions'
import { CodeEditorContextProps, CodeEditorProps } from './types'
import { CodeEditorReducer, initialState, parseValueToCode } from './CodeEditor.reducer'
import { getFoldGutterElement, getLanguageExtension, getValidationSchema } from './utils'
import { CodeEditorContext } from './CodeEditor.context'
import { Clipboard, Container, ErrorBar, Header, Information, Warning } from './CodeEditor.components'
import { getCodeEditorTheme } from './CodeEditor.theme'
import { CodeEditorRenderer } from './CodeEditorRenderer'

import './codeEditor.scss'

const CodeEditor = <DiffView extends boolean = false>({
    theme,
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

    // MEMOISED VALUES
    // Cleaning KubeManifest
    const value = useMemo(() => {
        const _value = diffView ? modifiedValue : propValue
        return cleanData ? cleanKubeManifest(_value) : _value
    }, [propValue, modifiedValue, diffView])
    const lhsValue = useMemo(() => (cleanData ? cleanKubeManifest(originalValue) : originalValue), [originalValue])

    // REFS
    const codeMirrorParentDivRef = useRef<HTMLDivElement>()

    // CONSTANTS
    const isDarkTheme = (theme ?? appTheme) === AppThemeType.dark
    const codeEditorTheme = getCodeEditorTheme(isDarkTheme)

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
        if (codeMirrorParentDivRef.current) {
            setHasCodeEditorContainer(
                !!codeMirrorParentDivRef.current.parentElement.getAttribute('data-code-editor-container'),
            )
        }
    }, [])

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
        [readOnly, tabSize, disableSearch, appTheme, mode],
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
    const foldingCompartment = new Compartment()

    const basicSetupOptions: BasicSetupOptions = {
        defaultKeymap: false,
        searchKeymap: false,
        foldGutter: false,
        // TODO: need to remove this after getting proper colors from design
        drawSelection: false,
        highlightActiveLineGutter: false,
        tabSize,
    }

    const handleOnChange: ReactCodeMirrorProps['onChange'] = (newValue) => {
        setCode(newValue)
    }

    const handleLhsOnChange: ReactCodeMirrorProps['onChange'] = (newLhsValue) => {
        setLhsCode(newLhsValue)
    }

    // EXTENSIONS
    const foldConfig = foldGutter({
        markerDOM: getFoldGutterElement,
    })

    const baseExtensions: Extension[] = [
        basicSetup(basicSetupOptions),
        keymap.of(vscodeKeymap.filter(({ key }) => !disableSearch || key !== 'Mod-f')),
        getLanguageExtension(mode),
        foldingCompartment.of(foldConfig),
        lintGutter(),
        search({
            createPanel: codeEditorFindReplace,
        }),
    ]

    const extensions: Extension[] = [
        ...baseExtensions,
        ...(!state.diffMode ? getValidationSchema({ mode, schemaURI, validatorSchema }) : []),
        readOnlyTooltip,
    ]

    const originalViewExtensions: Extension[] = [...baseExtensions, readOnlyTooltip]

    const modifiedViewExtensions: Extension[] = [...baseExtensions, readOnlyTooltip]

    return (
        <CodeEditorContext.Provider value={contextValue}>
            {children}
            <CodeEditorRenderer
                codemirrorMergeKey={codemirrorMergeKey}
                codeMirrorParentDivRef={codeMirrorParentDivRef}
                codeEditorTheme={codeEditorTheme}
                isDarkTheme={isDarkTheme}
                state={state}
                loading={loading}
                customLoader={customLoader}
                height={height}
                shebang={shebang}
                readOnly={readOnly}
                placeholder={placeholder}
                handleOnChange={handleOnChange}
                handleLhsOnChange={handleLhsOnChange}
                isOriginalModifiable={isOriginalModifiable}
                onBlur={onBlur}
                onFocus={onFocus}
                autoFocus={autoFocus}
                originalViewExtensions={originalViewExtensions}
                modifiedViewExtensions={modifiedViewExtensions}
                extensions={extensions}
            />
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
