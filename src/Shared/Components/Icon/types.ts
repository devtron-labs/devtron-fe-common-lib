import { FC, SVGProps } from 'react'

type IconMap = Record<string, FC<SVGProps<SVGSVGElement>>>

export interface IconBaseProps {
    name: keyof IconMap
    iconMap: IconMap
    size?: 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 28 | 30 | 32 | 34 | 36 | 40 | 42 | 44 | 48 | 72 | 80
}
