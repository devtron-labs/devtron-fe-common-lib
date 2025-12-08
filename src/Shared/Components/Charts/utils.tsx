import { ReactNode } from 'react'
import {
    ActiveElement,
    ChartDataset,
    ChartOptions,
    ChartType as ChartJSChartType,
    Point,
    ScaleOptions,
    TooltipLabelStyle,
    TooltipOptions,
} from 'chart.js'

import { AppThemeType } from '@Shared/Providers'

import {
    CHART_AXIS_COLORS,
    CHART_AXIS_LABELS_COLOR,
    CHART_CANVAS_BACKGROUND_COLORS,
    CHART_COLORS,
    CHART_GRID_LINES_COLORS,
    DIS_JOINT_CHART_POINT_RADIUS,
    LINE_DASH,
    MAX_BAR_THICKNESS,
} from './constants'
import {
    ChartColorKey,
    ChartProps,
    ChartType,
    ColorTokensType,
    GetBackgroundAndBorderColorProps,
    GetDefaultOptionsParams,
    SimpleDatasetForLineAndArea,
    TransformDataForChartProps,
    TransformDatasetProps,
    VariantsType,
} from './types'

// Map our chart types to Chart.js types
export const getChartJSType = (type: ChartType): ChartJSChartType => {
    switch (type) {
        case 'area':
        case 'line':
            return 'line'
        case 'pie':
        case 'semiPie':
            return 'doughnut'
        case 'stackedBar':
        case 'stackedBarHorizontal':
            return 'bar'
        default:
            return type as ChartJSChartType
    }
}

const handleChartClick =
    ({
        type,
        onChartClick,
        datasets,
        xAxisLabels,
        setTooltipVisible,
    }: ChartProps & Pick<GetDefaultOptionsParams, 'setTooltipVisible'>) =>
    (_, elements: ActiveElement[]) => {
        if (!elements || elements.length === 0 || !datasets || (Array.isArray(datasets) && datasets.length === 0)) {
            return
        }

        const { datasetIndex, index } = elements[0]

        if (type === 'pie' || type === 'semiPie') {
            if (!datasets.isClickable?.[index]) {
                return
            }

            onChartClick?.(xAxisLabels[index], index)
        } else if (type !== 'area' && type !== 'line') {
            if (!datasets[datasetIndex]?.isClickable) {
                return
            }

            onChartClick?.(datasets[datasetIndex].datasetName, index)
        }
        setTooltipVisible(false)
    }

const handleChartHover =
    ({ type, datasets }: ChartProps): ChartOptions['onHover'] =>
    (_, elements: ActiveElement[], chart) => {
        const { canvas } = chart

        if (!elements || elements.length === 0 || !datasets || (Array.isArray(datasets) && datasets.length === 0)) {
            // eslint-disable-next-line no-param-reassign
            canvas.style.cursor = 'default'
            return
        }

        const { datasetIndex, index } = elements[0]

        if (type === 'pie' || type === 'semiPie') {
            if (!datasets.isClickable?.[index]) {
                // eslint-disable-next-line no-param-reassign
                canvas.style.cursor = 'default'
                return
            }

            // eslint-disable-next-line no-param-reassign
            canvas.style.cursor = 'pointer'
        } else if (type !== 'area' && type !== 'line') {
            if (!datasets[datasetIndex]?.isClickable) {
                // eslint-disable-next-line no-param-reassign
                canvas.style.cursor = 'default'
                return
            }

            // eslint-disable-next-line no-param-reassign
            canvas.style.cursor = 'pointer'
        }
    }

const getScaleTickTitleConfig = (title: string, appTheme: AppThemeType): ScaleOptions<'linear'>['title'] => ({
    display: !!title,
    text: title,
    align: 'center',
    font: {
        family: "'IBM Plex Sans', 'Open Sans', 'Roboto'",
        size: 13,
        lineHeight: '150%',
        weight: 400,
    },
    color: CHART_AXIS_LABELS_COLOR[appTheme],
})

