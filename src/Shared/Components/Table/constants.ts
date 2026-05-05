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

export const SEARCH_SORT_CHANGE_DEBOUNCE_TIME = 350 /** in ms */

export const LOCAL_STORAGE_EXISTS = !!(Storage && localStorage)

export const LOCAL_STORAGE_KEY_FOR_VISIBLE_COLUMNS = 'generic-table-configurable-columns'

export const BULK_ACTION_GUTTER_LABEL = 'bulk-action-gutter'

export const EVENT_TARGET = new EventTarget()

export const DRAG_SELECTOR_IDENTIFIER = 'table-drag-selector'

export const SHIMMER_DUMMY_ARRAY = [1, 2, 3]

export const NO_ROWS_OR_GET_ROWS_ERROR = new Error('Neither rows nor getRows function provided')

export const ACTION_GUTTER_SIZE = 24
