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

import { useEffect, useMemo, useRef, useState } from 'react'
import {
    Extension,
    ReactCodeMirrorProps,
    basicSetup,
    BasicSetupOptions,
    Compartment,
    keymap,
    EditorView,
    EditorState,
} from '@uiw/react-codemirror'
import { foldGutter } from '@codemirror/language'
import { search } from '@codemirror/search'
import { lintGutter } from '@codemirror/lint'
import { vscodeKeymap } from '@replit/codemirror-vscode-keymap'
import { indentationMarkers } from '@replit/codemirror-indentation-markers'
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link'

import { AppThemeType, useTheme } from '@Shared/Providers'
import { getUniqueId } from '@Shared/Helpers'
import { cleanKubeManifest } from '@Common/Helper'
import { DEFAULT_JSON_SCHEMA_URI, MODES } from '@Common/Constants'

import { codeEditorFindReplace, readOnlyTooltip, yamlHighlight } from './Extensions'
import {
    blurOnEscape,
    openSearchPanel,
    openSearchPanelWithReplace,
    replaceAll,
    showReplaceFieldState,
} from './Commands'
import { CodeEditorContextProps, CodeEditorProps } from './types'
import { getFoldGutterElement, getLanguageExtension, getValidationSchema, parseValueToCode } from './utils'
import { CodeEditorContext } from './CodeEditor.context'
import { Clipboard, Container, ErrorBar, Header, Information, Warning } from './CodeEditor.components'
import { getCodeEditorTheme } from './CodeEditor.theme'
import { CodeEditorRenderer } from './CodeEditorRenderer'

import './codeEditor.scss'

// CODEMIRROR CLASSES
const foldingCompartment = new Compartment()

