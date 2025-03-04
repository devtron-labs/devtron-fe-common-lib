import { useEffect, useMemo, useRef, useState } from 'react'
import { EditorView } from '@uiw/react-codemirror'
import CodeMirrorMerge, { CodeMirrorMergeRef } from 'react-codemirror-merge'

import { getComponentSpecificThemeClass } from '@Shared/Providers'

import { DiffMinimapProps } from '../types'
import { CODE_EDITOR_FONT_SIZE, CODE_EDITOR_LINE_HEIGHT } from '../CodeEditor.constants'

export const DiffMinimap = ({ view, state, diffMinimapExtensions, codeEditorTheme, theme }: DiffMinimapProps) => {
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
        if (view?.dom) {
            return view.dom.clientHeight / view.dom.scrollHeight
        }

        return 1
    }, [view?.a.state.doc.length, view?.b.state.doc.length])

    // Update the overlay position and size
    const updateOverlay = () => {
        if (!view?.dom || !minimapContainerRef.current || !overlayRef.current) {
            return
        }

        const { clientHeight, scrollHeight, scrollTop } = view.dom
        const minimapHeight = minimapContainerRef.current.clientHeight

        const _overlayHeight = (clientHeight / scrollHeight) * minimapHeight
        const _overlayTop = (scrollTop / scrollHeight) * minimapHeight

        setOverlayHeight(_overlayHeight)
        setOverlayTop(_overlayTop)
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
        if (view?.dom) {
            const { dom } = view
            dom.addEventListener('scroll', handleDiffScroll)
        }

        return () => {
            if (view?.dom) {
                const { dom } = view
                dom.removeEventListener('scroll', handleDiffScroll)
            }
        }
    }, [view])

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

    const minimapTheme = EditorView.theme({
        '&.cm-editor': {
            fontSize: `${scalingFactor * CODE_EDITOR_FONT_SIZE}px`,
            lineHeight: `${scalingFactor * CODE_EDITOR_LINE_HEIGHT}`,
        },
    })

    return (
        <div
            ref={minimapContainerRef}
            className={`code-editor__minimap-container dc__position-rel dc__no-shrink cursor ${componentSpecificThemeClass}`}
            onClick={handleMinimapClick}
        >
            <CodeMirrorMerge
                key={scalingFactor}
                ref={minimapEditorRef}
                theme={codeEditorTheme}
                className="code-editor__mini-map dc__overflow-hidden w-100"
                gutter={false}
                destroyRerender={false}
            >
                <CodeMirrorMerge.Original
                    basicSetup={false}
                    value={state.lhsCode}
                    readOnly
                    editable={false}
                    extensions={[...diffMinimapExtensions, minimapTheme]}
                />
                <CodeMirrorMerge.Modified
                    basicSetup={false}
                    value={state.code}
                    readOnly
                    editable={false}
                    extensions={[...diffMinimapExtensions, minimapTheme]}
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
