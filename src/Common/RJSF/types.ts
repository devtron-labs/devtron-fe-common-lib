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

import { ComponentProps } from 'react'
import RJSFForm from '@rjsf/core'
import { StrictRJSFSchema } from '@rjsf/utils'

export interface MetaHiddenType {
    value: any
    path: string
}

export type HiddenType =
    | MetaHiddenType
    | {
          condition: any
          value: string
      }
    | string

export interface RJSFFormSchema extends StrictRJSFSchema {
    properties?: {
        [key: string]: RJSFFormSchema
    }
    hidden?: HiddenType
    updatePath?: string
}

export type FormProps = Omit<ComponentProps<typeof RJSFForm<any, RJSFFormSchema>>, 'validator'>

export interface UpdateFormDataFromFormStateProps {
    /**
     * formData is data that is being passed from the user
     */
    formData: Record<string, unknown>
    /**
     * formState is the latest state of the form
     */
    formState: Record<string, unknown>
    schemaPathToUpdatePathMap: Record<string, string>
}

export interface GetFormStateFromFormDataProps
    extends Pick<UpdateFormDataFromFormStateProps, 'formData' | 'schemaPathToUpdatePathMap'> {}
