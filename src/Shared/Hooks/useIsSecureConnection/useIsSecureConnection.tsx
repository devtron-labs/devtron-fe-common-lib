import { useEffect, useState } from 'react'

export const useIsSecureConnection = () => {
    const [isSecure, setIsSecure] = useState(false)

    useEffect(() => {
        setIsSecure(window.location.protocol === 'https:')
    }, [])

    return isSecure
}
