import { useEffect, useMemo, useRef, useState } from 'react'
import CodeMirrorMerge, { CodeMirrorMergeRef } from 'react-codemirror-merge'

import { getComponentSpecificThemeClass } from '@Shared/Providers'
import { useDebouncedEffect } from '@Common/DebouncedSearch/Utils'

import { DiffMinimapProps } from '../types'
import { CODE_EDITOR_FONT_SIZE, CODE_EDITOR_LINE_HEIGHT, CODE_EDITOR_MIN_OVERLAY_HEIGHT } from '../CodeEditor.constants'
import { useCodeEditorContext } from '../CodeEditor.context'
import { updateDiffMinimapValues } from '../utils'

export const DiffMinimap = ({ view, diffMinimapExtensions, codeEditorTheme, theme }: DiffMinimapProps) => {
    // CONTEXTS
    const { lhsValue, value } = useCodeEditorContext()

    // STATES
    const [overlayTop, setOverlayTop] = useState<number>(0)
    const [overlayHeight, setOverlayHeight] = useState<number>(50)
    const [isDragging, setIsDragging] = useState<boolean>(false)

    // REFS
    const minimapContainerRef = useRef<HTMLDivElement>(null)
    const minimapEditorRef = useRef<CodeMirrorMergeRef>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const dragStartY = useRef<number>(0)
    const startScrollTop = useRef<number>(0)

    // CONSTANTS
    const componentSpecificThemeClass = getComponentSpecificThemeClass(theme)

    const scalingFactor = useMemo(() => {
        if (view) {
            return Math.min(view.dom.clientHeight / view.dom.scrollHeight, 1)
        }

        return 1
    }, [lhsValue, value])

    // SETTING INITIAL DIFF MINI MAP VALUES
    useEffect(() => {
        setTimeout(() => {
            updateDiffMinimapValues(minimapEditorRef.current?.view, value, lhsValue)
        }, 0)
    }, [])

    useDebouncedEffect(
        () => {
            updateDiffMinimapValues(minimapEditorRef.current?.view, value, lhsValue)
        },
        300,
        [value, lhsValue, scalingFactor],
    )

    // Update the overlay position and size
    const updateOverlay = () => {
        if (!view?.dom || !minimapContainerRef.current || !overlayRef.current) {
            return
        }

        const { clientHeight, scrollHeight, scrollTop } = view.dom
        const minimapHeight = minimapContainerRef.current.clientHeight

        let computedHeight = (clientHeight / scrollHeight) * minimapHeight
        if (computedHeight < CODE_EDITOR_MIN_OVERLAY_HEIGHT) {
            computedHeight = CODE_EDITOR_MIN_OVERLAY_HEIGHT
        }

        setOverlayHeight(computedHeight)
        setOverlayTop((scrollTop / scrollHeight) * (minimapHeight - computedHeight))
    }

    useEffect(() => {
        updateOverlay()
    }, [scalingFactor])

    // Sync overlay scrolling with the diff view
    const handleDiffScroll = () => {
        updateOverlay()
    }

    // Start dragging the overlay
    const handleOverlayMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()

        setIsDragging(true)
        dragStartY.current = event.clientY
        startScrollTop.current = view.dom?.scrollTop || 0

        // Disable selection globally while dragging
        document.body.style.userSelect = 'none'
        document.body.style.pointerEvents = 'none'
    }

    // Dragging the overlay to scroll
    const handleOverlayMouseMove = (event: MouseEvent) => {
        if (!isDragging || !view?.dom || !minimapContainerRef.current) {
            return
        }

        const { scrollHeight, clientHeight } = view.dom
        const minimapHeight = minimapContainerRef.current.clientHeight
        const deltaY = event.clientY - dragStartY.current
        const scrollRatio = deltaY / minimapHeight

        view.dom.scrollTo({ top: startScrollTop.current + scrollRatio * (scrollHeight - clientHeight) })
    }

    // Stop dragging
    const handleOverlayMouseUp = () => {
        setIsDragging(false)

        // Re-enable selection after dragging
        document.body.style.userSelect = 'auto'
        document.body.style.pointerEvents = 'auto'
    }

    useEffect(() => {
        if (view) {
            const { dom } = view
            dom.addEventListener('scroll', handleDiffScroll)
        }

        return () => {
            if (view) {
                const { dom } = view
                dom.removeEventListener('scroll', handleDiffScroll)
            }
        }
    }, [])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleOverlayMouseMove)
            document.addEventListener('mouseup', handleOverlayMouseUp)
        } else {
            document.removeEventListener('mousemove', handleOverlayMouseMove)
            document.removeEventListener('mouseup', handleOverlayMouseUp)
        }
        return () => {
            document.removeEventListener('mousemove', handleOverlayMouseMove)
            document.removeEventListener('mouseup', handleOverlayMouseUp)
        }
    }, [isDragging])

    // Clicking on the minimap scrolls the diff viewer
    const handleMinimapClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!view.dom || !minimapContainerRef.current) return

        const { clientHeight, scrollHeight } = view.dom
        const minimapHeight = minimapContainerRef.current.clientHeight
        const clickY = event.clientY - minimapContainerRef.current.getBoundingClientRect().top
        const scrollRatio = clickY / minimapHeight

        view.dom.scrollTo({ top: scrollRatio * (scrollHeight - clientHeight) })
    }

    return (
        <div
            ref={minimapContainerRef}
            className={`code-editor__minimap-container dc__position-rel dc__no-shrink cursor ${componentSpecificThemeClass}`}
            onClick={handleMinimapClick}
        >
            <CodeMirrorMerge
                ref={minimapEditorRef}
                theme={codeEditorTheme}
                className="code-editor__mini-map dc__overflow-hidden w-100"
                gutter={false}
                destroyRerender={false}
                style={{
                    fontSize: `${scalingFactor * CODE_EDITOR_FONT_SIZE}px`,
                    lineHeight: `${scalingFactor * CODE_EDITOR_LINE_HEIGHT}`,
                }}
            >
                <CodeMirrorMerge.Original
                    basicSetup={false}
                    readOnly
                    editable={false}
                    extensions={diffMinimapExtensions}
                />
                <CodeMirrorMerge.Modified
                    basicSetup={false}
                    readOnly
                    editable={false}
                    extensions={diffMinimapExtensions}
                />
            </CodeMirrorMerge>
            <div
                ref={overlayRef}
                className="code-editor__minimap-overlay dc__position-abs dc__left-0 w-100 dc__zi-1"
                style={{
                    top: `${overlayTop}px`,
                    height: `${overlayHeight}px`,
                }}
                onMouseDown={handleOverlayMouseDown}
            />
        </div>
    )
}
