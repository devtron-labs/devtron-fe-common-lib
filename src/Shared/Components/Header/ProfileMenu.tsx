import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { getAlphabetIcon } from '@Common/Helper'
import { clearCookieOnLogout } from '@Shared/Helpers'
import { useMainContext } from '@Shared/Providers'

import { Icon } from '../Icon'
import { Popover, usePopover } from '../Popover'
import { ThemeSwitcher } from '../ThemeSwitcher'
import { ProfileMenuProps } from './types'

export const ProfileMenu = ({ user, onClick }: ProfileMenuProps) => {
    // HOOKS
    const { viewIsPipelineRBACConfiguredNode } = useMainContext()

    const { open, overlayProps, popoverProps, triggerProps, scrollableRef, closePopover } = usePopover({
        id: 'profile-menu',
        alignment: 'end',
        width: 250,
    })

    // ELEMENTS
    const triggerElement = useMemo(
        () => (
            <button
                type="button"
                data-testid="profile-button"
                className="dc__transparent bg__secondary border__secondary br-18 flex dc__gap-4 p-4"
                onClick={onClick}
            >
                {getAlphabetIcon(user, 'dc__no-shrink m-0-imp icon-dim-24')}
                <Icon name="ic-caret-down-small" color="N700" rotateBy={open ? 180 : 0} />
            </button>
        ),
        [open],
    )

    // HANDLERS
    const onLogout = () => {
        closePopover()
        clearCookieOnLogout()
    }

    return (
        <Popover
            open={open}
            overlayProps={overlayProps}
            popoverProps={popoverProps}
            triggerProps={triggerProps}
            triggerElement={triggerElement}
            buttonProps={null}
        >
            <div ref={scrollableRef} className="dc__overflow-auto">
                <div className="p-4">
                    <div className="flex dc__content-space dc__gap-8 px-8 py-6">
                        <div>
                            <p className="m-0 fs-13 lh-1-5 fw-4 cn-9 dc__truncate">{user}</p>
                            <p className="m-0 fs-12 lh-1-5 fw-4 cn-7 dc__truncate">{user}</p>
                        </div>
                        {getAlphabetIcon(user, 'dc__no-shrink m-0-imp fs-16 icon-dim-36')}
                    </div>
                </div>
                <div className="px-4 py-2 border__secondary-translucent--top border__secondary-translucent--bottom">
                    <ThemeSwitcher onClick={closePopover} />
                    {viewIsPipelineRBACConfiguredNode}
                </div>
                <div className="p-4">
                    <Link to="/login" className="flex dc__gap-8 px-8 py-6 br-4 dc__hover-r50" onClick={onLogout}>
                        <span className="flex-grow-1 fs-13 lh-1-5 fw-4 cr-5">Logout</span>
                        <Icon name="ic-logout" color="R500" />
                    </Link>
                </div>
            </div>
        </Popover>
    )
}
