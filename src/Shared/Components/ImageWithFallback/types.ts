import { ImgHTMLAttributes } from 'react'

export interface ImageWithFallbackProps {
    /**
     * Props for the image
     */
    imageProps: ImgHTMLAttributes<HTMLImageElement>
    /**
     * Fallback image; can be a url or a jsx element
     */
    fallbackImage: string | JSX.Element
}
