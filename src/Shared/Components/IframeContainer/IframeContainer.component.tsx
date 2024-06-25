import IframeElement from './IframeElement'
import { IframeContainerProps } from './types'

const IframeContainer = ({ iframeList, maxHeight = 300, maxWidth = 300 }: IframeContainerProps) => {
    const sortedIframeList = iframeList.sort((a, b) => (a?.order || 0) - (b?.order || 0))

    return (
        <div className="flexbox dc__gap-16 flex-wrap w-100">
            {sortedIframeList.map((iframeData, index) => (
                <IframeElement
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    URL={iframeData.URL}
                    width={iframeData.width}
                    height={iframeData.height}
                    title={iframeData.title}
                    maxHeight={maxHeight}
                    maxWidth={maxWidth}
                />
            ))}
        </div>
    )
}

export default IframeContainer
