import { useEffect, useRef } from 'react'

export function useDebouncedEffect(callback, delay, deps: unknown[] = []) {
    // function will be executed only after the specified time once the user stops firing the event.
    const firstUpdate = useRef(true)
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false
            return
        }
        const handler = setTimeout(() => {
            callback()
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [delay, ...deps])
}
