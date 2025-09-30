import { Link } from 'react-router-dom'

import { BreadcrumbText, getBreadCrumbSeparator } from './BreadcrumbStore'

export const NestedBreadCrumb = ({
    redirectUrl,
    linkText,
    profileName,
}: {
    redirectUrl: string
    linkText: string
    profileName: string
}) => (
    <div className="flex left">
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
