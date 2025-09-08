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

/**
 * A versatile Chart component that renders different types of charts using Chart.js.
 * Supports area charts, pie charts, stacked bar charts (vertical/horizontal), and line charts.
 *
 * The component automatically adapts to theme changes and provides consistent styling
 * across all chart types. Colors are provided by the user through the CHART_COLORS constant
 * or custom color tokens.
 *
 * @example
 * ```tsx
 * [Area Chart Example]
 * <Chart
 *   id="quarterly-growth"
 *   type="area"
 *   xAxisLabels={['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023']}
 *   datasets={[{
 *     datasetName: 'Revenue Growth (%)',
 *     yAxisValues: [15.2, 18.7, 22.3, 19.8],
 *     backgroundColor: 'LavenderPurple300'
 *   }]}
 * />
 *
 * [Pie Chart Example]
 * <Chart
 *   id="technology-adoption"
 *   type="pie"
 *   xAxisLabels={['React', 'Vue.js', 'Angular']}
 *   datasets={{
 *     datasetName: 'Adoption Rate (%)',
 *     yAxisValues: [45.2, 28.7, 35.4],
 *     backgroundColor: ['SkyBlue300', 'AquaTeal400', 'LavenderPurple300']
 *   }}
 * />
 *
 * [Line Chart Example (non-stacked, non-filled)]
 * <Chart
 *   id="traffic-trends"
 *   type="line"
 *   xAxisLabels={['Jan', 'Feb', 'Mar', 'Apr']}
 *   datasets={[{
 *     datasetName: 'Website Traffic',
 *     yAxisValues: [120, 190, 300, 500],
 *     borderColor: 'SkyBlue500'
 *   }]}
 * />
 *
 * [Stacked Bar Chart Example]
 * <Chart
 *   id="team-allocation"
 *   type="stackedBar"
 *   xAxisLabels={['Q1', 'Q2', 'Q3', 'Q4']}
 *   datasets={[
 *     {
 *       datasetName: 'Frontend',
 *       yAxisValues: [120, 150, 180, 200],
 *       backgroundColor: 'SkyBlue600'
 *     },
 *     {
 *       datasetName: 'Backend',
 *       yAxisValues: [80, 100, 120, 140],
 *       backgroundColor: 'AquaTeal600'
 *     }
 *   ]}
 * />
 * ```
 *
 * @param id - Unique identifier for the chart canvas element
 * @param type - Chart type: 'area', 'pie', 'stackedBar', 'stackedBarHorizontal', or 'line'
 * @param xAxisLabels - Array of labels for the x-axis (or categories for pie charts)
 * @param datasets - Chart data: array of datasets for most charts, single dataset object for pie charts
 *
 * @performance
 * **Memoization Recommendations:**
 * - `xAxisLabels`: Should be memoized with useMemo() if derived from complex calculations
 * - `datasets`: Should be memoized with useMemo() as it contains arrays and objects that cause re-renders
 * - Avoid passing inline objects or arrays directly to these props
 *
 * @example
 * ```tsx
 * [Good: Memoized props prevent unnecessary re-renders]
 * const labels = useMemo(() => quarters.map(q => `Q${q}`), [quarters])
 * const chartDatasets = useMemo(() => [
 *   {
 *     datasetName: 'Revenue',
 *     yAxisValues: revenueData,
 *     backgroundColor: 'LavenderPurple300'
 *   }
 * ], [revenueData])
 *
 * return <Chart id="revenue-chart" type="area" xAxisLabels={labels} datasets={chartDatasets} />
 * ```
 *
 * @notes
 * - Chart automatically re-renders when theme changes (light/dark mode)
 * - Line charts are rendered as non-stacked and non-filled by default
 * - Pie charts expect a single dataset object instead of an array
 * - Colors should reference CHART_COLORS tokens for consistency
 * - Component destroys and recreates Chart.js instance on prop changes for optimal performance
 */
const Chart = (props: ChartProps) => {
    /** Using this technique for typing in transformDataForChart */
    const { id, xAxisLabels: labels, hideAxis = false, customPlugins = [], onChartClick, ...typeAndDatasets } = props
    const { type, datasets } = typeAndDatasets

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
        const transformedData = { labels, datasets: transformDataForChart({ ...typeAndDatasets, appTheme }) }
        const defaultOptions = getDefaultOptions({ type, appTheme, hideAxis, onChartClick })

        chartRef.current = new ChartJS(ctx, {
            type: chartJSType,
            data: transformedData,
            options: defaultOptions,
            plugins: [...customPlugins],
        })

        return () => {
            chartRef.current.destroy()
        }
    }, [type, datasets, labels, appTheme, hideAxis])

    return (
        <div className="h-100 w-100">
            <canvas id={id} ref={canvasRef} />
        </div>
    )
}

export default Chart
