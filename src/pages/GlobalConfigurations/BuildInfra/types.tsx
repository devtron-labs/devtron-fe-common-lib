import { ReactNode } from 'react'
import { Breadcrumb } from '../../../Common/BreadCrumb/Types'

export interface DescriptorProps {
    /**
     * In case we want to restrict the max-width
     */
    additionalContainerClasses?: string
    breadCrumbs: Breadcrumb[]
    /**
     * Would stick at right of div
     */
    children?: ReactNode
}

export interface FooterProps {
    disabled?: boolean
}
