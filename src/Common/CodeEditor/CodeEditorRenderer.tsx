import CodeMirrorMerge from 'react-codemirror-merge'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'

import { Progressing } from '@Common/Progressing'

import { FocusEventHandler, useEffect, useRef, useState } from 'react'
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
    // STATES
    const [isFocused, setIsFocused] = useState(false)
    const [gutterWidth, setGutterWidth] = useState(0)

    // REFS
    const codeMirrorRef = useRef<ReactCodeMirrorRef>()

    // This handling will be removed once shebang is shown inside the codeEditor rather than extra div
    const updateGutterWith = () => {
        const gutters = document.querySelector('.cm-gutters')
        if (gutters) {
            setGutterWidth(gutters.getBoundingClientRect().width)
        }
    }

    useEffect(() => {
        // Added timeout to ensure the autofocus code is executed post the re-renders
        setTimeout(() => {
            if (autoFocus && codeMirrorRef.current?.view) {
                codeMirrorRef.current.view.focus()
            }
        }, 100)
    }, [autoFocus])

    // STOPPING OVERSCROLL BROWSER BACK/FORWARD BEHAVIOR WHEN CODE EDITOR IS FOCUSED
    useEffect(() => {
        const body = document.querySelector('body')
        if (body) {
            const { scrollWidth, clientWidth } = codeMirrorRef.current?.view?.scrollDOM ?? {}
            if (isFocused && scrollWidth > clientWidth) {
                body.classList.add('dc__overscroll-none')
            } else {
                body.classList.remove('dc__overscroll-none')
            }
        }

        updateGutterWith()
    }, [state.lhsCode, state.code, isFocused])

    const onCreateEditor = () => {
        updateGutterWith()
    }

    const handleOnFocus: FocusEventHandler<HTMLDivElement> = (e) => {
        setIsFocused(true)
        onFocus?.(e)
    }

    const handleOnBlur: FocusEventHandler<HTMLDivElement> = (e) => {
        setIsFocused(false)
        onBlur?.(e)
    }

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
                <p
                    className={`m-0 flexbox cn-9 code-editor__shebang ${isDarkTheme ? 'code-editor__shebang__dark' : 'code-editor__shebang__light'}`}
                >
                    <span
                        className="code-editor__shebang__gutter dc__align-self-stretch"
                        style={{ flex: `0 0 ${gutterWidth}px` }}
                    />
                    {shebang}
                </p>
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
                onCreateEditor={onCreateEditor}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                onChange={handleOnChange}
                extensions={extensions}
            />
        </div>
    )
}
