export interface Breadcrumb {
    to: string
    name: string
    className?: string
}

export interface UseBreadcrumbState {
    breadcrumbs: Breadcrumb[]
    setCrumb: (props: { [key: string]: any }) => void
    resetCrumb: (props: string[]) => void
}

export interface AdvancedAlias {
    component: any
    linked: boolean
}

export interface UseBreadcrumbProps {
    sep?: string
    alias?: { [key: string]: AdvancedAlias | any }
}

export interface Breadcrumbs {
    breadcrumbs: Breadcrumb[]
    sep?: string
    className?: string
}

export type UseBreadcrumbOptionalProps = UseBreadcrumbProps | null

export interface BreadcrumbTextProps {
    heading: string
    isActive?: boolean
}
