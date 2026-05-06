import { TooltipProps } from '@Common/Tooltip'

export type SideNavigationItemBase = {
    id: string
    title: string
    dataTestId: string
}

export type SideNavigationItemLink = SideNavigationItemBase & {
    href: string
    items?: never
    tooltipProps?: TooltipProps
}

export type SideNavigationItemGroup = SideNavigationItemBase & {
    items: Omit<SideNavigationItemLink, 'items'>[]
    href?: never
    tooltipProps?: never
}

export interface SideNavigationProps {
    list: (SideNavigationItemLink | SideNavigationItemGroup)[]
}
