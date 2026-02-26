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
import { MergeView } from '@codemirror/merge'
import CodeMirror, { EditorView, ReactCodeMirrorRef, ViewUpdate } from '@uiw/react-codemirror'

import { Progressing } from '@Common/Progressing'
import { getComponentSpecificThemeClass } from '@Shared/Providers'

import { useCodeEditorContext } from './CodeEditor.context'
import { DiffMinimap } from './Extensions'
import { CodeEditorRendererProps } from './types'
import { getCodeEditorHeight, getRevertControlButton, getScanLimit, updateDiffMinimapValues } from './utils'

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
    collapseUnchanged = false,
    disableMinimap = false,
}: CodeEditorRendererProps) => {
    // CONTEXTS
    const { value, lhsValue, diffMode } = useCodeEditorContext()

    // STATES
    const [gutterWidth, setGutterWidth] = useState(0)
    const [codeMirrorMergeInstance, setCodeMirrorMergeInstance] = useState<MergeView>(null)
    const [diffMinimapInstance, setDiffMinimapInstance] = useState<MergeView>(null)
    const [scalingFactor, setScalingFactor] = useState<number>(1)

    // REFS
    const codeMirrorRef = useRef<ReactCodeMirrorRef>(null)
    const codeMirrorMergeParentRef = useRef<HTMLDivElement>(null)
    const codeMirrorMergeRef = useRef<MergeView>(null)
    const diffMinimapRef = useRef<MergeView>(null)
    const diffMinimapParentRef = useRef<HTMLDivElement>(null)

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

        if (!disableMinimap) {
            // Using `diffMinimapRef` instead of `diffMinimapInstance` since this extension captures the initial reference in a closure.
            // Changes to `diffMinimapInstance` won't be reflected after initialization, so we rely on `diffMinimapRef.current` for updates.
            updateDiffMinimapValues(diffMinimapRef.current, vu.transactions, 'a')
        }
    })

    const modifiedUpdateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
        if (vu.docChanged) {
            const { doc } = vu.state
            const val = doc.toString()
            handleOnChange(val, vu)
        }

        if (!disableMinimap) {
            // Using `diffMinimapRef` instead of `diffMinimapInstance` since this extension captures the initial reference in a closure.
            // Changes to `diffMinimapInstance` won't be reflected after initialization, so we rely on `diffMinimapRef.current` for updates.
            updateDiffMinimapValues(diffMinimapRef.current, vu.transactions, 'b')
        }
    })

    /**
     * Initializes or reinitializes the CodeMirror merge view for diff comparison.
     *
     * This function:
     * 1. Destroys any existing merge view instances to prevent memory leaks
     * 2. Creates a new MergeView instance with the current values and configurations
     * 3. Initializes the diff minimap if enabled
     * 4. Updates the component state with the new instances
     *
     */
    const initializeCodeMirrorMergeView = () => {
        // Destroy existing merge view instance if it exists
        codeMirrorMergeInstance?.destroy()
        codeMirrorMergeRef.current?.destroy()

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
            diffConfig: { scanLimit: getScanLimit(lhsValue, value), timeout: 5000 },
            parent: codeMirrorMergeParentRef.current,
            collapseUnchanged: collapseUnchanged ? {} : undefined,
        })

        codeMirrorMergeRef.current = codeMirrorMergeView
        setCodeMirrorMergeInstance(codeMirrorMergeView)

        // MINIMAP INITIALIZATION
        if (!disableMinimap && codeMirrorMergeView && diffMinimapParentRef.current) {
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
                diffConfig: { scanLimit: getScanLimit(lhsValue, value), timeout: 5000 },
                parent: diffMinimapParentRef.current,
            })

            diffMinimapRef.current = diffMinimapMergeView
            setDiffMinimapInstance(diffMinimapMergeView)
        }
    }

    useEffect(() => {
        // DIFF VIEW INITIALIZATION
        if (!loading && codeMirrorMergeParentRef.current) {
            initializeCodeMirrorMergeView()
        }

        return () => {
            setCodeMirrorMergeInstance(null)
            setDiffMinimapInstance(null)
            codeMirrorMergeRef.current = null
            diffMinimapRef.current = null
        }
    }, [loading, codemirrorMergeKey, diffMode, collapseUnchanged, disableMinimap])

    /**
     * Synchronizes external changes of `lhsValue` and `value` with the diff-editor state.
     *
     * When the external state (lhsValue for left-hand side or value for right-hand side) changes,
     * we need to update the CodeMirror merge view to reflect these changes. This effect detects
     * discrepancies between the current editor content and the external state.
     *
     * Instead of trying to update the existing editors directly (which can be complex and error-prone),
     * we reinitialize the entire merge view when the external state differs from the editor content.
     * This ensures a clean, consistent state that properly reflects the external data.
     *
     */
    useEffect(() => {
        if (codeMirrorMergeRef.current) {
            // Get the current content from both editors
            const originalDoc = codeMirrorMergeRef.current.a.state.doc.toString()
            const modifiedDoc = codeMirrorMergeRef.current.b.state.doc.toString()

            // If either editor's content doesn't match the external state,
            // reinitialize the entire merge view with the current values
            if (originalDoc !== lhsValue || modifiedDoc !== value) {
                initializeCodeMirrorMergeView()
            }
        }
    }, [lhsValue, value])

    // SCALING FACTOR UPDATER
    useEffect(() => {
        if (!disableMinimap) {
            setTimeout(() => {
                setScalingFactor(
                    codeMirrorMergeInstance
                        ? Math.min(
                              codeMirrorMergeInstance.dom.clientHeight / codeMirrorMergeInstance.dom.scrollHeight,
                              1,
                          )
                        : 1,
                )
            }, 100)
        }
    }, [lhsValue, value, codeMirrorMergeInstance, disableMinimap])

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
        <div
            ref={codeMirrorParentDivRef}
            className={`flexbox w-100 ${componentSpecificThemeClass} ${codeEditorParentClassName}`}
        >
            {!codeMirrorMergeInstance && (
                <div className="flex h-100 w-100">
                    <p>Calculating diff for large file. Please wait...</p>
                </div>
            )}
            <div
                ref={codeMirrorMergeParentRef}
                className={`cm-merge-theme flex-grow-1 h-100 dc__overflow-hidden ${readOnly ? 'code-editor__read-only' : ''}`}
            />
            {!disableMinimap && (
                <DiffMinimap
                    theme={theme}
                    view={codeMirrorMergeInstance}
                    diffMinimapParentRef={diffMinimapParentRef}
                    scalingFactor={scalingFactor}
                />
            )}
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
