import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'

import { Tooltip } from '@Common/Tooltip'

import { SideNavigationItemLink, SideNavigationProps } from './types'

const NavItem = ({ dataTestId, href, title, tooltipProps }: SideNavigationItemLink) => (
    <Tooltip {...tooltipProps}>
        <NavLink
            to={href}
            data-testid={dataTestId}
            className={(isActive) =>
                `br-4 py-6 px-8 fs-13 lh-20 ${isActive ? 'fw-6 bcb-1 cb-5' : 'fw-4 cn-9 dc__hover-n50'}`
            }
        >
            {title}
        </NavLink>
    </Tooltip>
)

export const SideNavigation = ({ list }: SideNavigationProps) => (
    <div className="flexbox-col">
        {list.map(({ href, items, id, ...item }, index) =>
            items ? (
                <Fragment key={id}>
                    {index > 0 && <div className="divider__secondary--horizontal mt-8 mb-8" />}
                    <h4 data-testid={item.dataTestId} className="m-0 fs-12 lh-20 fw-6 cn-7 dc__uppercase py-4 px-8">
                        {item.title}
                    </h4>
                    {items.map(({ id: subItemId, ...subItem }) => (
                        <NavItem key={subItemId} id={subItemId} {...subItem} />
                    ))}
                </Fragment>
            ) : (
                <NavItem key={id} id={id} href={href} {...item} />
            ),
        )}
    </div>
)
