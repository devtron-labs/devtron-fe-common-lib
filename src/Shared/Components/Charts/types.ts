export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'horizontalBar' | 'stackedBar'

export interface SimpleDataset {
    label: string
    data: number[]
}

export interface ChartProps {
    id: string
    type: ChartType
    labels: string[]
    datasets: SimpleDataset[]
    className?: string
    style?: React.CSSProperties
}
