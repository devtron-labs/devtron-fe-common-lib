import { ChartData, ChartDataset, ChartOptions, ChartType as ChartJSChartType } from 'chart.js'

import { LEGENDS_LABEL_CONFIG } from './constants'
import { ChartType, SimpleDataset } from './types'

const getCSSVariableValue = (variableName: string) => {
    const value = getComputedStyle(document.querySelector('#devtron-base-main-identifier')).getPropertyValue(
        variableName,
    )

    if (!value) {
        // eslint-disable-next-line no-console
        console.error(`CSS variable "${variableName}" not found`)
    }

    return value ?? 'transparent'
}

// Map our chart types to Chart.js types
export const getChartJSType = (type: ChartType): ChartJSChartType => {
    switch (type) {
        case 'area':
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
export const getDefaultOptions = (type: ChartType): ChartOptions => {
    const baseOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 3,
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
                fill: true,
                tension: 0.4,
            },
            bar: {
                borderSkipped: 'start' as const,
                borderWidth: 2,
                borderColor: 'transparent',
                borderRadius: 4,
            },
            arc: {
                spacing: 2,
            },
        },
    }

    const gridConfig = {
        color: getCSSVariableValue('--N50'),
    }

    switch (type) {
        case 'area':
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
                        stacked: true,
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
            }
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
            }
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
            }
        default:
            return baseOptions
    }
}

// Generates a palette of pastel HSL colors
const generateColors = (count: number): string[] => {
    const colors: string[] = []
    for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count
        const saturation = 50 // Pastel: 40-60%
        const lightness = 75 // Pastel: 80-90%
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
    }
    return colors
}

// Generates a slightly darker shade for a given HSL color string
const generateCorrespondingBorderColor = (hsl: string): string => {
    // Parse hsl string: hsl(hue, saturation%, lightness%)
    const match = hsl.match(/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/)
    if (!match) throw new Error('Invalid HSL color format')
    const hue = Number(match[1])
    const saturation = Number(match[2])
    let lightness = Number(match[3])
    lightness = Math.max(0, lightness - 15) // Clamp to 0
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// Transform simple data to Chart.js format with consistent styling
export const transformDataForChart = (labels: string[], datasets: SimpleDataset[], type: ChartType): ChartData => {
    const colors = generateColors(type === 'pie' ? datasets[0].data.length : datasets.length)

    const transformedDatasets = datasets.map((dataset, index) => {
        const colorIndex = index % colors.length
        const baseDataset = {
            label: dataset.label,
            data: dataset.data,
            backgroundColor: colors[colorIndex],
        }

        switch (type) {
            case 'area':
                return {
                    ...baseDataset,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 10,
                    pointHitRadius: 20,
                    pointStyle: 'rectRounded',
                    pointBorderWidth: 0,
                    borderWidth: 2,
                    borderColor: generateCorrespondingBorderColor(colors[colorIndex]),
                } as ChartDataset<'line'>
            case 'pie':
                return {
                    ...baseDataset,
                    backgroundColor: colors.slice(0, dataset.data.length),
                }
            case 'stackedBar':
            case 'stackedBarHorizontal':
            default:
                return baseDataset
        }
    })

    return {
        labels,
        datasets: transformedDatasets,
    }
}
