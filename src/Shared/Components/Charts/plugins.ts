import { Chart, Plugin } from 'chart.js'

import { AppThemeType } from '@Shared/Providers'

import { CHART_COLORS } from './constants'
import { ChartType } from './types'

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

const drawSeparator = (separatorIndex: number, chartType: ChartType, appTheme: AppThemeType) => (chart: Chart) => {
    const { ctx, scales } = chart
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = CHART_COLORS[appTheme].CharcoalGray700
    ctx.lineWidth = 1

    if (chartType === 'stackedBar') {
        // Draw vertical separator after separatorIndex, extend beyond chart area for labels
        if (scales && scales.x) {
            const xValue = scales.x.getPixelForValue(separatorIndex + 0.5)
            // Try to extend line from top to bottom of canvas
            ctx.moveTo(xValue, 0)
            ctx.lineTo(xValue, chart.height)
        }
    } else if (scales && scales.y) {
        // Draw horizontal separator after separatorIndex, extend beyond chart area for labels
        const yValue = scales.y.getPixelForValue(separatorIndex + 0.5)
        ctx.moveTo(0, yValue)
        ctx.lineTo(chart.width, yValue)
    }

    ctx.stroke()
    ctx.restore()
}

export const getSeparatorLinePlugin = (
    separatorIndex: number,
    chartType: ChartType,
    appTheme: AppThemeType,
): Plugin => ({
    id: 'separatorLine',
    afterDraw: drawSeparator(separatorIndex, chartType, appTheme),
    afterDatasetsDraw: drawSeparator(separatorIndex, chartType, appTheme),
})
