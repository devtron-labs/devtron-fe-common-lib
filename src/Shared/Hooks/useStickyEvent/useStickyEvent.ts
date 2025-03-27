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
import { isNullOrUndefined } from '@Shared/Helpers'
import { noop } from '@Common/Helper'
import { UseStickyEventProps, UseStickyEventReturnType } from './types'
import { OBSERVER_ROOT_MARGIN, OBSERVER_THRESHOLD } from './constants'
import { getHeightForStickyElementTopOffset } from './utils'

import './styles.scss'

/**
 * Please read
 *   https://developer.chrome.com/docs/css-ui/sticky-headers
 * as a reference for the implementation
 */
const useStickyEvent = <T extends HTMLElement = HTMLDivElement>({
    containerSelector,
    containerRef,
    identifier,
    isStickyElementMounted = true,
}: UseStickyEventProps<T>): UseStickyEventReturnType<T> => {
    const stickyElementRef = useRef<T>(null)
    const [isStuck, setIsStuck] = useState(false)

    useEffect(
        () => {
            if (!stickyElementRef.current || !isStickyElementMounted) {
                return noop
            }

            const stickyElementParent = containerRef
                ? containerRef.current
                : Array.from(document.querySelectorAll(containerSelector)).find((element) =>
                      element.contains(stickyElementRef.current),
                  )

            if (!stickyElementParent) {
                return noop
            }

            // The sentinel is a div used to detect when the sticky element is stuck.
            // It is taller than the sticky element's top offset, ensuring it overflows
            // the container when the sticky element sticks to the top.
            // Using IntersectionObserver, we observe both the sticky element and the sentinel.
            // When the sentinel is not fully in view, isIntersecting is false,
            // indicating the sticky element is stuck given it is fully in view.
            let hasSentinelLeftView: boolean
            let hasHeaderLeftView: boolean

            const sentinelId = `${identifier}__sentinel`

            const intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        switch (entry.target.id) {
                            case sentinelId:
                                // NOTE: Since the threshold is set to 1.0, isIntersecting will be
                                // true only when the target element is fully within the container
                                // (root). If even a single pixel of the target element is outside
                                // the container, isIntersecting will be false.
                                hasSentinelLeftView = !entry.isIntersecting
                                break
                            default:
                                hasHeaderLeftView = !entry.isIntersecting
                        }
                    })

                    setIsStuck(hasSentinelLeftView && !hasHeaderLeftView)
                },
                { root: stickyElementParent, threshold: OBSERVER_THRESHOLD, rootMargin: OBSERVER_ROOT_MARGIN },
            )

            let sentinelElement = document.getElementById(sentinelId)

            if (!sentinelElement) {
                sentinelElement = document.createElement('div')
                sentinelElement.id = sentinelId
                sentinelElement.classList.add('sticky-container__sentinel')
            }

            // The sentinel element's height must exceed the sticky element's top CSS value.
            // This guarantees that when the sticky element sticks to the container's edge,
            // the sentinel element will extend beyond the scroll container.
            sentinelElement.style.height = getHeightForStickyElementTopOffset<T>({ stickyElementRef })

            stickyElementRef.current.appendChild(sentinelElement)

            intersectionObserver.observe(sentinelElement)
            intersectionObserver.observe(stickyElementRef.current)

            return () => {
                intersectionObserver.disconnect()
            }
        },
        // NOTE: The isStickyElementMounted dependency ensures that this effect
        // runs not only on mount/unmount but also when the isStickyElementMounted value changes.
        // This is important because the sticky element might not be present during
        // the initial render and could be added later based on certain conditions.
        // By using isStickyElementMounted as a dependency, we make sure that the effect
        // re-runs when the element is rendered, allowing the stickyElementRef to be populated.
        isNullOrUndefined(isStickyElementMounted) ? [] : [isStickyElementMounted],
    )

    return { stickyElementRef, isStuck }
}

export default useStickyEvent
