import { getAlphabetIcon } from '@Common/Helper'
import { Tooltip } from '@Common/Tooltip'
import { API_TOKEN_PREFIX } from '@Shared/constants'
import { useUserEmail } from '@Shared/Providers'

import { Icon } from '../Icon'
import { UserIdentifierProps } from './types'

const UserIdentifierTooltip = ({
    children,
    tooltipContent,
}: Pick<UserIdentifierProps, 'children' | 'tooltipContent'>) => (
    <Tooltip alwaysShowTippyOnHover={!!tooltipContent} content={tooltipContent}>
        <div className="flexbox dc__gap-8 dc__align-items-center">{children}</div>
    </Tooltip>
)

export const UserIdentifier = ({
    identifier,
    children,
    rootClassName,
    tooltipContent,
    isUserGroup = false,
    displayYouLabelForCurrentUser = true,
}: UserIdentifierProps) => {
    // HOOKS
    const { email: currentUserEmail } = useUserEmail()

    if (!identifier) {
        return null
    }

    // CONSTANTS
    const isCurrentUser = identifier === currentUserEmail
    const isApiToken = identifier.startsWith(API_TOKEN_PREFIX)

    const renderIcon = () => {
        if (isApiToken) {
            return <Icon name="ic-key" color="N700" size={20} />
        }

        return isUserGroup ? (
            <Icon name="ic-users" color="N700" size={20} />
        ) : (
            getAlphabetIcon(identifier, 'dc__no-shrink m-0-imp')
        )
    }

    const renderText = () => {
        if (isCurrentUser && displayYouLabelForCurrentUser) {
            return 'You'
        }

        if (isApiToken) {
            return identifier.split(':')?.[1] || '-'
        }

        return identifier
    }

    return (
        <div className={`flexbox dc__gap-8 ${rootClassName || ''}`}>
            <UserIdentifierTooltip tooltipContent={tooltipContent}>
                {renderIcon()}
                <div className="flexbox dc__gap-2">
                    <Tooltip
                        {...(tooltipContent
                            ? { content: identifier, alwaysShowTippyOnHover: false }
                            : { content: identifier })}
                    >
                        <span className="cn-9 fs-13 fw-4 lh-20 dc__truncate">{renderText()}</span>
                    </Tooltip>
                    {children}
                </div>
            </UserIdentifierTooltip>
        </div>
    )
}
