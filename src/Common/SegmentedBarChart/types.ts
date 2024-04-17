export type Entity = {
    color: string
    label: string
    value: number
}

export interface SegmentedBarChartProps {
    entities: NonNullable<Entity[]>
    rootClassName?: string
    countClassName?: string
    labelClassName?: string
}
