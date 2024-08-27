import { get, getUrlWithSearchParams } from '@Common/index'
import { SelectPickerCustomOptionType } from '@Shared/Components'
import { API_TOKEN_PREFIX } from '@Shared/constants'
import { stringComparatorBySortOrder } from '@Shared/Helpers'
import { DefaultUserKey, BaseFilterQueryParams } from '@Shared/types'
import { GroupBase } from 'react-select'

// FIXME: Common out the typing and url from dashboard
export const getUserAndApiTokenOptions = async (): Promise<GroupBase<SelectPickerCustomOptionType<string>>[]> => {
    const userUrl = getUrlWithSearchParams('user/v2', {
        showAll: true,
    } as BaseFilterQueryParams<never>)

    const [userPromise, apiTokenPromise] = await Promise.allSettled([get(userUrl), get('api-token')])

    const options: GroupBase<SelectPickerCustomOptionType<string>>[] = []

    if (userPromise.status === 'fulfilled') {
        const { result: userResponse } = userPromise.value

        options.push({
            label: 'Users',
            options: (userResponse?.users ?? [])
                .sort((a, b) => stringComparatorBySortOrder(a.email_id, b.email_id))
                .filter(({ email_id: emailId }) => emailId !== DefaultUserKey.system)
                .map(({ email_id: emailId }) => ({
                    label: emailId,
                    value: emailId,
                })),
        })
    }

    if (apiTokenPromise.status === 'fulfilled') {
        const { result: apiTokenResponse } = apiTokenPromise.value

        options.push({
            label: 'API Tokens',
            options: (apiTokenResponse ?? [])
                .sort((a, b) => stringComparatorBySortOrder(a.userIdentifier, b.userIdentifier))
                .map(({ userIdentifier }) => ({
                    // Remove the API Token Prefix
                    label: userIdentifier.startsWith(API_TOKEN_PREFIX) ? userIdentifier.split(':')[1] : userIdentifier,
                    value: userIdentifier,
                })),
        })
    }

    return options
}
