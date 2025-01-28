// NOTE: This file is auto-generated. Do not edit directly. Run the script `npm run generate-icon` to update.

import { ReactComponent as ICClock } from '@IconsV2/ic-clock.svg'

import { IconBase } from './IconBase'
import { IconBaseProps } from './types'

const iconMap = {
    'ic-clock': ICClock,
}

export type IconName = keyof typeof iconMap

export interface IconsProps extends Omit<IconBaseProps, 'name' | 'iconMap'> {
    name: keyof typeof iconMap
}

export const Icon = (props: IconsProps) => <IconBase {...props} iconMap={iconMap} />
