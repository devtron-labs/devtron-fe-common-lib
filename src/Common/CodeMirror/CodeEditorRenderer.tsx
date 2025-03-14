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

import { useEffect, useRef, useState } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import CodeMirrorMerge, { CodeMirrorMergeRef } from 'react-codemirror-merge'

import { getComponentSpecificThemeClass } from '@Shared/Providers'
import { getUniqueId } from '@Shared/Helpers'
import { Progressing } from '@Common/Progressing'

import { useCodeEditorContext } from './CodeEditor.context'
import { CodeEditorRendererProps } from './types'
import { getCodeEditorHeight, getRevertControlButton } from './utils'
import { DiffMinimap } from './Extensions'

export const CodeEditorRenderer = ({
    codemirrorMergeKey,
    theme,
    loading,
    customLoader,
    height,
    codeEditorTheme,
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
    diffMinimapExtensions,
}: CodeEditorRendererProps) => {
    // CONTEXTS
    const { value, lhsValue, diffMode } = useCodeEditorContext()

    // STATES
    const [gutterWidth, setGutterWidth] = useState(0)
    const [codeEditorDiffViewKey, setCodeEditorDiffViewKey] = useState<string>('')

    // REFS
    const codeMirrorRef = useRef<ReactCodeMirrorRef>()
    const codeMirrorMergeRef = useRef<CodeMirrorMergeRef>()

    // CONSTANTS
    const componentSpecificThemeClass = getComponentSpecificThemeClass(theme)

    // This handling will be removed once shebang is shown inside the codeEditor rather than extra div
    const updateGutterWidth = () => {
        const gutters = document.querySelector('.cm-gutters')
        if (gutters) {
            setGutterWidth(gutters.getBoundingClientRect().width)
        }
    }

    useEffect(() => {
        updateGutterWidth()
    }, [lhsValue, value])

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
        let isFocused = false
        const body = document.querySelector('body')
        if (body) {
            if (codeMirrorMergeRef.current?.view) {
                const lhsEditor = codeMirrorMergeRef.current.view.a
                const rhsEditor = codeMirrorMergeRef.current.view.b

                isFocused =
                    (lhsEditor.hasFocus || rhsEditor.hasFocus) &&
                    (lhsEditor.scrollDOM.scrollWidth > lhsEditor.scrollDOM.clientWidth ||
                        rhsEditor.scrollDOM.scrollWidth > rhsEditor.scrollDOM.clientWidth)
            } else if (codeMirrorRef.current?.view) {
                const { scrollWidth, clientWidth } = codeMirrorRef.current.view.scrollDOM

                isFocused = codeMirrorRef.current.view.hasFocus && scrollWidth > clientWidth
            }

            if (isFocused) {
                body.classList.add('dc__overscroll-none')
            } else {
                body.classList.remove('dc__overscroll-none')
            }
        }
    }, [
        codeMirrorMergeRef.current?.view?.a?.hasFocus,
        codeMirrorMergeRef.current?.view?.b?.hasFocus,
        codeMirrorRef.current?.view?.hasFocus,
    ])

    // SYNCING LEFT RIGHT EDITOR HORIZONTAL SCROLLS
    const handleLHSScroll = () => {
        codeMirrorMergeRef.current.view.a.scrollDOM.scrollTo({
            left: codeMirrorMergeRef.current.view.b.scrollDOM.scrollLeft,
        })
    }

    const handleRHSScroll = () => {
        codeMirrorMergeRef.current.view.b.scrollDOM.scrollTo({
            left: codeMirrorMergeRef.current.view.a.scrollDOM.scrollLeft,
        })
    }

    useEffect(() => {
        if (!loading) {
            // This timeout is added to ensure ref of diff editor is properly initialized and \
            // key state is set to trigger re-render of diffMinimap with diff editor latest ref.
            setTimeout(() => {
                setCodeEditorDiffViewKey(getUniqueId())

                // SYNCING LEFT RIGHT EDITOR HORIZONTAL SCROLLS
                if (codeMirrorMergeRef.current?.view) {
                    codeMirrorMergeRef.current.view.a.scrollDOM.addEventListener('scroll', handleRHSScroll)
                    codeMirrorMergeRef.current.view.b.scrollDOM.addEventListener('scroll', handleLHSScroll)
                }
            }, 0)
        }

        return () => {
            setCodeEditorDiffViewKey('')

            // SYNCING LEFT RIGHT EDITOR HORIZONTAL SCROLLS
            if (codeMirrorMergeRef.current?.view) {
                codeMirrorMergeRef.current.view.b.scrollDOM.removeEventListener('scroll', handleLHSScroll)
                codeMirrorMergeRef.current.view.a.scrollDOM.removeEventListener('scroll', handleRHSScroll)
            }
        }
    }, [loading, diffMode, codemirrorMergeKey])

    const onCreateEditor = () => {
        updateGutterWidth()
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

    return diffMode ? (
        <div className={`flexbox w-100 ${componentSpecificThemeClass} ${codeEditorParentClassName}`}>
            <CodeMirrorMerge
                key={codemirrorMergeKey}
                ref={codeMirrorMergeRef}
                theme={codeEditorTheme}
                className={`flex-grow-1 h-100 dc__overflow-hidden ${readOnly ? 'code-editor__read-only' : ''}`}
                gutter
                destroyRerender={false}
                {...(!readOnly ? { revertControls: 'a-to-b', renderRevertControl: getRevertControlButton } : {})}
            >
                <CodeMirrorMerge.Original
                    basicSetup={false}
                    value={lhsValue}
                    readOnly={readOnly || !isOriginalModifiable}
                    onChange={handleLhsOnChange}
                    extensions={originalViewExtensions}
                />
                <CodeMirrorMerge.Modified
                    basicSetup={false}
                    value={value}
                    readOnly={readOnly}
                    onChange={handleOnChange}
                    extensions={modifiedViewExtensions}
                />
            </CodeMirrorMerge>
            <DiffMinimap
                key={codeEditorDiffViewKey}
                theme={theme}
                codeEditorTheme={codeEditorTheme}
                view={codeMirrorMergeRef.current?.view}
                diffMinimapExtensions={diffMinimapExtensions}
            />
        </div>
    ) : (
        <div
            ref={codeMirrorParentDivRef}
            className={`w-100 ${componentSpecificThemeClass} ${codeEditorParentClassName}`}
        >
            {shebang && (
                <p className="m-0 flexbox cn-9 code-editor__shebang">
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
                className={codeEditorClassName}
                basicSetup={false}
                value={value}
                placeholder={placeholder}
                readOnly={readOnly}
                height={codeEditorHeight}
                minHeight="250px"
                onCreateEditor={onCreateEditor}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleOnChange}
                extensions={extensions}
            />
        </div>
    )
}
