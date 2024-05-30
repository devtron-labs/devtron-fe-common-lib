import { useCallback, useEffect } from 'react'
import { UsePromptProps } from './types'

/**
 * Hook that shows a prompt when shouldPrompt is true and the user tries to leave the page through refresh
 * Meant to be used alongside the Prompt component from react-router-dom
 */
const usePrompt = ({ shouldPrompt }: UsePromptProps) => {
    const handlePageLeave = useCallback(
        (e: BeforeUnloadEvent) => {
            if (shouldPrompt) {
                e.preventDefault()
            }
        },
        [shouldPrompt],
    )

    useEffect(() => {
        window.addEventListener('beforeunload', handlePageLeave)

        return () => {
            window.removeEventListener('beforeunload', handlePageLeave)
        }
    }, [handlePageLeave])
}

export default usePrompt
