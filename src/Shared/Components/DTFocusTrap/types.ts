import { ReactNode } from 'react'

/* Mimicking types from Focus React Library */
type FocusTargetValue = HTMLElement | SVGElement | string
type FocusTargetValueOrFalse = FocusTargetValue | false

/**
 * A DOM node, a selector string (which will be passed to
 * `document.querySelector()` to find the DOM node), `false` to explicitly indicate
 * an opt-out, or a function that returns a DOM node or `false`.
 */
type FocusTargetOrFalse = FocusTargetValueOrFalse | (() => FocusTargetValueOrFalse)

export interface DTFocusTrapType {
    /**
     * Callback function that gets triggered when the Escape key is pressed. \
     * Should be wrapped in useCallback to prevent unnecessary re-renders.
     * @example
     * const handleEscape = useCallback(() => {
     *   // Handle escape key press
     * }, []);
     */
    onEscape: (e?: KeyboardEvent | MouseEvent) => void
    /**
     * If focus should be deactivated on escape, pass false when escape is disabled or has no action
     * true for cases when we are closing modals or dialogs
     * @default true
     */
    deactivateFocusOnEscape?: boolean
    children: ReactNode
    /**
     * With this option, you can specify an element to receive the initial focus, or use false for no initially focused element at all.
     * Setting this option to undefined (or to a function that returns undefined) will result in the first element in the focus trap's tab order receiving focus.
     */
    initialFocus?: FocusTargetOrFalse | undefined | (() => void)
}
