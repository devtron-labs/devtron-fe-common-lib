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

import React from 'react'
import { SegmentedBarChartProps, Entity } from './types'
import { FALLBACK_ENTITY } from './constants'
import './styles.scss'

const SegmentedBarChart: React.FC<SegmentedBarChartProps> = ({
    entities = [FALLBACK_ENTITY],
    rootClassName,
    countClassName,
    labelClassName,
    isProportional,
}) => {
    const total = entities.reduce((sum, entity) => entity.value + sum, 0)
    const filteredEntities = entities.filter((entity) => entity.value)

    const calcSegmentWidth = (entity: Entity) => `${(entity.value / total) * 100}%`

    const renderLabel = (label: string) => (
        <span className={labelClassName} data-testid={`segmented-bar-chart-${label}-label`}>
            {label}
        </span>
    )

    const renderValue = (value: string | number, label: string) => (
        <span className={countClassName} data-testid={`segmented-bar-chart-${label}-value`}>
            {value}
        </span>
    )

    const renderContent = (entity: Entity) => {
        if (entity.proportionalValue) {
            if (entity.value === 0) {
                return null
            }
            return (
                <>
                    {renderValue(entity.proportionalValue, entity.label)}
                    <div className="flex left dc__gap-6">
                        <span style={{ backgroundColor: entity.color }} className="h-12 dc__border-radius-2 w-4" />
                        {renderLabel(entity.label)}
                    </div>
                </>
            )
        }
        return (
            <>
                <div className="dot" style={{ backgroundColor: entity.color, width: '10px', height: '10px' }} />
                {renderValue(entity.value, entity.label)}
                {renderLabel(entity.label)}
            </>
        )
    }

    return (
        <div className={`flexbox-col w-100 dc__gap-12 ${rootClassName}`}>
            <div className={`flexbox ${isProportional ? 'dc__gap-24' : 'dc__gap-16'}`}>
                {entities?.map((entity) => (
                    <div
                        className={`${entity.proportionalValue ? 'flexbox-col' : 'flexbox  dc__gap-4 dc__align-items-center'}`}
                    >
                        {renderContent(entity)}
                    </div>
                ))}
            </div>
            <div className="flexbox dc__gap-2">
                {filteredEntities?.map((entity, index, map) => (
                    <div
                        key={entity.label}
                        className={`h-8 ${index === 0 ? 'dc__left-radius-4' : ''} ${
                            index === map.length - 1 ? 'dc__right-radius-4' : ''
                        }`}
                        style={{ backgroundColor: entity.color, width: calcSegmentWidth(entity) }}
                    />
                ))}
            </div>
        </div>
    )
}

export default SegmentedBarChart
