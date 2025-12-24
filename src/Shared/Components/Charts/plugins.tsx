import { RefObject } from 'react'
import { render } from 'react-dom'
import { LegendItem, Plugin } from 'chart.js'

import { Tooltip } from '@Common/Tooltip'
import { AppThemeType } from '@Shared/Providers'

import { CHART_AXIS_LABELS_COLOR, CHART_COLORS } from './constants'
import { CenterTextConfig, ChartType, HTMLLegendProps, ReferenceLineConfigType } from './types'

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

const HTMLLegend = ({ backgroundColor, label, onClick, strikeThrough, variant }: HTMLLegendProps) => (
    <button className="flex left dc__gap-6 dc__outline-none m-0 p-0 dc__transparent" onClick={onClick} type="button">
        <div
            className={`${variant === 'square' ? 'w-14 h-14' : 'h-2 w-16'} br-4 dc__no-shrink`}
            style={{ backgroundColor }}
        />

        <Tooltip content={label}>
            <span
                className={`fs-13 cn-9 font-ibm-plex-sans fw-4 lh-1-5 dc__truncate ${strikeThrough ? 'dc__strike-through' : ''}`}
            >
                {label}
            </span>
        </Tooltip>
    </button>
)

export const htmlLegendPlugin = (id: string, ref: RefObject<HTMLDivElement>, type: ChartType): Plugin => ({
    id,
    afterUpdate(chart) {
        const getOnClickHandler = (item: LegendItem) => () => {
            if (type === 'pie') {
                // Pie and doughnut charts only have a single dataset and visibility is per item
                chart.toggleDataVisibility(item.index)
            } else {
                chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
            }
            chart.update()
        }

        render(
            chart.options.plugins.legend.labels
                .generateLabels(chart)
                .map((item) => (
                    <HTMLLegend
                        key={item.text}
                        backgroundColor={item.fillStyle.toString()}
                        label={item.text}
                        strikeThrough={item.hidden}
                        onClick={getOnClickHandler(item)}
                        variant={type === 'line' ? 'line' : 'square'}
                    />
                )),
            ref.current,
        )
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
        ctx.font = `${config.fontWeight || '600'} ${config.fontSize || 24}px ${config.fontFamily || "'IBM Plex Sans', 'Open Sans', 'Roboto'"}`
        ctx.fillStyle = config.color || CHART_AXIS_LABELS_COLOR[appTheme]
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(config.text, centerX, chartArea.bottom - 20)
        ctx.restore()
    },
})
