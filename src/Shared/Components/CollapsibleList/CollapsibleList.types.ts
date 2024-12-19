import React from 'react'
import { TippyProps } from '@tippyjs/react'
import { NavLinkProps } from 'react-router-dom'

interface ButtonTab {
    /**
     * Is tab active ( for button tab )
     */
    isActive: boolean
    /**
     * The callback function to handle click events on the button.
     */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    href?: never
}

interface NavLinkTab extends Pick<NavLinkProps, 'isActive'> {
    /**
     * The URL of the nav link.
     */
    href: string
    /**
     * The callback function to handle click events on the nav link.
     */
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export type TabOptions = 'button' | 'navLink'

type ConditionalTabType<TabType extends TabOptions> = TabType extends 'button' ? ButtonTab : NavLinkTab

export type CollapsibleListItem<TabType extends TabOptions = 'navLink'> = ConditionalTabType<TabType> & {
    /**
     * The title of the list item.
     */
    title: string
    /**
     * The subtitle of the list item.
     */
    subtitle?: string
    /**
     * If true, the title will be rendered with line-through.
     */
    strikeThrough?: boolean
    /**
     * Configuration for the icon.
     */
    iconConfig?: {
        /**
         * A React component representing an icon to be displayed with the list item.
         */
        Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
        /**
         * Properties for the icon component.
         */
        props?: React.SVGProps<SVGSVGElement>
        /**
         * Properties for the tooltip component of the icon.
         */
        tooltipProps?: TippyProps
    }
    /**
     * If `true`, clears query parameters during navigation.
     *
     * @default false
     */
    clearQueryParamsOnNavigation?: boolean
}

export interface CollapsibleListConfig<TabType extends TabOptions = 'navLink'> {
    /**
     * The unique identifier for the collapsible list.
     */
    id: string
    /**
     * The header text for the collapsible list.
     */
    header: string
    /**
     * Configuration for the header icon.
     */
    headerIconConfig?: {
        /**
         * A React component representing an icon button to be displayed with the header.
         */
        Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
        /**
         * Properties for the header icon component.
         */
        props?: React.SVGProps<SVGSVGElement>
        /**
         * Properties for the header icon button component.
         */
        btnProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
        /**
         * Properties for the tooltip component of the icon.
         */
        tooltipProps?: TippyProps
    }
    /**
     * Text to display when there are no items in the list.
     * @default 'No items found.'
     */
    noItemsText?: string
    /**
     * An array of items to be displayed in the collapsible list.
     */
    items: CollapsibleListItem<TabType>[]
    /**
     * Boolean indicating whether the list is expanded or not.
     */
    isExpanded?: boolean
}

export interface CollapsibleListProps<TabType extends TabOptions = 'navLink'> {
    /**
     * An array of collapsible list configurations.
     */
    config: CollapsibleListConfig<TabType>[]
    /**
     * Type of tab list: button or navLink
     */
    tabType: TabType
    /**
     * Function to handle the collapse button click event.
     *
     * @param id - The unique identifier for the item to collapse.
     * @param e - The mouse event triggered by the button click.
     *
     */
    onCollapseBtnClick?: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void
}
