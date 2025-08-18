export type ChartType = 'area' | 'pie' | 'stackedBar' | 'stackedBarHorizontal'

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
