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

import { ReactElement } from 'react'

export interface EditImageFormFieldProps {
    /**
     * Fallback icon to be shown when image is not available
     */
    defaultIcon: ReactElement
    /**
     * Would be shown below input, there are two types of error messages:
     * External - Error message handled from state above and would propagate to parent through handleError
     * Internal - Error message handled internally and would not propagate to parent, like empty preview URL
     */
    errorMessage: string
    /**
     * Would be called when there is an error in the image URL during handleChange or handlePreviewImage
     */
    handleError: (error: string) => void
    /**
     * The current value of input field
     */
    url: string
    /**
     * Would be called when the URL is changed in the input field
     */
    handleURLChange: (url: string) => void
    /**
     * The alt text for the image
     */
    altText: string
    /**
     * Prefix for aria-label
     */
    ariaLabelPrefix: string
    /**
     * Prefix for data-testid
     */
    dataTestIdPrefix: string
}

export interface FallbackImageProps extends Pick<EditImageFormFieldProps, 'defaultIcon'> {
    showEditIcon: boolean
}
