import { get } from '@Common/index'
import { SelectPickerCustomOptionType } from '@Shared/Components'
import { API_TOKEN_PREFIX } from '@Shared/constants'
import { stringComparatorBySortOrder } from '@Shared/Helpers'
import { DefaultUserKey } from '@Shared/types'
import { GroupBase } from 'react-select'

// FIXME: Common out the typing and url from dashboard
export const getUserAndApiTokenOptions = async (): Promise<GroupBase<SelectPickerCustomOptionType<string>>[]> => {
    const [{ result: userResponse }, { result: apiTokenResponse }] = await Promise.all([
        get('user/v2'),
        get('api-token'),
    ])

    return [
        {
            label: 'Users',
            options: (userResponse?.users ?? [])
                .sort((a, b) => stringComparatorBySortOrder(a.email_id, b.email_id))
                .filter(({ email_id: emailId }) => emailId !== DefaultUserKey.system)
                .map(({ email_id: emailId }) => ({
                    label: emailId,
                    value: emailId,
                })),
        },
        {
            label: 'API Tokens',
            options: (apiTokenResponse ?? [])
                .sort((a, b) => stringComparatorBySortOrder(a.userIdentifier, b.userIdentifier))
                .map(({ userIdentifier }) => ({
                    // Remove the API Token Prefix
                    label: userIdentifier.startsWith(API_TOKEN_PREFIX) ? userIdentifier.split(':')[1] : userIdentifier,
                    value: userIdentifier,
                })),
        },
    ]
}
