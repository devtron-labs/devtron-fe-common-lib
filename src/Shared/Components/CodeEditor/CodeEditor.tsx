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
import { autocompletion } from '@codemirror/autocomplete'
import { foldGutter } from '@codemirror/language'
import { lintGutter } from '@codemirror/lint'
import { search } from '@codemirror/search'
import { indentationMarkers } from '@replit/codemirror-indentation-markers'
import { vscodeKeymap } from '@replit/codemirror-vscode-keymap'
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link'
import {
    basicSetup,
    BasicSetupOptions,
    Compartment,
    EditorState,
    EditorView,
    Extension,
    keymap,
    ReactCodeMirrorProps,
} from '@uiw/react-codemirror'

import { DEFAULT_JSON_SCHEMA_URI, MODES } from '@Common/Constants'
import { cleanKubeManifest, noop } from '@Common/Helper'
import { getUniqueId } from '@Shared/Helpers'
import { AppThemeType, useTheme } from '@Shared/Providers'

import { Clipboard, Container, ErrorBar, Header, Information, Warning } from './CodeEditor.components'
import { CodeEditorContext } from './CodeEditor.context'
import { getCodeEditorTheme } from './CodeEditor.theme'
import { CodeEditorRenderer } from './CodeEditorRenderer'
import {
    blurOnEscape,
    openSearchPanel,
    openSearchPanelWithReplace,
    replaceAll,
    showReplaceFieldState,
} from './Commands'
import { getCodeEditorFindReplace, readOnlyTooltip, yamlHighlight } from './Extensions'
import { CodeEditorContextProps, CodeEditorProps } from './types'
import { getFoldGutterElement, getLanguageExtension, getValidationSchema, parseValueToCode } from './utils'

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
    onSearchPanelOpen = noop,
    onSearchBarAction = noop,
    collapseUnchangedDiffView = false,
    ...resProps
}: CodeEditorProps<DiffView>) => {
    // DERIVED PROPS
    const disableSearch = (collapseUnchangedDiffView || resProps.disableSearch) ?? false
    const readOnly = (collapseUnchangedDiffView || resProps.readOnly) ?? false

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
        drawSelection: true,
        highlightActiveLineGutter: true,
        tabSize,
        autocompletion: false,
    }

    const handleOnChange: ReactCodeMirrorProps['onChange'] = (newValue) => {
        setCode(newValue)
    }

    const handleLhsOnChange: ReactCodeMirrorProps['onChange'] = (newLhsValue) => {
        setLhsCode(newLhsValue)
    }

    const openSearchPanelWrapper: typeof openSearchPanel = (view) => {
        onSearchPanelOpen()
        return openSearchPanel(view)
    }

    const openSearchPanelWithReplaceWrapper: typeof openSearchPanelWithReplace = (view) => {
        onSearchPanelOpen()
        return openSearchPanelWithReplace(view)
    }

    // EXTENSIONS
    const getBaseExtensions = (): Extension[] => [
        basicSetup(basicSetupOptions),
        autocompletion({ closeOnBlur: false }),
        themeExtension,
        keymap.of([
            ...vscodeKeymap.filter(({ key }) => key !== 'Mod-Alt-Enter' && key !== 'Mod-Enter' && key !== 'Mod-f'),
            ...(!disableSearch ? [{ key: 'Mod-f', run: openSearchPanelWrapper, scope: 'editor search-panel' }] : []),
            { key: 'Mod-Enter', run: replaceAll, scope: 'editor search-panel' },
            { key: 'Mod-Alt-f', run: openSearchPanelWithReplaceWrapper, scope: 'editor search-panel' },
            { key: 'Escape', run: blurOnEscape, stopPropagation: true },
        ]),
        indentationMarkers(),
        getLanguageExtension(mode, collapseUnchangedDiffView),
        foldingCompartment.of(foldConfig),
        lintGutter(),
        search({
            createPanel: getCodeEditorFindReplace(onSearchBarAction),
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
            drawSelection: false,
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
                collapseUnchanged={collapseUnchangedDiffView}
                disableMinimap={collapseUnchangedDiffView}
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
