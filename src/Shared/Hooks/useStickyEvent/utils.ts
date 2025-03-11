import { FALLBACK_SENTINEL_HEIGHT } from './constants'
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
        return topValue.replace(calcRegex, (match) => `calc(${match} + 1px)`)
    }

    return topValue.replace(/\d+(\.\d+)?/g, (match) => {
        const nMatch = Number(match)

        if (Number.isNaN(nMatch)) {
            return FALLBACK_SENTINEL_HEIGHT
        }

        return `${nMatch + 1}`
    })
}
