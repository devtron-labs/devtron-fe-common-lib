import { FC, SVGAttributes, SVGProps } from 'react'

import { TooltipProps } from '@Common/Tooltip/types'

type IconMap = Record<string, FC<SVGProps<SVGSVGElement>>>

export interface IconBaseProps extends Pick<SVGAttributes<SVGSVGElement>, 'strokeWidth'> {
    name: keyof IconMap
    iconMap: IconMap
    size?: 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 28 | 30 | 32 | 34 | 36 | 40 | 42 | 44 | 48 | 72 | 80
    tooltipProps?: TooltipProps
    color: `${'B' | 'N' | 'G' | 'Y' | 'R' | 'V' | 'O'}${`${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00` | '50'}` | null
}
