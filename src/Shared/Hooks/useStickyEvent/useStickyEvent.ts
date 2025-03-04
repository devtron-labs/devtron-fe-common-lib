import { useEffect, useRef } from 'react'
import { isNullOrUndefined } from '@Shared/Helpers'
import { noop } from '@Common/Helper'
import { UseStickyEventProps } from './types'
import { FALLBACK_SENTINEL_HEIGHT, OBSERVER_ROOT_MARGIN, OBSERVER_THRESHOLD } from './constants'

import './styles.scss'

/**
 * Please read
 *   https://developer.chrome.com/docs/css-ui/sticky-headers
 * as a reference for the implementation
 */
const useStickyEvent = <T extends HTMLElement = HTMLDivElement>({
    callback,
    containerClassName,
    containerRef,
    isStickyElementMounted,
    identifier,
}: UseStickyEventProps<T>) => {
    const stickyElementRef = useRef<T>(null)

    useEffect(
        () => {
            if (!stickyElementRef.current || (!isNullOrUndefined(isStickyElementMounted) && !isStickyElementMounted)) {
                return noop
            }

            const stickyElementParent = containerRef
                ? containerRef.current
                : Array.from(document.getElementsByClassName(containerClassName)).find((element) =>
                      element.contains(stickyElementRef.current),
                  )

            if (!stickyElementParent) {
                return noop
            }

            let previousStuckState: boolean
            let hasSentinelLeftView: boolean
            let hasHeaderLeftView: boolean

            const sentinelId = `${identifier}__sentinel`

            const intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        switch (entry.target.id) {
                            case sentinelId:
                                hasSentinelLeftView = !entry.isIntersecting
                                break
                            default:
                                hasHeaderLeftView = !entry.isIntersecting
                        }
                    })

                    const isStuck = hasSentinelLeftView && !hasHeaderLeftView

                    if (isNullOrUndefined(previousStuckState) || isStuck !== previousStuckState) {
                        callback(isStuck)
                        previousStuckState = isStuck
                    }
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
            sentinelElement.style.height =
                window.getComputedStyle(stickyElementRef.current).top?.replace(/[0-9]+/g, (match) => {
                    const nMatch = Number(match)
                    if (Number.isNaN(nMatch)) {
                        return FALLBACK_SENTINEL_HEIGHT
                    }
                    return `${nMatch + 1}`
                }) ?? FALLBACK_SENTINEL_HEIGHT

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

    return { stickyElementRef }
}

export default useStickyEvent
