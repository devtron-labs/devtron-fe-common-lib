import { useEffect, useRef } from 'react'
import {
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    DoughnutController,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js'

import { noop } from '@Common/Helper'
import { useTheme } from '@Shared/Providers'

import { LEGENDS_LABEL_CONFIG } from './constants'
import { ChartProps } from './types'
import { getChartJSType, getDefaultOptions, transformDataForChart } from './utils'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    DoughnutController,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
)

/**
 * The doughnut chart overrides the default legend label configuration.
 * Therefore need to set the custom legend label configuration.
 */
ChartJS.overrides.doughnut.plugins.legend.labels = {
    ...ChartJS.overrides.doughnut.plugins.legend.labels,
    ...LEGENDS_LABEL_CONFIG,
}

const Chart = ({ id, type, xAxisLabels: labels, datasets }: ChartProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<ChartJS | null>(null)

    /** Trigger a re-render when the theme changes to reflect the latest changes */
    const { appTheme } = useTheme()

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d')

        if (!ctx) {
            return noop
        }

        // Get Chart.js type and transform data
        const chartJSType = getChartJSType(type)
        const transformedData = { labels, datasets: transformDataForChart(type, datasets, appTheme) }
        const defaultOptions = getDefaultOptions(type, appTheme)

        // Create new chart
        chartRef.current = new ChartJS(ctx, {
            type: chartJSType,
            data: transformedData,
            options: defaultOptions,
        })

        return () => {
            chartRef.current.destroy()
        }
    }, [type, datasets, labels, appTheme])

    return (
        <div className="h-100 w-100">
            <canvas id={id} ref={canvasRef} />
        </div>
    )
}

export default Chart
