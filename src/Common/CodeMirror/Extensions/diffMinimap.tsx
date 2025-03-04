import { useEffect, useMemo, useRef, useState } from 'react'
import CodeMirrorMerge from 'react-codemirror-merge'

import { getComponentSpecificThemeClass } from '@Shared/Providers'

import { DiffMinimapProps } from '../types'

export const DiffMinimap = ({ view, state, diffMinimapExtensions, codeEditorTheme, theme }: DiffMinimapProps) => {
    const minimapContainerRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const [overlayHeight, setOverlayHeight] = useState<number>(50)
    const [overlayTop, setOverlayTop] = useState<number>(0)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const dragStartY = useRef<number>(0)
    const startScrollTop = useRef<number>(0)

    const componentSpecificThemeClass = getComponentSpecificThemeClass(theme)

    const { scaleFactor, diffMinimapHeight } = useMemo(() => {
        if (view?.dom) {
            return {
                scaleFactor: view.dom.parentElement.parentElement.clientHeight / view.dom.scrollHeight,
                diffMinimapHeight: view.dom.scrollHeight,
            }
        }

        return { scaleFactor: 0, diffMinimapHeight: 0 }
    }, [view])

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
    }, [scaleFactor])

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

    return (
        <div ref={minimapContainerRef} className="dc__position-rel">
            <CodeMirrorMerge
                key={scaleFactor}
                theme={codeEditorTheme}
                className={`code-editor__mini-map dc__overflow-hidden ${componentSpecificThemeClass}`}
                gutter={false}
                destroyRerender={false}
                style={{
                    maxWidth: '30px',
                    transform: `scale(1, ${scaleFactor})`,
                    height: `${diffMinimapHeight}px`,
                    transformOrigin: 'top left',
                }}
            >
                <CodeMirrorMerge.Original
                    basicSetup={false}
                    value={state.lhsCode}
                    readOnly
                    editable={false}
                    extensions={diffMinimapExtensions}
                />
                <CodeMirrorMerge.Modified
                    basicSetup={false}
                    value={state.code}
                    readOnly
                    editable={false}
                    extensions={diffMinimapExtensions}
                />
            </CodeMirrorMerge>
            <div
                className="dc__position-abs dc__top-0 dc__left-0 dc__right-0 dc__bottom-0 dc__zi-1 cursor"
                onClick={handleMinimapClick}
            />
            <div
                ref={overlayRef}
                className="dc__position-abs dc__left-0 w-100 br-4 dc__zi-2"
                style={{
                    top: `${overlayTop}px`,
                    height: `${overlayHeight}px`,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    cursor: 'grab',
                }}
                onMouseDown={handleOverlayMouseDown}
            />
        </div>
    )
}
