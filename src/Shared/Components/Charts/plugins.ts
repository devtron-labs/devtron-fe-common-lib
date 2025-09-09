import { Plugin } from 'chart.js'

import { AppThemeType } from '@Shared/Providers'

import { CHART_COLORS } from './constants'

export const getAverageLinePlugin = (averageValue: number, appTheme: AppThemeType): Plugin => ({
    id: 'averageLine',
    afterDraw: (chart) => {
        const { ctx, chartArea, scales } = chart
        if (!scales || !scales.y || !averageValue) {
            return
        }
        const yValue = scales.y.getPixelForValue(averageValue)
        ctx.save()
        ctx.beginPath()
        ctx.setLineDash([6, 6])
        ctx.strokeStyle = CHART_COLORS[appTheme].CharcoalGray700
        ctx.lineWidth = 1
        ctx.moveTo(chartArea.left, yValue)
        ctx.lineTo(chartArea.right, yValue)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
    },
})
