import { ReactNode } from 'react'

export interface BackdropProps {
    children: ReactNode
    /**
     * @param onEscape: please wrap in a useCallback, with respective dependencies or []
     */
    onEscape: () => void
}
