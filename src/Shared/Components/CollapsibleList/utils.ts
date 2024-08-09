import { NavLinkProps } from 'react-router-dom'

/**
 * Determines if a navigation link is active based on the current location.
 *
 * This function checks if the provided `href` matches the current location's pathname
 * and/or search query, and returns a boolean indicating whether the link should be considered active.
 *
 * @param href - The target URL or path to compare against the current location.
 *
 * @returns A function that takes the current location and returns a boolean:
 * - `true` if the `href` matches the current location's pathname and/or search query.
 * - `false` otherwise.
 */
export const checkNavLinkActiveState =
    (href: string): NavLinkProps['isActive'] =>
    (_, location) => {
        const [pathString, queryString] = href.split('?')

        if (pathString && queryString) {
            return `${location.pathname}${location.search}` === href
        }
        if (pathString) {
            return location.pathname === pathString
        }
        if (queryString) {
            return location.search === `?${queryString}`
        }
        return false
    }
