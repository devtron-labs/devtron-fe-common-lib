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

import { BackdropProps } from '../Backdrop'
import { ButtonProps } from '../Button'

export interface GenericModalProps extends Partial<Pick<BackdropProps, 'onEscape'>> {
    /** Unique identifier for the modal */
    name: string
    /** Controls whether the modal is visible or hidden */
    open: boolean
    /** Callback function triggered when the modal is closed */
    onClose: () => void
    /**
     * Width of the modal (in pixels).
     * @default 600
     */
    width?: 450 | 500 | 600 | 800
    /**
     * Determines if the modal should close when the user clicks outside of it (on the backdrop).
     * @default false
     */
    closeOnBackdropClick?: boolean
}

export interface GenericModalContextType extends Pick<GenericModalProps, 'name' | 'onClose'> {}

export interface GenericModalHeaderProps {
    /** Title text displayed in the modal header */
    title: string
}

export interface GenericModalFooterProps {
    /** Configuration for the buttons displayed in the modal footer */
    buttonConfig?: {
        /** Properties for the primary action button */
        primaryButton?: ButtonProps
        /** Properties for the secondary action button */
        secondaryButton?: ButtonProps
    }
    /** Optional element to be displayed on the left side of the footer */
    leftSideElement?: React.ReactNode
}
