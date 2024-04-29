import React, { useRef, useEffect } from 'react'
import { preventBodyScroll } from '../../Shared'
import { VisibleModal } from '../Modals/VisibleModal'
import './Drawer.scss'

interface drawerInterface {
    position: 'left' | 'right' | 'bottom' | 'top'
    children?: any
    backdrop?: boolean
    onClose?: (e: any) => void
    width?: string
    minWidth?: string
    maxWidth?: string
    height?: string
    parentClassName?: string
    onEscape?: (e?: any) => void
}

export const Drawer = ({
    children,
    position,
    height,
    width,
    minWidth,
    maxWidth,
    parentClassName,
    onEscape,
}: drawerInterface) => {
    const drawerRef = useRef(null)
    useEffect(() => {
        setTimeout(() => drawerRef.current?.classList?.add('show'), 1)
        preventBodyScroll(true)
        return () => {
            drawerRef.current?.classList?.remove('show')
            preventBodyScroll(false)
        }
    }, [])
    const style = {}
    if (position === 'left' || position === 'right') {
        style['--width'] = width
        style['--minWidth'] = minWidth
        style['--maxWidth'] = maxWidth
    }
    if (position === 'top' || position === 'bottom') {
        style['--height'] = height
    }
    return (
        <VisibleModal className="drawer--container" parentClassName={parentClassName || ''} onEscape={onEscape}>
            <aside style={style} ref={drawerRef} className={`drawer ${position}`}>
                {children}
            </aside>
        </VisibleModal>
    )
}
