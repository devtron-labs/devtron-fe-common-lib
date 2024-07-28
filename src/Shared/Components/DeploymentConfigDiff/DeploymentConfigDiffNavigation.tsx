import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { ReactComponent as ICInfoOutlined } from '@Icons/ic-info-outlined.svg'
import { ReactComponent as ICDiffFileUpdated } from '@Icons/ic-diff-file-updated.svg'

import { CollapsibleList } from '../CollapsibleList'
import { DeploymentConfigDiffNavigationProps } from './types'

// LOADING SHIMMER
const ShimmerText = ({ width }: { width: string }) => (
    <div className={`p-8 h-32 w-${width}`}>
        <div className="shimmer-loading w-100 h-100" />
    </div>
)

export const DeploymentConfigDiffNavigation = ({
    isLoading,
    collapsibleNavList,
    navList,
    goBackURL,
    navHeading,
    navHelpText,
}: DeploymentConfigDiffNavigationProps) => {
    // STATES
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

    useEffect(() => {
        setExpandedIds(collapsibleNavList.reduce((acc, curr) => ({ ...acc, [curr.id]: !!curr.items.length }), {}))
    }, [collapsibleNavList])

    /** Collapsible List Config. */
    const collapsibleListConfig = collapsibleNavList.map(({ items, ...resListItem }) => ({
        ...resListItem,
        isExpanded: expandedIds[resListItem.id],
        items: items.map(({ hasDiff, ...resItem }) => ({
            ...resItem,
            ...(hasDiff
                ? {
                      iconConfig: {
                          Icon: ICDiffFileUpdated,
                          props: { className: 'icon-dim-16 dc__no-shrink' },
                      },
                  }
                : {}),
        })),
    }))

    // METHODS
    /** Handles collapse button click. */
    const onCollapseBtnClick = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    // RENDERERS
    const renderTopContent = () => (
        <div className="p-12 flexbox dc__align-items-center dc__gap-8 dc__border-bottom-n1">
            {goBackURL && (
                <Link to={goBackURL}>
                    <span className="dc__border br-4 p-1 flex bcn-50">
                        <ICClose className="icon-dim-16 fcn-6" />
                    </span>
                </Link>
            )}
            <span className="fs-13 lh-20 fw-6 dc__truncate">{navHeading}</span>
        </div>
    )

    const renderContent = () => (
        <>
            {navList.map(({ title, href, onClick, hasDiff }) => (
                <NavLink
                    key={title}
                    data-testid="env-deployment-template"
                    className="dc__nav-item cursor dc__gap-8 fs-13 lh-32 cn-7 w-100 br-4 px-8 flexbox dc__align-items-center dc__content-space dc__no-decor"
                    to={href}
                    onClick={onClick}
                >
                    <span className="dc__truncate">{title}</span>
                    {hasDiff && <ICDiffFileUpdated className="icon-dim-16 dc__no-shrink" />}
                </NavLink>
            ))}
            <CollapsibleList config={collapsibleListConfig} onCollapseBtnClick={onCollapseBtnClick} />
            {navHelpText && (
                <div className="mt-8 py-6 px-8 flexbox dc__align-items-center dc__gap-8">
                    <span className="flex p-2 dc__align-self-start">
                        <ICInfoOutlined className="icon-dim-16 fcn-6" />
                    </span>
                    <p className="m-0 fs-12 lh-1-5 cn-9">{navHelpText}</p>
                </div>
            )}
        </>
    )

    const renderLoading = () => ['90', '70', '50'].map((item) => <ShimmerText key={item} width={item} />)

    return (
        <div className="bcn-0 dc__border-right">
            {renderTopContent()}
            <div className="mw-none p-8">{isLoading ? renderLoading() : renderContent()}</div>
        </div>
    )
}
