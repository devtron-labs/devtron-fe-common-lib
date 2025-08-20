import { ChartDataset, ChartOptions, ChartType as ChartJSChartType } from 'chart.js'

import { AppThemeType } from '@Shared/Providers'

import {
    CHART_CANVAS_BACKGROUND_COLORS,
    CHART_COLORS,
    CHART_GRID_LINES_COLORS,
    LEGENDS_LABEL_CONFIG,
} from './constants'
import { ChartColorKey, ChartProps, ChartType, SimpleDataset, SimpleDatasetForLine, SimpleDatasetForPie } from './types'

// Map our chart types to Chart.js types
export const getChartJSType = (type: ChartType): ChartJSChartType => {
    switch (type) {
        case 'area':
        case 'line':
            return 'line'
        case 'pie':
            return 'doughnut'
        case 'stackedBar':
        case 'stackedBarHorizontal':
            return 'bar'
        default:
            return type as ChartJSChartType
    }
}

// Get default options based on chart type
export const getDefaultOptions = (type: ChartType, appTheme: AppThemeType): ChartOptions => {
    const baseOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: LEGENDS_LABEL_CONFIG,
            },
            title: {
                display: false,
            },
        },
        elements: {
            line: {
                fill: type === 'area',
                tension: 0.4,
            },
            bar: {
                borderSkipped: 'start' as const,
                borderWidth: 2,
                borderColor: 'transparent',
                borderRadius: 4,
            },
            arc: {
                spacing: 12,
                borderRadius: 4,
                borderWidth: 0,
            },
        },
    }

    const gridConfig = {
        color: CHART_GRID_LINES_COLORS[appTheme],
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
                    },
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false,
                },
                scales: {
                    y: {
                        stacked: type === 'area',
                        beginAtZero: true,
                        grid: gridConfig,
                    },
                    x: {
                        grid: gridConfig,
                    },
                },
            } as ChartOptions<'line'>
        case 'stackedBar':
            return {
                ...baseOptions,
                scales: {
                    x: {
                        stacked: true,
                        grid: gridConfig,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: gridConfig,
                    },
                },
            } as ChartOptions<'bar'>
        case 'stackedBarHorizontal':
            return {
                ...baseOptions,
                indexAxis: 'y' as const,
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                        grid: gridConfig,
                    },
                    y: {
                        stacked: true,
                        grid: gridConfig,
                    },
                },
            } as ChartOptions<'bar'>
        case 'pie':
            return {
                ...baseOptions,
                plugins: {
                    ...baseOptions.plugins,
                    legend: {
                        position: 'right',
                        align: 'center',
                    },
                },
                cutout: '60%',
                radius: '80%',
            } as ChartOptions<'doughnut'>
        default:
            return baseOptions
    }
}

// Get color value from chart color key
const getColorValue = (colorKey: ChartColorKey, appTheme: AppThemeType): string => CHART_COLORS[appTheme][colorKey]

// Generates a slightly darker shade for a given color key
const generateCorrespondingBorderColor = (colorKey: ChartColorKey): string => {
    // Extract the base color name and shade number
    const colorName = colorKey.replace(/\d+$/, '')
    const shadeMatch = colorKey.match(/\d+$/)
    const currentShade = shadeMatch ? parseInt(shadeMatch[0], 10) : 500

    // Try to get a darker shade (higher number)
    const darkerShade = Math.min(currentShade + 200, 800)
    const borderColorKey = `${colorName}${darkerShade}` as ChartColorKey

    // If the darker shade exists, use it; otherwise, use the current color
    return CHART_COLORS[borderColorKey] || CHART_COLORS[colorKey]
}

const getBackgroundAndBorderColor = (
    type: ChartType,
    dataset: SimpleDataset | SimpleDatasetForPie | SimpleDatasetForLine,
    appTheme: AppThemeType,
) => {
    if (type === 'pie') {
        return {
            backgroundColor: (dataset as SimpleDatasetForPie).backgroundColor.map((colorKey) =>
                getColorValue(colorKey, appTheme),
            ),
            borderColor: 'transparent',
        }
    }

    if (type === 'line') {
        const borderColor = getColorValue((dataset as SimpleDatasetForLine).borderColor, appTheme)

        return {
            backgroundColor: borderColor,
            borderColor,
        }
    }

    if (type === 'area') {
        const bgColor = getColorValue((dataset as SimpleDataset).backgroundColor, appTheme)

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
            borderColor: generateCorrespondingBorderColor((dataset as SimpleDataset).backgroundColor),
        } as Pick<ChartDataset<'line'>, 'backgroundColor' | 'borderColor'>
    }

    return {
        backgroundColor: getColorValue((dataset as SimpleDataset).backgroundColor, appTheme),
        borderColor: 'transparent',
    }
}

const transformDataset = (
    type: ChartType,
    dataset: SimpleDataset | SimpleDatasetForPie | SimpleDatasetForLine,
    appTheme: AppThemeType,
) => {
    const { backgroundColor, borderColor } = getBackgroundAndBorderColor(type, dataset, appTheme)

    const baseDataset = {
        label: dataset.datasetName,
        data: dataset.yAxisValues,
        backgroundColor,
        borderColor,
    }

    switch (type) {
        case 'line':
        case 'area':
            return {
                ...baseDataset,
                fill: type === 'area',
                pointRadius: 0,
                pointHoverRadius: 10,
                pointHitRadius: 20,
                pointStyle: 'rectRounded',
                pointBorderWidth: 0,
                borderWidth: 2,
            } as ChartDataset<'line'>
        case 'pie':
        case 'stackedBar':
        case 'stackedBarHorizontal':
        default:
            return baseDataset
    }
}

export const transformDataForChart = (type: ChartType, datasets: ChartProps['datasets'], appTheme: AppThemeType) => {
    if (!datasets) {
        // eslint-disable-next-line no-console
        console.error('No datasets provided for chart transformation')
        return []
    }

    if (type === 'pie') {
        return [transformDataset(type, datasets as SimpleDatasetForPie, appTheme)]
    }

    if (!Array.isArray(datasets)) {
        // eslint-disable-next-line no-console
        console.error('Invalid datasets format. Expected an array.')
        return []
    }

    return datasets.map((dataset: SimpleDatasetForLine | SimpleDataset) => transformDataset(type, dataset, appTheme))
}
