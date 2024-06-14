interface IframeData {
    URL: string
    width: number
    height: number
    title: string
    order?: number
}

export interface IframeContainerProps {
    iframeList: IframeData[]
    maxHeight?: number
    maxWidth?: number
}

export interface IframeElementProps
    extends Pick<IframeData, 'URL' | 'width' | 'height' | 'title'>,
        Pick<IframeContainerProps, 'maxHeight' | 'maxWidth'> {}
