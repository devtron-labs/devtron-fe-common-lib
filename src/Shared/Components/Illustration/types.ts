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

import { FC, SVGProps } from 'react'

type IllustrationMap = Record<string, FC<SVGProps<SVGSVGElement>> | string>

export interface IllustrationBaseProps {
    /**
     * The name of the illustration to render.
     * @note The component will return either an img component or an SVG component based on the type of illustration (.svg, .webp)
     */
    name: keyof IllustrationMap
    /**
     * A map containing all available illustrations.
     */
    illustrationMap: IllustrationMap
    /**
     * A unique identifier for testing purposes, typically used in test automation.
     */
    dataTestId?: string
    /**
     * Additional props to pass to the image element.
     * @note This prop is only used when the illustration is a .webp image.
     */
    imageProps?: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>
    /**
     * Additional props to pass to the SVG element.
     */
    svgProps?: React.SVGProps<SVGSVGElement>
}
