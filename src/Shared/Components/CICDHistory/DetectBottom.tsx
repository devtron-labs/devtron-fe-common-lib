import { useEffect, useRef } from 'react'
import { useIntersection } from '../../Helpers'

const DetectBottom = ({ callback }: { callback: () => void }) => {
    const target = useRef<HTMLSpanElement>(null)
    const intersected = useIntersection(target, {
        rootMargin: '0px',
        once: false,
    })

    useEffect(() => {
        if (intersected) {
            callback()
        }
    }, [intersected])

    return <span className="pb-5" ref={target} />
}

export default DetectBottom
