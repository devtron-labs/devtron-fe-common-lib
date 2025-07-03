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

import { IllustrationBaseProps } from './types'

export const IllustrationBase = ({
    name,
    illustrationMap,
    dataTestId,
    imageProps,
    svgProps,
}: IllustrationBaseProps) => {
    const IllustrationComponent = illustrationMap[name]

    if (!IllustrationComponent) {
        throw new Error(`Illustration with name "${name}" does not exist.`)
    }

    if (typeof IllustrationComponent === 'string') {
        return <img src={IllustrationComponent} alt={name} {...imageProps} data-testid={dataTestId} />
    }

    return <IllustrationComponent {...svgProps} data-testid={dataTestId} />
}
