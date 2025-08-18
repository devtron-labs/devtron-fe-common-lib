// NOTE: This file is auto-generated. Do not edit directly. Run the script `npm run generate-illustration` to update.

import ImgCode from '@Illustrations/img-code.webp'
import ImgManOnRocket from '@Illustrations/img-man-on-rocket.webp'
import { ReactComponent as ImgMechanicalOperation } from '@Illustrations/img-mechanical-operation.svg'
import ImgNoResult from '@Illustrations/img-no-result.webp'

// eslint-disable-next-line no-restricted-imports
import { IllustrationBase } from './IllustrationBase'
import { IllustrationBaseProps } from './types'

export const illustrationMap = {
    'img-mechanical-operation': ImgMechanicalOperation,
    'img-code': ImgCode,
    'img-man-on-rocket': ImgManOnRocket,
    'img-no-result': ImgNoResult,
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
