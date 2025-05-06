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

export { CannotDeleteModal } from './CannotDeleteModal'
export { BaseConfirmationModal, default as ConfirmationModal } from './ConfirmationModal'
export { ConfirmationModalProvider } from './ConfirmationModalContext'
export { DeleteConfirmationModal } from './DeleteConfirmationModal'
export { ForceDeleteConfirmationModal } from './ForceDeleteConfirmationModal'
export { type ConfirmationModalProps, ConfirmationModalVariantType, type DeleteConfirmationModalProps } from './types'
export { getConfirmationLabel } from './utils'
