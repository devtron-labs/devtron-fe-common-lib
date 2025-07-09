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

import { FALLBACK_SENTINEL_HEIGHT, SENTINEL_HEIGHT_BUFFER } from './constants'
import { UseStickyEventReturnType } from './types'

export const getHeightForStickyElementTopOffset = <T extends HTMLElement>({
    stickyElementRef,
}: Pick<UseStickyEventReturnType<T>, 'stickyElementRef'>) => {
    const topValue = window.getComputedStyle(stickyElementRef.current).top

    if (!topValue) {
        return FALLBACK_SENTINEL_HEIGHT
    }

    const calcRegex = /calc\(.*\)/g
    const doesTopOffsetContainCalc = calcRegex.test(topValue)

    if (doesTopOffsetContainCalc) {
        return topValue.replace(calcRegex, (match) => `calc(${match} + ${SENTINEL_HEIGHT_BUFFER}px)`)
    }

    return topValue.replace(/\d+(\.\d+)?/g, (match) => {
        const nMatch = Number(match)

        if (Number.isNaN(nMatch)) {
            return FALLBACK_SENTINEL_HEIGHT
        }

        return `${nMatch + SENTINEL_HEIGHT_BUFFER}`
    })
}
