import { Link } from 'react-router-dom'

import { BreadcrumbText, getBreadCrumbSeparator } from './BreadcrumbStore'
import { NestedBreadCrumbProps } from './Types'

export const NestedBreadCrumb = ({ redirectUrl, linkText, profileName }: NestedBreadCrumbProps) => (
    <div className="flex left flex-grow-1">
        <Link
            className="active dc__devtron-breadcrumb__item fs-16 fw-4 lh-1-5 dc__ellipsis-right dc__mxw-155"
            to={redirectUrl}
        >
            {linkText}
        </Link>
        {getBreadCrumbSeparator()}
        <BreadcrumbText heading={profileName} isActive />
    </div>
)
