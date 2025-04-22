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
    email,
    children,
    rootClassName,
    tooltipContent,
    isUserGroup = false,
}: UserIdentifierProps) => {
    // HOOKS
    const { email: currentUserEmail } = useUserEmail()

    // CONSTANTS
    const isCurrentUser = email === currentUserEmail

    return (
        <div className={`flexbox dc__gap-8 ${rootClassName || ''}`}>
            {email.startsWith(API_TOKEN_PREFIX) ? (
                <UserIdentifierTooltip tooltipContent={tooltipContent}>
                    <Icon name="ic-key" color="N700" size={20} />
                    <div className="flexbox dc__gap-2">
                        <Tooltip
                            {...(tooltipContent
                                ? { content: email, alwaysShowTippyOnHover: false }
                                : { content: email })}
                        >
                            <span className="cn-9 fs-13 fw-4 lh-20 dc__truncate">
                                {isCurrentUser ? 'You' : email.split(':')?.[1] || '-'}
                            </span>
                        </Tooltip>
                        {children}
                    </div>
                </UserIdentifierTooltip>
            ) : (
                <UserIdentifierTooltip tooltipContent={tooltipContent}>
                    {isUserGroup ? (
                        <Icon name="ic-users" color="N700" size={20} />
                    ) : (
                        getAlphabetIcon(email, 'dc__no-shrink m-0-imp')
                    )}
                    <div className="flexbox dc__gap-2">
                        <Tooltip
                            {...(tooltipContent
                                ? { content: email, alwaysShowTippyOnHover: false }
                                : { content: email })}
                        >
                            <span className="cn-9 fs-13 fw-4 lh-20 dc__truncate">{isCurrentUser ? 'You' : email}</span>
                        </Tooltip>
                        {children}
                    </div>
                </UserIdentifierTooltip>
            )}
        </div>
    )
}