// Get default options based on chart type
export const getDefaultOptions = ({
    chartProps,
    appTheme,
    externalTooltipHandler,
    setTooltipVisible,
}: GetDefaultOptionsParams): ChartOptions => {
    const {
        onChartClick,
        type,
        hideAxis,
        hideXAxisLabels = false,
        xAxisMax,
        yAxisMax,
        xScaleTitle,
        yScaleTitle,
        yScaleTickFormat,
        xScaleTickFormat,
        xAxisLabels,
        tooltipConfig,
    } = chartProps

    const { datasetValueFormatter } = tooltipConfig ?? {}

    const baseOptions: ChartOptions = {
        responsive: true,
        devicePixelRatio: 3,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler,
                ...(datasetValueFormatter
                    ? {
                          callbacks: {
                              label({ dataset, raw }) {
                                  // only number values are expected in raw as input in our types for yAxisValues is number[]
                                  return `${dataset.label}: ${datasetValueFormatter(raw as number)}`
                              },
                          },
                      }
                    : {}),
            },
        },
        elements: {
            line: {
                fill: type === 'area',
                tension: 0,
            },
            bar: {
                borderSkipped: 'start' as const,
                borderWidth: 2,
                borderColor: 'transparent',
                borderRadius: 4,
            },
        },
        ...(onChartClick
            ? {
                  onClick: handleChartClick({ ...chartProps, setTooltipVisible }),
                  onHover: handleChartHover(chartProps),
              }
            : {}),
    }

    const commonScaleConfig = {
        display: !hideAxis,
        border: {
            color: CHART_AXIS_COLORS[appTheme],
        },
        grid: {
            color: CHART_GRID_LINES_COLORS[appTheme],
        },
        ticks: {
            display: !hideXAxisLabels,
            color: CHART_AXIS_LABELS_COLOR[appTheme],
            font: {
                family: "'IBM Plex Sans', 'Open Sans', 'Roboto'",
                size: 12,
                lineHeight: '150%',
                weight: 400,
            },
        },
    } satisfies ScaleOptions<'linear'>

    const commonXScaleConfig = {
        ...commonScaleConfig,
        max: xAxisMax,
        title: getScaleTickTitleConfig(xScaleTitle, appTheme),
        ticks: {
            ...commonScaleConfig.ticks,
            ...((type !== 'stackedBarHorizontal' && typeof xScaleTickFormat === 'function') ||
            (type === 'stackedBarHorizontal' && typeof yScaleTickFormat === 'function')
                ? {
                      callback:
                          type === 'stackedBarHorizontal'
                              ? (value, index) => yScaleTickFormat(Number(value), index)
                              : (_, index) => xScaleTickFormat(xAxisLabels[index], index),
                  }
                : {}),
            autoSkip: false,
        },
    } satisfies ScaleOptions<'linear'>

    const commonYScaleConfig = {
        ...commonScaleConfig,
        max: yAxisMax,
        title: getScaleTickTitleConfig(yScaleTitle, appTheme),
        // for stackedBarHorizon
        ticks: {
            ...commonScaleConfig.ticks,
            ...((type === 'stackedBarHorizontal' && typeof xScaleTickFormat === 'function') ||
            (type !== 'stackedBarHorizontal' && typeof yScaleTickFormat === 'function')
                ? {
                      callback:
                          type !== 'stackedBarHorizontal'
                              ? (value, index) => yScaleTickFormat(Number(value), index)
                              : (_, index) => xScaleTickFormat(xAxisLabels[index], index),
                  }
                : {}),
        },
    } satisfies ScaleOptions<'linear'>

    const commonPieConfig = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            legend: {
                display: false,
                labels: {
                    textAlign: 'left',
                },
                position: 'right',
            },
        },
        cutout: '60%',
        radius: '100%',
    }

    switch (type) {
        case 'area':
        case 'line':
            return {
                ...baseOptions,
                plugins: {
                    ...baseOptions.plugins,
                    tooltip: {
                        mode: 'index',
                        ...baseOptions.plugins.tooltip,
                    },
                },
                interaction: {
                    axis: 'x',
                    intersect: false,
                },
                scales: {
                    y: {
                        ...commonYScaleConfig,
                        stacked: type === 'area',
                        beginAtZero: true,
                    },
                    x: commonXScaleConfig,
                },
            } satisfies ChartOptions<'line'>
        case 'stackedBar':
        case 'stackedBarHorizontal':
            return {
                ...baseOptions,
                plugins: {
                    ...baseOptions.plugins,
                    tooltip: {
                        ...baseOptions.plugins.tooltip,
                        position: 'barElementCenterPositioner',
                    },
                },
                scales: {
                    x: {
                        ...commonXScaleConfig,
                        stacked: true,
                    },
                    y: {
                        ...commonYScaleConfig,
                        stacked: true,
                    },
                },
                datasets: {
                    bar: {
                        maxBarThickness: MAX_BAR_THICKNESS,
                    },
                },
                indexAxis: type === 'stackedBarHorizontal' ? 'y' : 'x',
            } satisfies ChartOptions<'bar'>
        case 'pie':
            return commonPieConfig as ChartOptions<'doughnut'>
        case 'semiPie':
            return {
                ...commonPieConfig,
                cutout: '70%',
                rotation: -90,
                circumference: 180,
            } as ChartOptions<'doughnut'>
        default:
            return baseOptions
    }
}

