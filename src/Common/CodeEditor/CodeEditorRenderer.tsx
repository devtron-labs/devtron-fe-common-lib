import CodeMirrorMerge from 'react-codemirror-merge'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'

import { Progressing } from '@Common/Progressing'

import { useEffect, useRef } from 'react'
import { CodeEditorRendererProps } from './types'
import { getCodeEditorHeight } from './utils'

export const CodeEditorRenderer = ({
    loading,
    customLoader,
    height,
    state,
    codeEditorTheme,
    codemirrorMergeKey,
    isDarkTheme,
    readOnly,
    isOriginalModifiable,
    handleLhsOnChange,
    originalViewExtensions,
    handleOnChange,
    modifiedViewExtensions,
    codeMirrorParentDivRef,
    shebang,
    placeholder,
    onFocus,
    onBlur,
    extensions,
    autoFocus,
}: CodeEditorRendererProps) => {
    // REFS
    const codeMirrorRef = useRef<ReactCodeMirrorRef>()

    useEffect(() => {
        // Added timeout to ensure the autofocus code is executed post the re-renders
        setTimeout(() => {
            if (autoFocus && codeMirrorRef.current?.view) {
                codeMirrorRef.current.view.focus()
            }
        }, 100)
    }, [autoFocus])

    const { codeEditorClassName, codeEditorHeight, codeEditorParentClassName } = getCodeEditorHeight(height)

    if (loading) {
        return (
            customLoader || (
                <div className="flex mh-250" style={{ height: codeEditorHeight }}>
                    <Progressing pageLoader />
                </div>
            )
        )
    }

    return state.diffMode ? (
        <CodeMirrorMerge
            theme={codeEditorTheme}
            key={codemirrorMergeKey}
            className={`w-100 vertical-divider ${isDarkTheme ? 'cm-merge-theme__dark' : 'cm-merge-theme__light'} ${codeEditorParentClassName}`}
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
            {shebang && (
                <div className="code-editor__shebang flexbox text__white">
                    <div className="code-editor__shebang__gutter dc__align-self-stretch" />
                    {shebang}
                </div>
            )}
            <CodeMirror
                ref={codeMirrorRef}
                theme={codeEditorTheme}
                className={`${isDarkTheme ? 'cm-theme__dark' : 'cm-theme__light'} ${codeEditorClassName}`}
                basicSetup={false}
                value={state.code}
                placeholder={placeholder}
                readOnly={readOnly}
                height={codeEditorHeight}
                minHeight="250px"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleOnChange}
                extensions={extensions}
            />
        </div>
    )
}
