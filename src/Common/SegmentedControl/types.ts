import { TooltipProps } from '@Common/Tooltip'
import { IconsProps, SelectPickerOptionType } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { RefObject } from 'react'

type SegmentTooltipProps = Omit<
    TooltipProps,
    'alwaysShowTippyOnHover' | 'showOnTruncate' | 'shortcutKeyCombo' | 'placement'
>

export type SegmentType = Pick<SelectPickerOptionType, 'value'> & {
    /**
     * If true, the segment will be in error state with error icon
     */
    isError?: boolean
} & (
        | ({
              /**
               * Label for the segment
               *
               * Note: Either of label or icon is required
               */
              label: SelectPickerOptionType['label']
              /**
               * Icon for the segment
               *
               * Note: Either of label or icon is required
               */
              icon?: IconsProps['name']
              /**
               * Tooltip props for the segment
               *
               * Note: Required if only icon is provided
               */
              tooltipProps?: SegmentTooltipProps
              ariaLabel?: never
          } & Pick<SelectPickerOptionType, 'label'>)
        | {
              label?: never
              tooltipProps: SegmentTooltipProps
              icon: IconsProps['name']
              /**
               * Aria label for the segment
               */
              ariaLabel: string
          }
    )

export type SegmentedControlProps = {
    /**
     * List of segments to be displayed
     */
    segments: SegmentType[]
    name: string
    size?: Extract<ComponentSizeType, ComponentSizeType.xs | ComponentSizeType.small | ComponentSizeType.medium>
    fullWidth?: boolean
} & (
    | {
          value?: never
          /**
           * On change handler for the component
           */
          onChange?: (selectedSegment: SegmentType) => void
      }
    | {
          /**
           * If defined, the component is controlled and onChange needs to be handled by the parent
           */
          value: SegmentType['value']
          onChange: (selectedSegment: SegmentType) => void
      }
)

export interface SegmentProps
    extends Required<Pick<SegmentedControlProps, 'name' | 'onChange' | 'fullWidth' | 'size'>> {
    isSelected: boolean
    segment: SegmentType
    selectedSegmentRef: RefObject<HTMLDivElement> | undefined
}
