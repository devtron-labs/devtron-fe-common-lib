import { CHART_COLORS } from '@Shared/Components/Charts'
import { useTheme } from '@Shared/Providers/ThemeProvider'

import { ChartTooltipProps } from './types'

export const LoadingDonutChart = () => (
    <div className="flex p-20 dc__gap-20 h-200">
        <div className="dc__border-radius-50-per h-150 w-150 shimmer" />
        <div className="flexbox-col dc__gap-8">
            <span className="shimmer w-80px" />
            <span className="shimmer w-80px" />
        </div>
    </div>
)

export const ChartTooltip = ({ title, label, value, chartColorKey }: ChartTooltipProps) => {
    const { appTheme } = useTheme()
    const backgroundColor = CHART_COLORS[appTheme][chartColorKey]
    return (
        <div className="dc__mxw-200 flexbox-col dc__gap-8 py-6 px-10 fw-4">
            {title && <span className="fw-6">{title}</span>}
            <div className="flexbox dc__gap-4">
                <div className="py-4">
                    <div className="icon-dim-12 br-2" style={{ backgroundColor }} />
                </div>
                <div className="flexbox-col dc__gap-12">
                    <span>
                        {label}:&nbsp;{value}
                    </span>
                </div>
            </div>
        </div>
    )
}

export const ChartColorIndicator = ({ title, backgroundColor }: { title: string; backgroundColor: string }) => (
    <div className="flexbox dc__gap-4">
        <div className="py-4">
            <div className="icon-dim-12 br-2" style={{ backgroundColor }} />
        </div>
        <span>{title}</span>
    </div>
)