// EXTENSIONS
const foldConfig = foldGutter({
    markerDOM: getFoldGutterElement,
})

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

    // REFS
    const codeMirrorParentDivRef = useRef<HTMLDivElement>()
    const codeEditorValues = useRef({ code: '', lhsCode: '' })

    // MEMOISED VALUES
    // Cleaning KubeManifest
    const value = useMemo(() => {
        const _value = diffView ? modifiedValue : propValue
        const updatedValue = cleanData ? cleanKubeManifest(_value) : _value

        if (updatedValue !== codeEditorValues.current.code) {
            return ![MODES.JSON, MODES.YAML].includes(mode) || noParsing
                ? updatedValue
                : parseValueToCode(updatedValue, mode, tabSize)
        }

        return codeEditorValues.current.code
    }, [propValue, modifiedValue, diffView, noParsing])

    const lhsValue = useMemo(() => {
        const updatedValue = cleanData ? cleanKubeManifest(originalValue) : originalValue

        if (updatedValue !== codeEditorValues.current.lhsCode) {
            return ![MODES.JSON, MODES.YAML].includes(mode) || noParsing
                ? updatedValue
                : parseValueToCode(updatedValue, mode, tabSize)
        }

        return codeEditorValues.current.lhsCode
    }, [originalValue, noParsing])

    // CONSTANTS
    const componentTheme = theme ?? appTheme
    const isDarkTheme = componentTheme === AppThemeType.dark
    const { codeEditorTheme, themeExtension } = getCodeEditorTheme(isDarkTheme)

    // STATES
    const [codemirrorMergeKey, setCodemirrorMergeKey] = useState<string>()
    const [hasCodeEditorContainer, setHasCodeEditorContainer] = useState(false)
    const [diffMode, setDiffMode] = useState(diffView)

    // CONTEXT VALUE
    const contextValue = useMemo<CodeEditorContextProps>(
        () => ({ setDiffMode, diffMode, hasCodeEditorContainer, lhsValue, value, readOnly, theme: componentTheme }),
        [diffMode, hasCodeEditorContainer, lhsValue, value, readOnly, componentTheme],
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
        // Toggle `diffMode` based on `diffView`
        setDiffMode(diffView)
    }, [diffView])

    // Re-mounting codemirror-merge is necessary because its extensions don't automatically update after being changed.
    // Bug reference: https://github.com/uiwjs/react-codemirror/issues/681#issuecomment-2341521112
    useEffect(
        () => {
            setCodemirrorMergeKey(getUniqueId())
        },
        // Include any props that modify codemirror-merge extensions directly, as a workaround for the unresolved bug.
        [readOnly, tabSize, disableSearch, appTheme, mode, isOriginalModifiable],
    )

    // METHODS
    const setCode = (codeValue: string) => {
        codeEditorValues.current.code = codeValue
        if (diffMode) {
            onModifiedValueChange?.(codeValue)
        } else {
            onChange?.(codeValue)
        }
    }

    const setLhsCode = (codeValue: string) => {
        codeEditorValues.current.lhsCode = codeValue
        onOriginalValueChange?.(codeValue)
    }

    // CODEMIRROR PROPS
    const basicSetupOptions: BasicSetupOptions = {
        defaultKeymap: false,
        searchKeymap: false,
        foldGutter: false,
        drawSelection: false,
        highlightActiveLineGutter: true,
        tabSize,
    }

    const handleOnChange: ReactCodeMirrorProps['onChange'] = (newValue) => {
        setCode(newValue)
    }

    const handleLhsOnChange: ReactCodeMirrorProps['onChange'] = (newLhsValue) => {
        setLhsCode(newLhsValue)
    }

    // EXTENSIONS
    const getBaseExtensions = (): Extension[] => [
        basicSetup(basicSetupOptions),
        themeExtension,
        keymap.of([
            ...vscodeKeymap.filter(({ key }) => key !== 'Mod-Alt-Enter' && key !== 'Mod-Enter' && key !== 'Mod-f'),
            ...(!disableSearch ? [{ key: 'Mod-f', run: openSearchPanel, scope: 'editor search-panel' }] : []),
            { key: 'Mod-Enter', run: replaceAll, scope: 'editor search-panel' },
            { key: 'Mod-Alt-f', run: openSearchPanelWithReplace, scope: 'editor search-panel' },
            { key: 'Escape', run: blurOnEscape, stopPropagation: true },
        ]),
        indentationMarkers(),
        getLanguageExtension(mode),
        foldingCompartment.of(foldConfig),
        lintGutter(),
        search({
            createPanel: codeEditorFindReplace,
        }),
        showReplaceFieldState,
        ...(mode === MODES.YAML ? [yamlHighlight] : []),
        hyperLink,
    ]

    const extensions: Extension[] = [
        ...getBaseExtensions(),
        ...(!diffMode ? getValidationSchema({ mode, schemaURI, validatorSchema }) : []),
        readOnlyTooltip,
    ]

    const originalViewExtensions: Extension[] = [
        codeEditorTheme,
        ...getBaseExtensions(),
        readOnlyTooltip,
        EditorState.readOnly.of(readOnly || !isOriginalModifiable),
    ]

    const modifiedViewExtensions: Extension[] = [
        codeEditorTheme,
        ...getBaseExtensions(),
        readOnlyTooltip,
        EditorState.readOnly.of(readOnly),
    ]

    const diffMinimapExtensions: Extension[] = [
        codeEditorTheme,
        basicSetup({
            ...basicSetupOptions,
            lineNumbers: false,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            syntaxHighlighting: false,
        }),
        getLanguageExtension(mode, true),
        EditorView.editable.of(false),
        EditorState.readOnly.of(true),
    ]

    return (
        <CodeEditorContext.Provider value={contextValue}>
            {children}
            <CodeEditorRenderer
                codemirrorMergeKey={codemirrorMergeKey}
                codeMirrorParentDivRef={codeMirrorParentDivRef}
                codeEditorTheme={codeEditorTheme}
                theme={componentTheme}
                loading={loading}
                customLoader={customLoader}
                height={height}
                shebang={shebang}
                readOnly={readOnly}
                placeholder={placeholder}
                handleOnChange={handleOnChange}
                handleLhsOnChange={handleLhsOnChange}
                onBlur={onBlur}
                onFocus={onFocus}
                autoFocus={autoFocus}
                originalViewExtensions={originalViewExtensions}
                modifiedViewExtensions={modifiedViewExtensions}
                extensions={extensions}
                diffMinimapExtensions={diffMinimapExtensions}
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
