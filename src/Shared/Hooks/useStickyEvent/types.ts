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
} & (
    | {
          /**
           * Reference to the scroll container element that contains the sticky element
           *
           * Either the reference can be passed or its class name
           */
          containerRef: MutableRefObject<T>
          containerClassName?: never
      }
    | { containerClassName: string; containerRef?: never }
)
