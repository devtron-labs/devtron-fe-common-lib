import React from 'react'
import { SegmentedBarChartProps, Entity } from './types'
import { FALLBACK_ENTITY } from './constants'
import './styles.scss'

const SegmentedBarChart: React.FC<SegmentedBarChartProps> = ({ entities = [FALLBACK_ENTITY], rootClassName }) => {
    const total = entities.reduce((sum, entity) => entity.value + sum, 0)

    const calcSegmentWidth = (entity: Entity) => {
        if (!entity.value) {
            return '100%'
        }
        return `${entity.value / total}%`
    }

    return (
        <div className={`flexbox-col dc__gap-12 ${rootClassName}`}>
            <div className="flexbox dc__gap-16">
                {entities?.map((entity) => (
                    <div className="flexbox dc__gap-4">
                        <div className="dot" />
                        <span>{entity.value}</span>
                        <span>{entity.label}</span>
                    </div>
                ))}
            </div>
            <div className="flexbox dc__gap-2 rounded-ends">
                {entities?.map((entity) => (
                    <div
                        key={entity.label}
                        className="h-8"
                        style={{ backgroundColor: entity.color, width: calcSegmentWidth(entity) }}
                    />
                ))}
            </div>
        </div>
    )
}

export default SegmentedBarChart