// Get color value from chart color key
const getColorValue = (colorKey: ChartColorKey, appTheme: AppThemeType): string => CHART_COLORS[appTheme][colorKey]

// Generates a slightly darker shade for a given color key
const getDarkerShadeBy = (colorKey: ChartColorKey, appTheme: AppThemeType, delta: VariantsType = 100): string => {
    // Extract the base color name and shade number
    const colorName = colorKey.replace(/\d+$/, '')
    const shadeMatch = colorKey.match(/\d+$/)
    const currentShade = shadeMatch ? parseInt(shadeMatch[0], 10) : 500

    // Try to get a darker shade (higher number)
    const darkerShade = Math.min(currentShade + delta, 900)
    const borderColorKey = `${colorName}${darkerShade}` as ChartColorKey

    // If the darker shade exists, use it; otherwise, use the current color
    return CHART_COLORS[appTheme][borderColorKey] || CHART_COLORS[appTheme][colorKey]
}

const getBackgroundAndBorderColor = ({ type, dataset, appTheme }: GetBackgroundAndBorderColorProps) => {
    if (type === 'pie' || type === 'semiPie') {
        return {
            backgroundColor: dataset.colors.map((colorKey) => getColorValue(colorKey, appTheme)),
            hoverBackgroundColor: dataset.colors.map((colorKey) => getDarkerShadeBy(colorKey, appTheme)),
            borderColor: CHART_CANVAS_BACKGROUND_COLORS[appTheme],
            borderWidth: 1,
        } satisfies Pick<
            ChartDataset<'doughnut'>,
            'hoverBackgroundColor' | 'backgroundColor' | 'borderColor' | 'borderWidth'
        >
    }

    if (type === 'stackedBar' || type === 'stackedBarHorizontal') {
        return {
            backgroundColor: getColorValue(dataset.color, appTheme),
            hoverBackgroundColor: getDarkerShadeBy(dataset.color, appTheme),
            borderColor: 'transparent',
        } satisfies Pick<ChartDataset<'bar'>, 'backgroundColor' | 'borderColor' | 'hoverBackgroundColor'>
    }

    if (type === 'line') {
        const borderColor = getColorValue(dataset.color, appTheme)

        return {
            backgroundColor: borderColor,
            borderColor,
            pointBackgroundColor: borderColor,
            pointBorderColor: borderColor,
        } satisfies Pick<
            ChartDataset<'line'>,
            'backgroundColor' | 'borderColor' | 'pointBackgroundColor' | 'pointBorderColor'
        >
    }

    // At this point, we know it's an area chart (not pie/semiPie)
    const areaDataset = dataset as SimpleDatasetForLineAndArea
    const bgColor = getColorValue(areaDataset.color, appTheme)

    return {
        backgroundColor(context) {
            const { ctx, chartArea } = context.chart

            if (!chartArea) {
                // happens on initial render
                return null
            }

            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, bgColor)
            gradient.addColorStop(1, CHART_CANVAS_BACKGROUND_COLORS[appTheme])

            return gradient
        },
        borderColor: getDarkerShadeBy(areaDataset.color, appTheme),
        pointBackgroundColor: bgColor,
        pointBorderColor: bgColor,
    } as Pick<ChartDataset<'line'>, 'backgroundColor' | 'borderColor' | 'pointBackgroundColor' | 'pointBorderColor'>
}

const transformDataset = (props: TransformDatasetProps) => {
    const { dataset, type } = props

    const styles = getBackgroundAndBorderColor(props)

    const baseDataset = {
        label: dataset.datasetName,
        data: dataset.yAxisValues,
        ...styles,
    }

    const commonLineAndAreaConfig = {
        ...baseDataset,
        fill: type === 'area',
        pointRadius: ({ dataIndex }) => {
            if (dataIndex === 0 && Number.isNaN(dataset.yAxisValues[dataIndex + 1])) {
                return DIS_JOINT_CHART_POINT_RADIUS
            }
            if (dataIndex === dataset.yAxisValues.length - 1 && Number.isNaN(dataset.yAxisValues[dataIndex - 1])) {
                return DIS_JOINT_CHART_POINT_RADIUS
            }
            return Number.isNaN(dataset.yAxisValues[dataIndex - 1]) && Number.isNaN(dataset.yAxisValues[dataIndex + 1])
                ? DIS_JOINT_CHART_POINT_RADIUS
                : 0
        },
        pointHoverRadius: 8,
        pointHitRadius: 20,
        pointStyle: 'rectRounded',
        borderWidth: 2,
    } as ChartDataset<'line'>

    switch (type) {
        case 'line':
            return {
                ...commonLineAndAreaConfig,
                borderDash: dataset.isDashed ? LINE_DASH : undefined,
            } satisfies ChartDataset<'line'>
        case 'area':
            return commonLineAndAreaConfig
        case 'pie':
        case 'stackedBar':
        case 'stackedBarHorizontal':
        default:
            return baseDataset
    }
}

