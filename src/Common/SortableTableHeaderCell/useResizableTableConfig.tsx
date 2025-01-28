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

import { useEffect, useState } from 'react'
import { UseResizableTableConfigProps } from './types'
import { DEFAULT_MAXIMUM_HEADER_WIDTH, DEFAULT_MINIMUM_HEADER_WIDTH } from './constants'

const useResizableTableConfig = ({ headersConfig }: UseResizableTableConfigProps) => {
    const [headerDimensionsConfig, setHeaderDimensionsConfig] = useState<
        UseResizableTableConfigProps['headersConfig'][number]['width'][]
    >([])

    useEffect(() => {
        setHeaderDimensionsConfig(headersConfig.map((config) => config.width))
    }, [JSON.stringify(headersConfig)])

    const handleResize = (
        headerCellId: UseResizableTableConfigProps['headersConfig'][number]['id'],
        deltaChange: number,
    ) => {
        const headerCellIndexInConfig = headersConfig.findIndex((config) => config.id === headerCellId)

        if (headerCellIndexInConfig < 0) {
            return
        }

        setHeaderDimensionsConfig((prev) => {
            const updatedHeaderDimensionsConfig = structuredClone(prev)
            // Only numbers are supported for v1
            if (typeof updatedHeaderDimensionsConfig[headerCellIndexInConfig] !== 'number') {
                return prev
            }

            const updatedCellDimension = updatedHeaderDimensionsConfig[headerCellIndexInConfig] + deltaChange
            const currentHeaderCellConfig = headersConfig[headerCellIndexInConfig]

            if (
                updatedCellDimension < (currentHeaderCellConfig.minWidth ?? DEFAULT_MINIMUM_HEADER_WIDTH) ||
                updatedCellDimension > (currentHeaderCellConfig.maxWidth ?? DEFAULT_MAXIMUM_HEADER_WIDTH)
            ) {
                return prev
            }

            updatedHeaderDimensionsConfig[headerCellIndexInConfig] = updatedCellDimension
            return updatedHeaderDimensionsConfig
        })
    }

    return {
        gridTemplateColumns: headerDimensionsConfig
            .map((config) => (typeof config === 'number' ? `${config}px` : config))
            .join(' '),
        handleResize,
    }
}

export default useResizableTableConfig
