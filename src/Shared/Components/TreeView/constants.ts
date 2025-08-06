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

import { TreeViewProps } from './types'

export const DEFAULT_NO_ITEMS_TEXT = 'No items found'

export const VARIANT_TO_BG_CLASS_MAP: Record<TreeViewProps['variant'], string> = {
    primary: 'bg__primary',
    secondary: 'bg__secondary',
}

export const VARIANT_TO_HOVER_CLASS_MAP: Record<TreeViewProps['variant'], string> = {
    primary: 'bg__hover--opaque',
    secondary: 'bg__hover-secondary--opaque',
}
