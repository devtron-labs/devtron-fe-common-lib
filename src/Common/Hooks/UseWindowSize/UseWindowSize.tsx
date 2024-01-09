import { useState, useEffect } from 'react'

let timeout

const getSize = () => {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    }
}

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(getSize)

    function handleResize(e) {
        if (timeout) {
            window.cancelAnimationFrame(timeout)
        }

        timeout = window.requestAnimationFrame(function () {
            setWindowSize(getSize())
        })
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize, false)
        return () => window.removeEventListener('resize', handleResize, false)
    }, [])

    return windowSize
}
