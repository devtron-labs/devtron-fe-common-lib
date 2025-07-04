import { useEffect, useState } from 'react'

interface DelayComponentRenderProps {
    children: React.ReactElement
    /** delay in ms */
    delay?: number
}

const DelayComponentRender = ({ children, delay = 250 }: DelayComponentRenderProps) => {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(false) // Reset show state on delay change

        const timer = setTimeout(() => {
            setShow(true)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [delay])

    return show && children
}

export default DelayComponentRender
