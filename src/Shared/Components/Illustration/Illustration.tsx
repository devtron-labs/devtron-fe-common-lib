// NOTE: This file is auto-generated. Do not edit directly. Run the script `npm run generate-illustration` to update.

import IllustrationCode from '@Illustrations/illustration-code.webp'
import IllustrationManOnRocket from '@Illustrations/illustration-man-on-rocket.webp'
import IllustrationNoResult from '@Illustrations/illustration-no-result.webp'

// eslint-disable-next-line no-restricted-imports
import { IllustrationBase } from './IllustrationBase'
import { IllustrationBaseProps } from './types'

export const illustrationMap = {
    'illustration-code': IllustrationCode,
    'illustration-man-on-rocket': IllustrationManOnRocket,
    'illustration-no-result': IllustrationNoResult,
}

export type IllustrationName = keyof typeof illustrationMap

export interface IllustrationProps extends Omit<IllustrationBaseProps, 'name' | 'illustrationMap'> {
    /**
     * The name of the illustration to render.
     * @note The component will return either an img component or an SVG component based on the type of illustration (.svg, .webp)
     */
    name: keyof typeof illustrationMap
}

export const Illustration = (props: IllustrationProps) => (
    <IllustrationBase {...props} illustrationMap={illustrationMap} />
)
