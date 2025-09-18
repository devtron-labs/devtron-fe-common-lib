import { ReactNode } from 'react'
import { ChartOptions, TooltipOptions } from 'chart.js'

import { TooltipProps } from '@Common/Tooltip'
import { AppThemeType } from '@Shared/Providers'
import { Never } from '@Shared/types'

export type ChartType = 'area' | 'pie' | 'stackedBar' | 'stackedBarHorizontal' | 'line'

export type ColorTokensType =
    | 'DeepPlum'
    | 'Magenta'
    | 'Slate'
    | 'Lavender'
    | 'SkyBlue'
    | 'AquaTeal'
    | 'LimeGreen'
    | 'CoralRed'
    | 'GoldenYellow'
    | 'CharcoalGray'
    | 'Gray'
export type VariantsType = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

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

export interface ReferenceLineConfigType {
    strokeWidth?: number
    color?: ChartColorKey
    value: number
}

type XYAxisMax = {
    xAxisMax?: number
    yAxisMax?: number
    /**
     * Optional reference lines to draw across the chart
     */
    referenceLines?: ReferenceLineConfigType[]
}

type TypeAndDatasetsType =
    | ({
          type: 'pie'
          /**
           * Needs to be memoized
           */
          datasets: SimpleDatasetForPie
          separatorIndex?: never
      } & Never<XYAxisMax>)
    | ({
          type: 'line'
          datasets: SimpleDatasetForLine[]
          separatorIndex?: never
      } & XYAxisMax)
    | ({
          type: 'area'
          datasets: SimpleDataset[]
          separatorIndex?: never
      } & XYAxisMax)
    | ({
          type: Exclude<ChartType, 'pie' | 'line' | 'area'>
          datasets: SimpleDataset[]
          separatorIndex?: number
      } & XYAxisMax)

export type ChartProps = {
    id: string
    /**
     * The x-axis labels. Needs to be memoized
     */
    xAxisLabels: string[]
    /**
     * Hide the x and y axis and grid lines
     * @default false
     */
    hideAxis?: boolean
    hideXAxisLabels?: boolean
    /**
     * Callback function for chart click events
     */
    onChartClick?: ChartOptions['onClick']
    tooltipConfig?: {
        getTooltipContent?: (args: Parameters<TooltipOptions['external']>[0]) => ReactNode
        /**
         * @default 'top'
         */
        placement?: TooltipProps['placement']
    }
} & TypeAndDatasetsType

export type TransformDatasetProps = {
    appTheme: AppThemeType
} & (
    | {
          type: 'pie'
          dataset: SimpleDatasetForPie
      }
    | {
          type: 'line'
          dataset: SimpleDatasetForLine
      }
    | {
          type: Exclude<ChartType, 'pie' | 'line'>
          dataset: SimpleDataset
      }
)

export type GetBackgroundAndBorderColorProps = TransformDatasetProps

export type TransformDataForChartProps = {
    appTheme: AppThemeType
} & TypeAndDatasetsType

export interface GetDefaultOptionsParams
    extends Pick<ChartProps, 'hideAxis' | 'onChartClick' | 'type' | 'xAxisMax' | 'yAxisMax' | 'hideXAxisLabels'> {
    appTheme: AppThemeType
    externalTooltipHandler: TooltipOptions['external']
}
