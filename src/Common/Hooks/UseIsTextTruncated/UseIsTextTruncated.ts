/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
