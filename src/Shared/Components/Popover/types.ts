import { DetailedHTMLProps, KeyboardEvent, LegacyRef, MutableRefObject, ReactElement } from 'react'
import { HTMLMotionProps } from 'framer-motion'

import { BackdropProps } from '../Backdrop'
import { ButtonProps } from '../Button'

export interface UsePopoverProps {
    /**
     * A unique identifier for the popover.
     */
    id: string
    /**
     * The width of the popover.
     * Can be a number representing the width in pixels or the string `'auto'` for automatic sizing (up to 250px).
     * @default 'auto'
     */
    width?: number | 'auto'
    /**
     * The position of the popover relative to its trigger element.
     * Possible values are:
     * - `'bottom'`: Positions the popover below the trigger.
     * - `'top'`: Positions the popover above the trigger.
     * - `'left'`: Positions the popover to the left of the trigger.
     * - `'right'`: Positions the popover to the right of the trigger.
     * @default 'bottom'
     */
    position?: 'bottom' | 'top' | 'left' | 'right'
    /**
     * The alignment of the popover relative to its trigger element.
     * Possible values are:
     * - `'start'`: Aligns the popover to the start of the trigger.
     * - `'middle'`: Aligns the popover to the center of the trigger.
     * - `'end'`: Aligns the popover to the end of the trigger.
     * @default 'start'
     */
    alignment?: 'start' | 'middle' | 'end'
    /**
     * Callback function triggered when the popover is opened or closed.
     * @param open - A boolean indicating whether the popover is open.
     */
    onOpen?: (open: boolean) => void
    /**
     * Callback function triggered when a key is pressed while the trigger element is focused.
     * @param e - The keyboard event.
     * @param openState - A boolean indicating whether the popover is currently open.
     * @param closePopover - A function to close the popover.
     */
    onTriggerKeyDown?: (e: KeyboardEvent, openState: boolean, closePopover: () => void) => void
    /**
     * Callback function triggered when a key is pressed while the popover is focused.
     * @param e - The keyboard event.
     * @param openState - A boolean indicating whether the popover is currently open.
     * @param closePopover - A function to close the popover.
     */
    onPopoverKeyDown?: (e: KeyboardEvent, openState: boolean, closePopover: () => void) => void
    /**
     * Variant of the popover (bg, shadow and styles changes based on variant)
     * @default 'menu'
     */
    variant?: 'menu' | 'overlay'
}

/**
 * Represents the return type of the `usePopover` hook, providing properties and methods
 * to manage and interact with a popover component.
 */
export interface UsePopoverReturnType {
    /**
     * Indicates whether the popover is currently open.
     */
    open: boolean
    /**
     * Props to be spread onto the trigger element that opens the popover.
     * These props include standard HTML attributes for a `div` element.
     */
    triggerProps: DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        bounds: Pick<DOMRect, 'left' | 'top' | 'height' | 'width'>
    }
    /**
     * Props to be spread onto the overlay element of the popover.
     * These props include backdrop properties.
     */
    overlayProps: Omit<BackdropProps, 'children'>
    /**
     * Props to be spread onto the popover element itself.
     * Includes motion-related props for animations and a `ref` to the popover's `div` element.
     */
    popoverProps: HTMLMotionProps<'div'> & { ref: MutableRefObject<HTMLDivElement> }
    /**
     * A mutable reference to the scrollable element inside the popover. \
     * This reference should be assigned to the element that is scrollable.
     */
    scrollableRef: MutableRefObject<any> | LegacyRef<any>
    /**
     * A function to close the popover.
     */
    closePopover: () => void
}

export type PopoverProps = Pick<UsePopoverReturnType, 'open' | 'overlayProps' | 'popoverProps' | 'triggerProps'> & {
    /**
     * Popover contents.
     * This can be any React element or JSX to render inside the popover.
     */
    children: ReactElement
    /**
     * Properties for the button to which the Popover is attached.
     */
    buttonProps: ButtonProps | null
    /**
     * The React element to which the Popover is attached.
     * @note only use when `triggerElement` is not `Button` component otherwise use `buttonProps`.
     */
    triggerElement: ReactElement | null
}
