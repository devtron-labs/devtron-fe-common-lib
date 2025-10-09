import { ReactNode } from 'react'
import { TooltipOptions, TooltipPositionerFunction } from 'chart.js'

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
    color: ChartColorKey
    isClickable?: boolean
}

export interface SimpleDatasetForLineAndArea extends Omit<SimpleDataset, 'isClickable'> {
    isDashed?: boolean
}

export interface SimpleDatasetForPie extends BaseSimpleDataset {
    colors: Array<ChartColorKey>
    isClickable?: boolean[]
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

type OnChartClickHandler = (datasetName: string, value: number) => void

export type TypeAndDatasetsType =
    | ({
          type: 'pie'
          /**
           * Needs to be memoized
           */
          datasets: SimpleDatasetForPie
          onChartClick?: OnChartClickHandler
          yScaleTickFormat?: never
      } & Never<XYAxisMax>)
    | ({
          type: 'line'
          datasets: SimpleDatasetForLineAndArea[]
          onChartClick?: never
          yScaleTickFormat?: (value: number) => string
      } & XYAxisMax)
    | ({
          type: 'area'
          datasets: SimpleDatasetForLineAndArea
          /* onChartClick is not applicable for area charts */
          onChartClick?: never
          yScaleTickFormat?: (value: number) => string
      } & XYAxisMax)
    | ({
          type: Exclude<ChartType, 'pie' | 'line' | 'area'>
          datasets: SimpleDataset[]
          onChartClick?: OnChartClickHandler
          yScaleTickFormat?: (value: number) => string
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
    tooltipConfig?: {
        getTooltipContent?: (args: Parameters<TooltipOptions['external']>[0]) => ReactNode
        /**
         * @default 'top'
         */
        placement?: TooltipProps['placement']
    }
    /** A title for x axis */
    xScaleTitle?: string
    /** A title for y axis */
    yScaleTitle?: string
} & TypeAndDatasetsType

export type TransformDatasetProps = {
    appTheme: AppThemeType
} & (
    | {
          type: 'pie'
          dataset: SimpleDatasetForPie
      }
    | {
          type: 'line' | 'area'
          dataset: SimpleDatasetForLineAndArea
      }
    | {
          type: Exclude<ChartType, 'pie' | 'line' | 'area'>
          dataset: SimpleDataset
      }
)

export type GetBackgroundAndBorderColorProps = TransformDatasetProps

export type TransformDataForChartProps = {
    appTheme: AppThemeType
} & TypeAndDatasetsType

export interface GetDefaultOptionsParams {
    chartProps: ChartProps
    appTheme: AppThemeType
    externalTooltipHandler: TooltipOptions['external']
}

declare module 'chart.js' {
    interface TooltipPositionerMap {
        barElementCenterPositioner: TooltipPositionerFunction<'bar'>
    }
}
