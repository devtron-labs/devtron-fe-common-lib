import { Plugin } from 'chart.js'

import { AppThemeType } from '@Shared/Providers'

import { CHART_COLORS } from './constants'
import { ReferenceLineConfigType } from './types'

export const drawReferenceLine = (config: ReferenceLineConfigType, id: string, appTheme: AppThemeType): Plugin => ({
    id,
    afterDraw: (chart) => {
        const { ctx, chartArea, scales } = chart
        if (!scales || !scales.y || !config?.value) {
            return
        }
        const yValue = scales.y.getPixelForValue(config.value)
        ctx.save()
        ctx.beginPath()
        ctx.setLineDash([6, 6])
        ctx.strokeStyle = CHART_COLORS[appTheme][config.color ?? 'CharcoalGray700']
        ctx.lineWidth = config.strokeWidth ?? 1
        ctx.moveTo(chartArea.left, yValue)
        ctx.lineTo(chartArea.right, yValue)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
    },
})
