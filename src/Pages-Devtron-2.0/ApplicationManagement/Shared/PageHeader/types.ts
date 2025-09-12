export type BreadcrumbKey = 'overview'

export interface BreadcrumbConfig {
    key: BreadcrumbKey
    route: string
    heading: string
}

export interface BreadcrumbAlias {
    [key: string]: {
        component: React.ReactNode
        linked: boolean
    } | null
}
