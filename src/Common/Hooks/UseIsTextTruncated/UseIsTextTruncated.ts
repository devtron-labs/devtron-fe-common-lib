import { useState } from 'react'

import { SUB_PIXEL_ERROR } from './constants'

const useIsTextTruncated = () => {
    const [isTextTruncated, setIsTextTruncated] = useState(false)

    const handleMouseEnterEvent: React.MouseEventHandler = (event) => {
        const { currentTarget: node } = event
        const isTextOverflowing =
            node.scrollWidth > node.clientWidth + SUB_PIXEL_ERROR ||
            node.scrollHeight > node.clientHeight + SUB_PIXEL_ERROR
        if (isTextOverflowing && !isTextTruncated) {
            setIsTextTruncated(true)
        } else if (!isTextOverflowing && isTextTruncated) {
            setIsTextTruncated(false)
        }
    }

    return {
        isTextTruncated,
        handleMouseEnterEvent,
    }
}

export default useIsTextTruncated
