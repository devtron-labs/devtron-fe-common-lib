import { ReactNode } from 'react'

export interface UserIdentifierProps {
    identifier: string
    children?: ReactNode
    isUserGroup?: boolean
    rootClassName?: string
    /**
     * @description - If given, would show tooltip on div containing avatar, email and children
     */
    tooltipContent?: string
    /**
     * Controls whether to display "You" text for the current user
     * @default true
     */
    displayYouLabelForCurrentUser?: boolean
}
