import { ChartData, ChartOptions, ChartType as ChartJSChartType } from 'chart.js'

import { ChartType, SimpleDataset } from './types'

const getCSSVariableValue = (variableName: string) => {
    const value = getComputedStyle(document.querySelector('#devtron-base-main-identifier')).getPropertyValue(
        variableName,
    )

    if (!value) {
        // eslint-disable-next-line no-console
        console.error(`CSS variable "${variableName}" not found`)
    }

    return value ?? 'rgba(0, 0, 0, 0.1)'
}

// Map our chart types to Chart.js types
export const getChartJSType = (type: ChartType): ChartJSChartType => {
    switch (type) {
        case 'area':
            return 'line'
        case 'pie':
            return 'doughnut'
        case 'horizontalBar':
        case 'stackedBar':
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
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: false,
            },
        },
    }

    switch (type) {
        case 'area':
            return {
                ...baseOptions,
                elements: {
                    line: {
                        fill: true,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            }
        case 'line':
            return {
                ...baseOptions,
                scales: {
                    x: {
                        grid: {
                            color: getCSSVariableValue('--N50'),
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: getCSSVariableValue('--N50'),
                        },
                    },
                },
            }
        case 'bar':
            return {
                ...baseOptions,
                scales: {
                    x: {
                        grid: {
                            color: getCSSVariableValue('--N50'),
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: getCSSVariableValue('--N50'),
                        },
                    },
                },
            }
        case 'stackedBar':
            return {
                ...baseOptions,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            color: getCSSVariableValue('--N50'),
                        },
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            color: getCSSVariableValue('--N50'),
                        },
                    },
                },
            }
        case 'horizontalBar':
            return {
                ...baseOptions,
                indexAxis: 'y' as const,
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: getCSSVariableValue('--N50'),
                        },
                    },
                },
            }
        case 'pie':
            return {
                ...baseOptions,
                plugins: {
                    ...baseOptions.plugins,
                    legend: {
                        position: 'right' as const,
                    },
                },
            }
        default:
            return baseOptions
    }
}

// Define color palette for consistent styling
const getColorPalette = () => [
    'rgba(54, 162, 235, 0.8)', // Blue
    'rgba(255, 99, 132, 0.8)', // Red
    'rgba(255, 205, 86, 0.8)', // Yellow
    'rgba(75, 192, 192, 0.8)', // Green
    'rgba(153, 102, 255, 0.8)', // Purple
    'rgba(255, 159, 64, 0.8)', // Orange
    'rgba(199, 199, 199, 0.8)', // Grey
    'rgba(83, 102, 255, 0.8)', // Indigo
]

const getBorderColorPalette = () => [
    'rgba(54, 162, 235, 1)', // Blue
    'rgba(255, 99, 132, 1)', // Red
    'rgba(255, 205, 86, 1)', // Yellow
    'rgba(75, 192, 192, 1)', // Green
    'rgba(153, 102, 255, 1)', // Purple
    'rgba(255, 159, 64, 1)', // Orange
    'rgba(199, 199, 199, 1)', // Grey
    'rgba(83, 102, 255, 1)', // Indigo
]

// Transform simple data to Chart.js format with consistent styling
export const transformDataForChart = (labels: string[], datasets: SimpleDataset[], type: ChartType): ChartData => {
    const colors = getColorPalette()
    const borderColors = getBorderColorPalette()

    const transformedDatasets = datasets.map((dataset, index) => {
        const colorIndex = index % colors.length
        const baseDataset = {
            label: dataset.label,
            data: dataset.data,
            backgroundColor: colors[colorIndex],
            borderColor: borderColors[colorIndex],
            borderWidth: 2,
        }

        switch (type) {
            case 'area':
                return {
                    ...baseDataset,
                    fill: true,
                    tension: 0.4,
                    backgroundColor: colors[colorIndex].replace('0.8', '0.2'),
                }
            case 'line':
                return {
                    ...baseDataset,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }
            case 'pie':
                return {
                    ...baseDataset,
                    backgroundColor: colors.slice(0, dataset.data.length),
                    borderColor: borderColors.slice(0, dataset.data.length),
                    borderWidth: 1,
                }
            case 'bar':
            case 'stackedBar':
            case 'horizontalBar':
                return {
                    ...baseDataset,
                    borderRadius: 4,
                }
            default:
                return baseDataset
        }
    })

    return {
        labels,
        datasets: transformedDatasets,
    }
}
