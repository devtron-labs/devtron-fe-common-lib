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
    sidenav: 'bg__transparent',
}

export const VARIANT_TO_HOVER_CLASS_MAP: Record<TreeViewProps['variant'], string> = {
    primary: 'bg__hover--opaque',
    secondary: 'bg__hover-secondary--opaque',
    sidenav: 'bg__hover-sidenav-subsection-item',
}

export const VARIANT_TO_SELECTED_CLASS_MAP: Record<TreeViewProps['variant'], string> = {
    primary: 'bcb-1',
    secondary: 'bcb-1',
    sidenav: 'bg__sidenav-subsection-item',
}

export const VARIANT_TO_TEXT_CLASS_MAP: Record<TreeViewProps['variant'], string> = {
    primary: 'cn-9',
    secondary: 'cn-9',
    sidenav: 'text__sidenav',
}

export const VARIANT_TO_TREE_ITEM_ACTIVE_BG_CLASS_MAP: Record<TreeViewProps['variant'], string> = {
    primary: 'bcb-1',
    secondary: 'bcb-1',
    sidenav: 'bg__sidenav-subsection-item',
}
