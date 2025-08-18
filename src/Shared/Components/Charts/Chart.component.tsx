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

const Chart = ({ id, type, labels, datasets, className, style }: ChartProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<ChartJS | null>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext('2d')
        if (!ctx) return

        // Destroy existing chart if it exists
        if (chartRef.current) {
            chartRef.current.destroy()
        }

        // Get Chart.js type and transform data
        const chartJSType = getChartJSType(type)
        const transformedData = transformDataForChart(labels, datasets, type)
        const defaultOptions = getDefaultOptions(type)

        // Create new chart
        chartRef.current = new ChartJS(ctx, {
            type: chartJSType,
            data: transformedData,
            options: defaultOptions,
        })
    }, [type, datasets, labels])

    // Cleanup on unmount
    useEffect(
        () => () => {
            if (chartRef.current) {
                chartRef.current.destroy()
                chartRef.current = null
            }
        },
        [],
    )

    return (
        <div className="flex" style={style}>
            <canvas id={id} ref={canvasRef} className={className} />
        </div>
    )
}

export default Chart
