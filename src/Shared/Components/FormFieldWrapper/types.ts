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
import { BorderConfigType, ComponentLayoutType } from '@Shared/types'

export type LabelOrAriaLabelType =
    | {
          label: ReactNode
          ariaLabel?: never
      }
    | {
          label?: never
          ariaLabel: string
      }

export type FormFieldLabelProps = LabelOrAriaLabelType & {
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
    layout?: ComponentLayoutType
}

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
    extends Pick<FormFieldLabelProps, 'label' | 'required' | 'ariaLabel' | 'layout'>,
        FormFieldInfoProps {
    /**
     * If true, the field takes the full width of the parent
     */
    fullWidth?: boolean
    children: ReactElement
    borderRadiusConfig?: BorderConfigType
}
