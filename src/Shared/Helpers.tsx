/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MaterialInfo, SortingOrder } from '../Common'
import { GitTriggers, WebhookEventNameType } from './types'
import { ReactComponent as ICPullRequest } from '../Assets/Icon/ic-pull-request.svg'
import { ReactComponent as ICTag } from '../Assets/Icon/ic-tag.svg'
import { ReactComponent as ICWebhook } from '../Assets/Icon/ic-webhook.svg'

interface HighlightSearchTextProps {
    /**
     * The text to be highlighted
     */
    searchText: string
    /**
     * The whole text string
     */
    text: string
    /**
     * The classes to be applied to the highlighted text
     */
    highlightClasses?: string
}

// Disabling default export since this is a helper function and we would have to export a lot of functions in future.
export const highlightSearchText = ({ searchText, text, highlightClasses }: HighlightSearchTextProps): string => {
    if (!searchText) {
        return text
    }

    try {
        const regex = new RegExp(searchText, 'gi')
        return text.replace(regex, (match) => `<span class="${highlightClasses}">${match}</span>`)
    } catch (error) {
        return text
    }
}

export const preventBodyScroll = (lock: boolean): void => {
    if (lock) {
        document.body.style.overflowY = 'hidden'
        document.body.style.height = '100vh'
        document.documentElement.style.overflow = 'initial'
    } else {
        document.body.style.overflowY = null
        document.body.style.height = null
        document.documentElement.style.overflow = null
    }
}

const getIsMaterialInfoValid = (materialInfo: MaterialInfo): boolean =>
    !!(
        materialInfo.webhookData ||
        materialInfo.author ||
        materialInfo.message ||
        materialInfo.modifiedTime ||
        materialInfo.revision
    )

export const getIsMaterialInfoAvailable = (materialInfo: MaterialInfo[]) =>
    !!materialInfo?.every(getIsMaterialInfoValid)

export const getGitCommitInfo = (materialInfo: MaterialInfo): GitTriggers => ({
    Commit: materialInfo.revision,
    Author: materialInfo.author,
    Date: materialInfo.modifiedTime,
    Message: materialInfo.message,
    WebhookData: JSON.parse(materialInfo.webhookData),
    Changes: [],
    GitRepoUrl: '',
    GitRepoName: '',
    CiConfigureSourceType: '',
    CiConfigureSourceValue: '',
})

export const stringComparatorBySortOrder = (
    a: string,
    b: string,
    sortOrder: SortingOrder = SortingOrder.ASC,
    isCaseSensitive: boolean = true,
): number => {
    if (isCaseSensitive) {
        return sortOrder === SortingOrder.ASC ? a.localeCompare(b) : b.localeCompare(a)
    }

    return sortOrder === SortingOrder.ASC
        ? a.toLowerCase().localeCompare(b.toLowerCase())
        : b.toLowerCase().localeCompare(a.toLowerCase())
}

export const numberComparatorBySortOrder = (
    a: number,
    b: number,
    sortOrder: SortingOrder = SortingOrder.ASC,
): number => (sortOrder === SortingOrder.ASC ? a - b : b - a)

export const getWebhookEventIcon = (eventName: WebhookEventNameType) => {
    switch (eventName) {
        case WebhookEventNameType.PULL_REQUEST:
            return <ICPullRequest className="icon-dim-12" />
        case WebhookEventNameType.TAG_CREATION:
            return <ICTag className="icon-dim-12" />
        default:
            return <ICWebhook className="icon-dim-12" />
    }
}

export const isNullOrUndefined = (value: unknown): boolean => value === null || value === undefined

export const getKeyToBooleanMapFromArray = <T extends string | number>(arr: T[] = []) =>
    arr.reduce<Record<T, boolean>>(
        (acc, key) => {
            acc[key] = true
            return acc
        },
        {} as Record<T, boolean>,
    )
