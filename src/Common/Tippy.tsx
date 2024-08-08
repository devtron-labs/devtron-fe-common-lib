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

import { useEffect, useRef, useState } from 'react'
import TippyJS, { TippyProps as TippyJSProps } from '@tippyjs/react'

// TODO: we should generalize this Tippy to work without sending in this truncateWidth
const Tippy = ({ truncateWidth = 0, children, ...rest }: TippyJSProps & Record<'truncateWidth', number>) => {
    // NOTE: if showOnTruncate is off then always showTippy
    const [showTippy, setShowTippy] = useState(!!truncateWidth)
    const ref = useRef(null)

    useEffect(() => {
        if (truncateWidth) {
            setShowTippy(ref.current?.offsetWidth >= truncateWidth)
        }
    }, [ref.current?.offsetWidth])

    return !showTippy ? (
        children
    ) : (
        <TippyJS {...rest}>
            <span ref={ref}>{children}</span>
        </TippyJS>
    )
}

export default Tippy
