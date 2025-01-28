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

import { COLOR_MAPPING } from './constants'
import {
    BulkOperationResultType,
    BulkOperationResultWithIdType,
    FailedOperationType,
    OperationResultStoreType,
} from './types'

export class OperationResultStore implements OperationResultStoreType {
    private size: number

    private results: BulkOperationResultWithIdType[] = []

    private map: Map<number, BulkOperationResultWithIdType> = new Map()

    private retryOperations: FailedOperationType['retryOperation'][] = []

    private retryOperationsSet: Set<number> = new Set()

    private barChartEntities: Record<BulkOperationResultType['status'], number> = {
        Completed: 0,
        Failed: 0,
        Progressing: 0,
        Pending: 0,
    }

    #hasAnyOperationFailed: boolean = false

    #hasAnyOperationSucceeded: boolean = false

    constructor(size: number) {
        this.size = size
        this.barChartEntities.Pending = size
    }

    private updateStatus = (id: number, result: BulkOperationResultType) => {
        if (result.status === 'Completed' && !this.#hasAnyOperationSucceeded) {
            this.#hasAnyOperationSucceeded = true
        }

        if (result.status === 'Failed' && !this.#hasAnyOperationFailed) {
            this.#hasAnyOperationFailed = true
        }

        if (result.status === 'Failed' && result.retryOperation && this.retryOperationsSet.has(id)) {
            this.retryOperations.push(result.retryOperation)
            this.retryOperationsSet.add(id)
        }

        if (result.status !== 'Progressing') {
            if (this.barChartEntities[result.status]) {
                this.barChartEntities[result.status] += 1
            } else {
                this.barChartEntities[result.status] = 1
            }
        }

        this.barChartEntities.Pending =
            this.size - (this.barChartEntities.Failed ?? 0) - (this.barChartEntities.Completed ?? 0)

        if (this.barChartEntities.Pending <= 0) {
            delete this.barChartEntities.Pending
        }
    }

    public addResult: OperationResultStoreType['addResult'] = (result: BulkOperationResultType) => {
        const clone = structuredClone(result)
        const id = this.results.length

        const res = { ...clone, id }
        this.results.push(res)
        this.map.set(id, res)

        this.updateStatus(id, res)

        return id
    }

    public getResults: OperationResultStoreType['getResults'] = (sortComparator) =>
        sortComparator ? [...this.results].sort(sortComparator) : this.results

    public getBarChartEntities: OperationResultStoreType['getBarChartEntities'] = () =>
        Object.entries(this.barChartEntities)
            .filter(([key, value]) => COLOR_MAPPING[key] && !!value)
            .map(([key, value]) => ({
                color: COLOR_MAPPING[key],
                label: key,
                value,
            }))

    public getResultsStatusCount: OperationResultStoreType['getResultsStatusCount'] = () => ({
        ...this.barChartEntities,
    })

    public getSize: OperationResultStoreType['getSize'] = () => this.map.size

    public updateResultStatus: OperationResultStoreType['updateResultStatus'] = (id, result) => {
        const res = this.map.get(id)

        const newData = { ...res, ...result }
        this.map.set(id, newData)
        this.results[id] = newData

        if (result.status === 'Failed' && result.retryOperation) {
            this.retryOperations.push(result.retryOperation)
        }

        this.updateStatus(id, newData)
    }

    public getRetryOperations: OperationResultStoreType['getRetryOperations'] = () => this.retryOperations

    public hasAnyOperationFailed: OperationResultStoreType['hasAnyOperationFailed'] = () => this.#hasAnyOperationFailed

    public getHasAnyOperationSucceeded: OperationResultStoreType['getHasAnyOperationSucceeded'] = () =>
        this.#hasAnyOperationSucceeded
}
