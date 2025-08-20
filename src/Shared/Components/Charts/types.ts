export type ChartType = 'area' | 'pie' | 'stackedBar' | 'stackedBarHorizontal' | 'line'

type ColorTokensType = 'DeepPlum' | 'Magenta' | 'Slate' | 'LavenderPurple' | 'SkyBlue' | 'AquaTeal'

type VariantsType = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800

export type ChartColorKey = `${ColorTokensType}${VariantsType}`

export type ChartTypeWithoutPie = Exclude<ChartType, 'pie'>

interface BaseSimpleDataset {
    datasetName: string
    yAxisValues: number[]
}

export interface SimpleDataset extends BaseSimpleDataset {
    backgroundColor: ChartColorKey
}

export interface SimpleDatasetForPie extends BaseSimpleDataset {
    backgroundColor: Array<ChartColorKey>
}

export interface SimpleDatasetForLine extends BaseSimpleDataset {
    borderColor: ChartColorKey
}

export type ChartProps = {
    id: string
    /**
     * The x-axis labels. Needs to be memoized
     */
    xAxisLabels: string[]
} & (
    | {
          type: 'pie'
          /**
           * Needs to be memoized
           */
          datasets: SimpleDatasetForPie
      }
    | {
          type: 'line'
          datasets: SimpleDatasetForLine[]
      }
    | {
          type: Exclude<ChartType, 'pie' | 'line'>
          datasets: SimpleDataset[]
      }
)
