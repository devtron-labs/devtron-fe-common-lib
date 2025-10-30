import { Plugin } from 'chart.js'

import { AppThemeType } from '@Shared/Providers'

import { CHART_AXIS_LABELS_COLOR, CHART_COLORS } from './constants'
import { CenterTextConfig, ReferenceLineConfigType } from './types'

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

export const drawCenterText = (config: CenterTextConfig, appTheme: AppThemeType): Plugin => ({
    id: 'centerText',
    afterDraw: (chart) => {
        const { ctx, chartArea } = chart
        if (!config?.text) {
            return
        }

        const centerX = (chartArea.left + chartArea.right) / 2

        ctx.save()
        ctx.font = `${config.fontWeight || '600'} ${config.fontSize || 16}px ${config.fontFamily || "'IBM Plex Sans', 'Open Sans', 'Roboto'"}`
        ctx.fillStyle = config.color || CHART_AXIS_LABELS_COLOR[appTheme]
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(config.text, centerX, chartArea.bottom - 20)
        ctx.restore()
    },
})
