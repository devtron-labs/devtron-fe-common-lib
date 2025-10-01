import React from 'react'
import { Link } from 'react-router-dom'

import { BreadcrumbText, getBreadCrumbSeparator } from './BreadcrumbStore'
import { NestedBreadCrumbProps } from './Types'

export const NestedBreadCrumb = ({ redirectUrl, linkText, profileName }: NestedBreadCrumbProps) => {
    const breadcrumbLinkClass = 'active dc__devtron-breadcrumb__item fs-16 fw-4 lh-1-5 dc__ellipsis-right dc__mxw-155'

    const breadcrumbs = [
        { type: 'link', label: linkText, to: redirectUrl },
        { type: 'link', label: 'Profiles', to: redirectUrl },
        { type: 'text', label: profileName },
    ]

    return (
        <div className="flex left flex-grow-1 dc__gap-4">
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.label}>
                    {crumb.type === 'link' ? (
                        <Link to={crumb.to!} className={breadcrumbLinkClass}>
                            {crumb.label}
                        </Link>
                    ) : (
                        <BreadcrumbText heading={crumb.label} isActive />
                    )}
                    {index < breadcrumbs.length - 1 && getBreadCrumbSeparator()}
                </React.Fragment>
            ))}
        </div>
    )
}
