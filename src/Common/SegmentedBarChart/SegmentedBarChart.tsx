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
import { motion } from 'framer-motion'
import { SegmentedBarChartProps, Entity } from './types'
import { FALLBACK_ENTITY } from './constants'
import './styles.scss'

const SegmentedBarChart: React.FC<SegmentedBarChartProps> = ({
    entities: userEntities = [FALLBACK_ENTITY],
    rootClassName,
    countClassName,
    labelClassName,
    isProportional,
    swapLegendAndBar = false,
    showAnimationOnBar = false,
    isLoading,
}) => {
    const entities = isLoading ? [FALLBACK_ENTITY] : userEntities
    const total = entities.reduce((sum, entity) => entity.value + sum, 0)
    const filteredEntities = entities.filter((entity) => !!entity.value)

    const calcSegmentWidth = (entity: Entity) => `${(entity.value / total) * 100}%`

    const renderLabel = (label: Entity['label']) =>
        isLoading ? (
            <div className="shimmer w-120" />
        ) : (
            <span className={labelClassName} data-testid={`segmented-bar-chart-${label}-label`}>
                {label}
            </span>
        )

    const renderValue = (value: Entity['value'], label: Entity['label']) =>
        isLoading ? (
            <div className="shimmer w-64 lh-1-5 h-24" />
        ) : (
            <span className={countClassName} data-testid={`segmented-bar-chart-${label}-value`}>
                {isProportional ? `${value}/${total}` : value}
            </span>
        )

    const renderContent = () => {
        if (isProportional) {
            return filteredEntities.map((entity, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={idx} className={`flexbox-col ${isLoading ? 'dc__gap-10' : ''}`}>
                    {renderValue(entity.value, entity.label)}

                    <div className="flex left dc__gap-6">
                        {!isLoading && (
                            <span style={{ backgroundColor: entity.color }} className="h-12 dc__border-radius-2 w-4" />
                        )}

                        {renderLabel(entity.label)}
                    </div>
                </div>
            ))
        }

        return entities.map((entity, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={idx} className="flexbox  dc__gap-4 dc__align-items-center">
                {!isLoading && (
                    <div className="dot" style={{ backgroundColor: entity.color, width: '10px', height: '10px' }} />
                )}

                {renderValue(entity.value, entity.label)}

                {renderLabel(entity.label)}
            </div>
        ))
    }

    const renderLegend = () => (
        <div className={`flexbox flex-wrap dc__row-gap-4 ${isProportional ? 'dc__gap-24' : 'dc__gap-16'}`}>
            {renderContent()}
        </div>
    )

    const renderBar = () => (
        <motion.div
            {...(showAnimationOnBar
                ? {
                      initial: { width: 0 },
                      animate: { width: '100%' },
                      transition: { duration: 0.6 },
                  }
                : {})}
            className="flexbox dc__gap-2"
        >
            {filteredEntities.map((entity, index, map) => (
                <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className={`h-8 ${index === 0 ? 'dc__left-radius-4' : ''} ${
                        index === map.length - 1 ? 'dc__right-radius-4' : ''
                    } ${isLoading ? 'shimmer' : ''}`}
                    style={{ backgroundColor: entity.color, width: calcSegmentWidth(entity) }}
                />
            ))}
        </motion.div>
    )

    if (!entities.length) {
        return null
    }

    return (
        <div className={`flexbox-col w-100 dc__gap-12 ${rootClassName}`}>
            {swapLegendAndBar ? (
                <>
                    {renderBar()}
                    {renderLegend()}
                </>
            ) : (
                <>
                    {renderLegend()}
                    {renderBar()}
                </>
            )}
        </div>
    )
}

export default SegmentedBarChart
