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
import CodeMirror, { EditorView, ReactCodeMirrorRef, ViewUpdate } from '@uiw/react-codemirror'
import { MergeView } from '@codemirror/merge'

import { getComponentSpecificThemeClass } from '@Shared/Providers'
import { Progressing } from '@Common/Progressing'

import { useCodeEditorContext } from './CodeEditor.context'
import { CodeEditorRendererProps } from './types'
import { getCodeEditorHeight, getRevertControlButton, updateDiffMinimapValues } from './utils'
import { DiffMinimap } from './Extensions'

export const CodeEditorRenderer = ({
    codemirrorMergeKey,
    theme,
    loading,
    customLoader,
    height,
    codeEditorTheme,
    readOnly,
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
    const [codeMirrorMergeInstance, setCodeMirrorMergeInstance] = useState<MergeView>(null)
    const [diffMinimapInstance, setDiffMinimapInstance] = useState<MergeView>(null)
    const [scalingFactor, setScalingFactor] = useState<number>(1)

    // REFS
    const codeMirrorRef = useRef<ReactCodeMirrorRef>()
    const codeMirrorMergeParentRef = useRef<HTMLDivElement>()
    const diffMinimapRef = useRef<MergeView>()
    const diffMinimapParentRef = useRef<HTMLDivElement>()

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
            if (codeMirrorMergeInstance) {
                const lhsEditor = codeMirrorMergeInstance.a
                const rhsEditor = codeMirrorMergeInstance.b

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
        codeMirrorMergeInstance?.a?.hasFocus,
        codeMirrorMergeInstance?.b?.hasFocus,
        codeMirrorRef.current?.view?.hasFocus,
    ])

    // SYNCING LEFT RIGHT EDITOR HORIZONTAL SCROLLS
    const handleLHSScroll = () => {
        codeMirrorMergeInstance.a.scrollDOM.scrollTo({
            left: codeMirrorMergeInstance.b.scrollDOM.scrollLeft,
        })
    }

    const handleRHSScroll = () => {
        codeMirrorMergeInstance.b.scrollDOM.scrollTo({
            left: codeMirrorMergeInstance.a.scrollDOM.scrollLeft,
        })
    }

    useEffect(() => {
        if (!loading) {
            // SYNCING LEFT RIGHT EDITOR HORIZONTAL SCROLLS
            if (codeMirrorMergeInstance) {
                codeMirrorMergeInstance.a.scrollDOM.addEventListener('scroll', handleRHSScroll)
                codeMirrorMergeInstance.b.scrollDOM.addEventListener('scroll', handleLHSScroll)
            }
        }

        return () => {
            // SYNCING LEFT RIGHT EDITOR HORIZONTAL SCROLLS
            if (codeMirrorMergeInstance) {
                codeMirrorMergeInstance.b.scrollDOM.removeEventListener('scroll', handleLHSScroll)
                codeMirrorMergeInstance.a.scrollDOM.removeEventListener('scroll', handleRHSScroll)
            }
        }
    }, [codeMirrorMergeInstance])

    const onCreateEditor = () => {
        updateGutterWidth()
    }

    // DIFF VIEW INITIALIZATIONS AND EXTENSIONS
    const originalUpdateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
        if (vu.docChanged) {
            const { doc } = vu.state
            const val = doc.toString()
            handleLhsOnChange(val, vu)
        }

        // Using `diffMinimapRef` instead of `diffMinimapInstance` since this extension captures the initial reference in a closure.
        // Changes to `diffMinimapInstance` won't be reflected after initialization, so we rely on `diffMinimapRef.current` for updates.
        updateDiffMinimapValues(diffMinimapRef.current, vu.transactions, 'a')
    })

    const modifiedUpdateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
        if (vu.docChanged) {
            const { doc } = vu.state
            const val = doc.toString()
            handleOnChange(val, vu)
        }

        // Using `diffMinimapRef` instead of `diffMinimapInstance` since this extension captures the initial reference in a closure.
        // Changes to `diffMinimapInstance` won't be reflected after initialization, so we rely on `diffMinimapRef.current` for updates.
        updateDiffMinimapValues(diffMinimapRef.current, vu.transactions, 'b')
    })

    useEffect(() => {
        // DIFF VIEW INITIALIZATION
        if (!loading && codeMirrorMergeParentRef.current) {
            codeMirrorMergeInstance?.destroy()

            const codeMirrorMergeView = new MergeView({
                a: {
                    doc: lhsValue,
                    extensions: [...originalViewExtensions, originalUpdateListener],
                },
                b: {
                    doc: value,
                    extensions: [...modifiedViewExtensions, modifiedUpdateListener],
                },
                ...(!readOnly ? { revertControls: 'a-to-b', renderRevertControl: getRevertControlButton } : {}),
                diffConfig: { scanLimit: 5000 },
                parent: codeMirrorMergeParentRef.current,
            })
            setCodeMirrorMergeInstance(codeMirrorMergeView)

            // MINIMAP INITIALIZATION
            if (codeMirrorMergeView && diffMinimapParentRef.current) {
                diffMinimapInstance?.destroy()
                diffMinimapRef.current?.destroy()

                const diffMinimapMergeView = new MergeView({
                    a: {
                        doc: lhsValue,
                        extensions: diffMinimapExtensions,
                    },
                    b: {
                        doc: value,
                        extensions: diffMinimapExtensions,
                    },
                    gutter: false,
                    diffConfig: { scanLimit: 5000 },
                    parent: diffMinimapParentRef.current,
                })

                diffMinimapRef.current = diffMinimapMergeView
                setDiffMinimapInstance(diffMinimapMergeView)
            }
        }

        return () => {
            setCodeMirrorMergeInstance(null)
            setDiffMinimapInstance(null)
            diffMinimapRef.current = null
        }
    }, [loading, codemirrorMergeKey, diffMode])

    // Sync external changes of `lhsValue` and `value` state to the diff-editor state.
    useEffect(() => {
        if (codeMirrorMergeInstance) {
            const originalDoc = codeMirrorMergeInstance.a.state.doc.toString()
            if (originalDoc !== lhsValue) {
                codeMirrorMergeInstance.a.dispatch({
                    changes: { from: 0, to: originalDoc.length, insert: lhsValue || '' },
                })
            }

            const modifiedDoc = codeMirrorMergeInstance.b.state.doc.toString()
            if (modifiedDoc !== value) {
                codeMirrorMergeInstance.b.dispatch({
                    changes: { from: 0, to: modifiedDoc.length, insert: value || '' },
                })
            }
        }
    }, [lhsValue, value, codeMirrorMergeInstance])

    // SCALING FACTOR UPDATER
    useEffect(() => {
        setTimeout(() => {
            setScalingFactor(
                codeMirrorMergeInstance
                    ? Math.min(codeMirrorMergeInstance.dom.clientHeight / codeMirrorMergeInstance.dom.scrollHeight, 1)
                    : 1,
            )
        }, 100)
    }, [lhsValue, value, codeMirrorMergeInstance])

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
            <div
                ref={codeMirrorMergeParentRef}
                className={`cm-merge-theme flex-grow-1 h-100 dc__overflow-hidden ${readOnly ? 'code-editor__read-only' : ''}`}
            />
            <DiffMinimap
                theme={theme}
                view={codeMirrorMergeInstance}
                diffMinimapParentRef={diffMinimapParentRef}
                scalingFactor={scalingFactor}
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
