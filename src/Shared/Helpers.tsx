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
import {
    ApiQueuingBatchStatusType,
    ApiQueuingWithBatchResponseItem,
    BatchConfigType,
    GitTriggers,
    WebhookEventNameType,
} from './types'
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

const eachCall = (batchConfig, functionCalls, resolve, reject, shouldRejectOnError) => {
    const callIndex = batchConfig.lastIndex
    Promise.resolve(functionCalls[callIndex]())
        .then((result) => {
            // eslint-disable-next-line no-param-reassign
            batchConfig.results[callIndex] = { status: ApiQueuingBatchStatusType.FULFILLED, value: result }
        })
        .catch((error) => {
            // eslint-disable-next-line no-param-reassign
            batchConfig.results[callIndex] = { status: ApiQueuingBatchStatusType.REJECTED, reason: error }
        })
        .finally(() => {
            if (shouldRejectOnError && batchConfig.results[callIndex].status === ApiQueuingBatchStatusType.REJECTED) {
                reject(batchConfig.results[callIndex].reason)
                return
            }

            // eslint-disable-next-line no-plusplus, no-param-reassign
            batchConfig.completedCalls++
            if (batchConfig.lastIndex < functionCalls.length) {
                eachCall(batchConfig, functionCalls, resolve, reject, shouldRejectOnError)
                // eslint-disable-next-line no-plusplus, no-param-reassign
                batchConfig.lastIndex++
            } else if (batchConfig.completedCalls === functionCalls.length) {
                resolve(batchConfig.results)
            }
        })
}

/**
 * Executes a batch of function calls concurrently with queuing.
 * @param functionCalls The array of function calls returning promise to be executed.
 * @param batchSize The maximum number of function calls to be executed concurrently. Defaults to the value of `window._env_.API_BATCH_SIZE`.
 * @param shouldRejectOnError If set to true, the promise will reject if any of the function calls rejects, i.e, acts like Promise.all else Promise.allSettled . Defaults to false.
 * @returns A promise that resolves to a array of objects containing the status and value of the batch execution.
 */
export const ApiQueuingWithBatch = <T,>(
    functionCalls,
    httpProtocol: string,
    shouldRejectOnError: boolean = false,
    batchSize: number = window._env_.API_BATCH_SIZE,
): Promise<ApiQueuingWithBatchResponseItem<T>[]> => {
    if (!batchSize || batchSize <= 0) {
        // eslint-disable-next-line no-param-reassign
        batchSize = ['http/0.9', 'http/1.0', 'http/1.1'].indexOf(httpProtocol) !== -1 ? 5 : 30
    }

    return new Promise((resolve, reject) => {
        if (functionCalls.length === 0) {
            resolve([])
        }
        const batchConfig: BatchConfigType = {
            lastIndex: 0,
            concurrentCount: batchSize,
            results: functionCalls.map(() => null),
            completedCalls: 0,
        }
        for (
            let index = 0;
            index < batchConfig.concurrentCount && index < functionCalls.length;
            index++, batchConfig.lastIndex++
        ) {
            eachCall(batchConfig, functionCalls, resolve, reject, shouldRejectOnError)
        }
    })
}
