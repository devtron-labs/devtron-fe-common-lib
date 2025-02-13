/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ReactElement, ReactNode } from 'react'
import { TooltipProps } from '@Common/Tooltip'
import { TippyCustomizedProps } from '@Common/Types'

export type LabelOrAriaLabelType =
    | {
          label: ReactNode
          ariaLabel?: never
      }
    | {
          label?: never
          ariaLabel: string
      }

type LayoutType = 'row' | 'column'

export type FormFieldLabelProps<Layout extends LayoutType = LayoutType> = LabelOrAriaLabelType & {
    /**
     * If true, the field is required and * is shown with the label
     */
    required?: boolean
    /**
     * Id of the input element
     */
    inputId: string
    /**
     * Layout of the field
     */
    layout?: Layout
} & (Layout extends 'row'
        ? {
              /**
               * Tooltip configuration for the label in row layout
               */
              labelTooltipConfig?: Omit<TooltipProps, 'alwaysShowTippyOnHover' | 'showOnTruncate' | 'shortcutKeyCombo'>
              labelTippyCustomizedConfig?: never
          }
        : {
              labelTooltipConfig?: never
              /**
               * Tippy configuration for the label in column layout
               */
              labelTippyCustomizedConfig?: Pick<
                  TippyCustomizedProps,
                  'heading' | 'infoText' | 'documentationLink' | 'documentationLinkText'
              >
          })

export interface FormFieldInfoProps extends Pick<FormFieldLabelProps, 'inputId'> {
    /**
     * Error message for the field
     */
    error?: ReactNode
    /**
     * Helper text for the field
     */
    helperText?: ReactNode
    /**
     * Warning message for the field
     */
    warningText?: ReactNode
}

export interface FormInfoItemProps {
    id: FormFieldLabelProps['inputId']
    text: FormFieldInfoProps['error']
    textClass: string
    icon: ReactElement
}

export interface FormFieldWrapperProps
    extends Pick<
            FormFieldLabelProps,
            'label' | 'required' | 'ariaLabel' | 'layout' | 'labelTippyCustomizedConfig' | 'labelTooltipConfig'
        >,
        FormFieldInfoProps {
    /**
     * If true, the field takes the full width of the parent
     */
    fullWidth?: boolean
    children: ReactElement
    borderRadiusConfig?: {
        /**
         * If false, the top border radius is not applied
         *
         * @default true
         */
        top?: boolean
        /**
         * If false, the right border radius is not applied
         *
         * @default true
         */
        right?: boolean
        /**
         * If false, the bottom border radius is not applied
         *
         * @default true
         */
        bottom?: boolean
        /**
         * If false, the left border radius is not applied
         *
         * @default true
         */
        left?: boolean
    }
}
