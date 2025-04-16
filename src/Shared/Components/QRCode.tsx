import { QRCodeSVG } from 'qrcode.react'
import { IconsProps } from './Icon'

interface QRCodeProps {
    title?: string
    value: string
    size: number
    bgColor: IconsProps['color']
    fgColor: IconsProps['color']
}

const QRCode = ({ title, value, size, bgColor, fgColor }: QRCodeProps) => (
    <QRCodeSVG title={title} value={value} size={size} bgColor={`var(--${bgColor})`} fgColor={`var(--${fgColor})`} />
)

export default QRCode