export const transformDataForChart = (props: TransformDataForChartProps) => {
    const { type, datasets, appTheme } = props

    if (!datasets) {
        // eslint-disable-next-line no-console
        console.error('No datasets provided for chart transformation')
        return []
    }

    if (type !== 'pie' && type !== 'semiPie' && type !== 'area' && !Array.isArray(datasets)) {
        // eslint-disable-next-line no-console
        console.error('Invalid datasets format. Expected an array.')
        return []
    }

    switch (type) {
        /** Not not clubbing it with the default case for better typing */
        case 'pie':
        case 'semiPie':
            return [transformDataset({ type, dataset: datasets, appTheme })]
        case 'area':
            return [transformDataset({ type, dataset: datasets, appTheme })]
        case 'line':
            return datasets.map((dataset) => transformDataset({ type, dataset, appTheme }))
        default:
            return datasets.map((dataset) => transformDataset({ type, dataset, appTheme }))
    }
}

export function* chartColorGenerator() {
    const WEIGHTS: VariantsType[] = [400, 500, 600, 700, 300, 800, 200, 900, 100, 50, 950]
    const TOKENS: ColorTokensType[] = [
        'SkyBlue',
        'DeepPlum',
        'AquaTeal',
        'GoldenYellow',
        'Lavender',
        'CharcoalGray',
        'Magenta',
        'CoralRed',
        'LimeGreen',
        'Slate',
        'Gray',
    ]

    for (let i = 0; i < WEIGHTS.length; i++) {
        for (let j = 0; j < TOKENS.length; j++) {
            // Yield a color key like 'SkyBlue500'
            yield `${TOKENS[j]}${WEIGHTS[i]}` as ChartColorKey
        }
    }
}

const getBorderRadiusForTooltip = (labelBorderRadius: TooltipLabelStyle['borderRadius']) => {
    if (!labelBorderRadius) {
        return null
    }

    if (typeof labelBorderRadius === 'number') {
        return `${labelBorderRadius}px`
    }

    return `${labelBorderRadius.topLeft}px ${labelBorderRadius.topRight}px ${labelBorderRadius.bottomRight}px ${labelBorderRadius.bottomLeft}px`
}

export const buildChartTooltipFromContext = ({
    title,
    body,
    labelColors: labelColorsProp,
}: Pick<Parameters<TooltipOptions['external']>[0]['tooltip'], 'title' | 'body' | 'labelColors'>): ReactNode => {
    const titleLines = title || []
    const bodyLines = body.map((b) => b.lines)
    const labelColors = labelColorsProp || []

    return (
        <div className="flexbox-col dc__overflow-auto mxh-200">
            <div className="flexbox-col dc__gap-2">
                {titleLines.map((titleLine, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <h6 key={index} className="m-0 fs-12 fw-6 lh-20 dc__word-break-all">
                        {titleLine}
                    </h6>
                ))}

                {/* Will show a rounded label color and next it will paste bodyline */}
                {bodyLines.map((bodyLine, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index} className="flexbox dc__gap-4 dc__align-items-center">
                        {labelColors[index] &&
                            typeof labelColors[index].backgroundColor === 'string' &&
                            typeof labelColors[index].borderColor === 'string' && (
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: '12px',
                                        height: '12px',
                                        background: labelColors[index].backgroundColor,
                                        borderColor: labelColors[index].borderColor,
                                        ...(getBorderRadiusForTooltip(labelColors[index].borderRadius)
                                            ? {
                                                  borderRadius: getBorderRadiusForTooltip(
                                                      labelColors[index].borderRadius,
                                                  ),
                                              }
                                            : {}),
                                    }}
                                />
                            )}
                        <span className="fs-12 fw-4 lh-20 dc__truncate">{bodyLine}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const distanceBetweenPoints = (pt1: Point, pt2: Point) => Math.sqrt((pt2.x - pt1.x) ** 2 + (pt2.y - pt1.y) ** 2)
