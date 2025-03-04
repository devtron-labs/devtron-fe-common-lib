import { Dispatch, SetStateAction, MutableRefObject } from 'react'

export type UseStickyEventProps<T extends HTMLElement = HTMLDivElement> = {
    /**
     * Callback function that is called when the sticky element is 'stuck' or 'unstuck'
     */
    callback: (isStuck: boolean) => void | Dispatch<SetStateAction<boolean>>
    /**
     * Unique identifier used to create the id of the sentinel element
     *
     * A sentinel element is used to determine when the sticky element is 'stuck'
     * It is dynamically created and appended to the DOM
     */
    identifier: string
    /**
     * Indicates whether the sticky element is conditionally rendered.
     * - Set to true if the sticky element is mounted.
     * - Set to false if the sticky element is not mounted.
     * - If the sticky element is always rendered, this flag can be ignored.
     */
    isStickyElementMounted?: boolean
    /**
     * The top offset value of the sticky element.
     * This can be a CSS value such as '10px', '1rem', or 'calc(100% + 10px)'.
     *
     * If the top value is specified in 'px' or 'rem', this value can be ignored.
     * Use this only if the top value is specified in percentage or uses 'calc'.
     */
    topOffset?: string
} & (
    | {
          /**
           * Reference to the scroll container element that contains the sticky element
           *
           * Either the reference can be passed or its querySelector
           */
          containerRef: MutableRefObject<T>
          containerSelector?: never
      }
    | { containerSelector: string; containerRef?: never }
)
