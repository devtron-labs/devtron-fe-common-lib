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

import moment from 'moment'

import { DATE_TIME_FORMATS, ZERO_TIME_STRING } from '@Common/Constants'

export const getParsedUpdatedOnDate = (updatedOn: string) => {
    if (!updatedOn || updatedOn === ZERO_TIME_STRING) {
        return ''
    }

    const _moment = moment(updatedOn)

    return _moment.isValid() ? _moment.format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT) : updatedOn
}
